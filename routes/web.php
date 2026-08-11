<?php

use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AimaGuideController;
use App\Http\Controllers\ApplicantController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\RoadmapController;
use App\Http\Controllers\SupportTicketController;
use App\Http\Controllers\UniversityDirectoryController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('landing');

Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');

Route::get('/dashboard', function () {
    return redirect()->route('app.dashboard');
})->middleware(['auth'])->name('dashboard');

Route::middleware(['auth'])->prefix('app')->name('app.')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');
    Route::get('/roadmap', [RoadmapController::class, 'index'])->name('roadmap');
    Route::get('/aima', AimaGuideController::class)->name('aima');
    Route::post('/aima/documents', [AimaGuideController::class, 'toggleDocument'])
        ->name('aima.documents.toggle');
    Route::get('/universities', UniversityDirectoryController::class)->name('universities');
    Route::get('/chat', [ChatController::class, 'index'])->name('chat');
    Route::post('/chat', [ChatController::class, 'store'])->name('chat.store');

    Route::get('/support', [SupportTicketController::class, 'index'])->name('support.index');
    Route::get('/support/new', [SupportTicketController::class, 'create'])->name('support.create');
    Route::post('/support', [SupportTicketController::class, 'store'])->name('support.store');
    Route::get('/support/{ticket}', [SupportTicketController::class, 'show'])->name('support.show');
    Route::post('/support/{ticket}/reply', [SupportTicketController::class, 'reply'])->name('support.reply');
    Route::patch('/support/{ticket}', [SupportTicketController::class, 'updateStatus'])
        ->middleware('role:superadmin')
        ->name('support.update');

    Route::middleware('role:superadmin')->group(function () {
        Route::get('/applicants', [ApplicantController::class, 'index'])->name('applicants.index');
        Route::get('/applicants/{user}', [ApplicantController::class, 'show'])->name('applicants.show');
        Route::get('/admins', [AdminUserController::class, 'index'])->name('admins.index');
        Route::patch('/admins/{user}', [AdminUserController::class, 'update'])->name('admins.update');
    });
});

Route::middleware('auth')->group(function () {
    Route::post('/progress/{checklistItem}', [ProgressController::class, 'toggle'])
        ->name('progress.toggle');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
