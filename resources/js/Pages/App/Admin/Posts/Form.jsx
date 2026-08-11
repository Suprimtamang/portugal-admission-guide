import AppLayout from '@/Layouts/AppLayout';
import CrmCard from '@/Components/Crm/CrmCard';
import PageHeader from '@/Components/Crm/PageHeader';
import RichTextEditor from '@/Components/Editor/RichTextEditor';
import SeoPanel from '@/Components/Editor/SeoPanel';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

function toEditorHtml(body) {
    if (!body) {
        return '';
    }
    if (/<\/?[a-z][\s\S]*>/i.test(body)) {
        return body;
    }
    return `<p>${String(body)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n\n+/g, '</p><p>')
        .replace(/\n/g, '<br>')}</p>`;
}

export default function Form({ post }) {
    const editing = Boolean(post?.id);
    const { appUrl } = usePage().props;
    const [previewUrl, setPreviewUrl] = useState(post?.cover_image_url || null);

    const { data, setData, post: create, put, processing, errors } =
        useForm({
            title: post?.title || '',
            slug: post?.slug || '',
            excerpt: post?.excerpt || '',
            body: toEditorHtml(post?.body || ''),
            status: post?.status || 'draft',
            published_at: post?.published_at || '',
            meta_title: post?.meta_title || '',
            meta_description: post?.meta_description || '',
            focus_keyword: post?.focus_keyword || '',
            cover_image: null,
            remove_cover_image: false,
        });

    const hasFeaturedImage = useMemo(
        () => Boolean(previewUrl) && !data.remove_cover_image,
        [previewUrl, data.remove_cover_image],
    );

    const onCoverChange = (e) => {
        const file = e.target.files?.[0] || null;
        setData('cover_image', file);
        setData('remove_cover_image', false);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearCover = () => {
        setData('cover_image', null);
        setData('remove_cover_image', true);
        setPreviewUrl(null);
    };

    const submit = (e) => {
        e.preventDefault();
        const payload = {
            forceFormData: true,
        };

        if (editing) {
            put(route('app.posts.update', post.id), payload);
            return;
        }
        create(route('app.posts.store'), payload);
    };

    return (
        <AppLayout title={editing ? 'Edit post' : 'New post'}>
            <Head title={editing ? 'Edit post' : 'New post'} />
            <PageHeader
                title={editing ? 'Edit post' : 'New post'}
                breadcrumbs={['Home', 'Posts', editing ? 'Edit' : 'New']}
                action={
                    <Link
                        href={route('app.posts.index')}
                        className="text-sm font-semibold text-crm-primary"
                    >
                        ← All posts
                    </Link>
                }
            />

            <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-6">
                    <CrmCard>
                        <div className="space-y-5">
                            <div>
                                <InputLabel htmlFor="title" value="Title" />
                                <TextInput
                                    id="title"
                                    className="mt-1 block w-full text-lg font-semibold"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.title}
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="slug"
                                    value="Permalink"
                                />
                                <div className="mt-1 flex overflow-hidden rounded-md border border-crm">
                                    <span className="flex items-center bg-crm-canvas px-3 text-xs text-crm-muted">
                                        /blog/
                                    </span>
                                    <input
                                        id="slug"
                                        className="block w-full border-0 text-sm focus:ring-0"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData('slug', e.target.value)
                                        }
                                        placeholder="auto-from-title"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-crm-muted">
                                    {(appUrl || '').replace(/\/$/, '')}/blog/
                                    {data.slug || 'your-slug'}
                                </p>
                                <InputError
                                    className="mt-2"
                                    message={errors.slug}
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="excerpt" value="Excerpt" />
                                <textarea
                                    id="excerpt"
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-crm text-sm"
                                    value={data.excerpt}
                                    onChange={(e) =>
                                        setData('excerpt', e.target.value)
                                    }
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.excerpt}
                                />
                            </div>

                            <div>
                                <InputLabel value="Content" />
                                <div className="mt-1">
                                    <RichTextEditor
                                        value={data.body}
                                        onChange={(html) =>
                                            setData('body', html)
                                        }
                                        placeholder="Write your guide like a WordPress post…"
                                    />
                                </div>
                                <InputError
                                    className="mt-2"
                                    message={errors.body}
                                />
                            </div>
                        </div>
                    </CrmCard>
                </div>

                <div className="space-y-6">
                    <CrmCard title="Publish">
                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="status" value="Status" />
                                <select
                                    id="status"
                                    className="mt-1 block w-full rounded-md border-crm text-sm"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData('status', e.target.value)
                                    }
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="published_at"
                                    value="Publish at"
                                />
                                <input
                                    id="published_at"
                                    type="datetime-local"
                                    className="mt-1 block w-full rounded-md border-crm text-sm"
                                    value={data.published_at}
                                    onChange={(e) =>
                                        setData('published_at', e.target.value)
                                    }
                                />
                                <p className="mt-1 text-xs text-crm-muted">
                                    Leave blank when publishing to use now.
                                </p>
                            </div>
                            <PrimaryButton
                                className="w-full justify-center"
                                disabled={processing}
                            >
                                {editing ? 'Update post' : 'Create post'}
                            </PrimaryButton>
                        </div>
                    </CrmCard>

                    <CrmCard title="Featured image">
                        {previewUrl && !data.remove_cover_image ? (
                            <div className="space-y-3">
                                <img
                                    src={previewUrl}
                                    alt=""
                                    className="max-h-48 w-full rounded-md object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={clearCover}
                                    className="text-sm font-medium text-red-600"
                                >
                                    Remove image
                                </button>
                            </div>
                        ) : (
                            <p className="mb-3 text-sm text-crm-muted">
                                Used on the blog card and social preview.
                            </p>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onCoverChange}
                            className="block w-full text-sm text-crm-muted file:mr-3 file:rounded-md file:border-0 file:bg-crm-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.cover_image}
                        />
                    </CrmCard>

                    <CrmCard title="SEO">
                        <SeoPanel
                            title={data.title}
                            slug={data.slug}
                            excerpt={data.excerpt}
                            body={data.body}
                            metaTitle={data.meta_title}
                            metaDescription={data.meta_description}
                            focusKeyword={data.focus_keyword}
                            hasFeaturedImage={hasFeaturedImage}
                            siteUrl={appUrl || ''}
                            errors={errors}
                            onChange={(key, value) => setData(key, value)}
                        />
                    </CrmCard>
                </div>
            </form>
        </AppLayout>
    );
}
