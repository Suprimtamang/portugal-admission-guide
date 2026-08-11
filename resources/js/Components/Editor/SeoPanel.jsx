function stripHtml(html) {
    return String(html || '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function wordCount(text) {
    if (!text) {
        return 0;
    }
    return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Rank Math–style checklist for post SEO.
 */
export function buildSeoAudit({
    title,
    slug,
    excerpt,
    body,
    metaTitle,
    metaDescription,
    focusKeyword,
    hasFeaturedImage,
}) {
    const plain = stripHtml(body);
    const words = wordCount(plain);
    const keyword = String(focusKeyword || '').trim().toLowerCase();
    const seoTitle = String(metaTitle || title || '').trim();
    const seoDesc = String(metaDescription || excerpt || '').trim();
    const titleLower = seoTitle.toLowerCase();
    const descLower = seoDesc.toLowerCase();
    const bodyLower = plain.toLowerCase();
    const slugLower = String(slug || '').toLowerCase();
    const hasExternalLink = /href=["']https?:\/\//i.test(body || '');
    const hasInternalLink = /href=["']\/[^"']+/i.test(body || '');

    const checks = [
        {
            id: 'title',
            label: 'Post title is set',
            pass: Boolean(title?.trim()),
            tip: 'Add a clear post title.',
        },
        {
            id: 'title_length',
            label: 'SEO title length is 30–60 characters',
            pass: seoTitle.length >= 30 && seoTitle.length <= 60,
            tip: `Current: ${seoTitle.length} chars. Aim for 30–60.`,
        },
        {
            id: 'meta_description',
            label: 'Meta description length is 120–160 characters',
            pass: seoDesc.length >= 120 && seoDesc.length <= 160,
            tip: `Current: ${seoDesc.length} chars. Aim for 120–160.`,
        },
        {
            id: 'permalink',
            label: 'Permalink / slug is set',
            pass: Boolean(slug?.trim()),
            tip: 'Edit the permalink slug for a clean URL.',
        },
        {
            id: 'slug_length',
            label: 'Permalink is short (under 75 characters)',
            pass: slugLower.length > 0 && slugLower.length <= 75,
            tip: 'Shorter URLs are easier to share and rank.',
        },
        {
            id: 'content_length',
            label: 'Content has at least 300 words',
            pass: words >= 300,
            tip: `Current: ${words} words. Add more helpful detail.`,
        },
        {
            id: 'featured_image',
            label: 'Featured image is set',
            pass: Boolean(hasFeaturedImage),
            tip: 'Upload a featured image for social and blog cards.',
        },
        {
            id: 'excerpt',
            label: 'Excerpt is set',
            pass: Boolean(excerpt?.trim()),
            tip: 'Add a short excerpt for listings and fallbacks.',
        },
        {
            id: 'focus_keyword',
            label: 'Focus keyword is set',
            pass: Boolean(keyword),
            tip: 'Pick a primary keyword/phrase for this post.',
        },
        {
            id: 'keyword_in_title',
            label: 'Focus keyword appears in SEO title',
            pass: !keyword || titleLower.includes(keyword),
            tip: 'Include the focus keyword near the start of the title.',
        },
        {
            id: 'keyword_in_description',
            label: 'Focus keyword appears in meta description',
            pass: !keyword || descLower.includes(keyword),
            tip: 'Mention the focus keyword naturally in the description.',
        },
        {
            id: 'keyword_in_content',
            label: 'Focus keyword appears in content',
            pass: !keyword || bodyLower.includes(keyword),
            tip: 'Use the focus keyword in the body copy.',
        },
        {
            id: 'keyword_in_slug',
            label: 'Focus keyword appears in permalink',
            pass: !keyword || slugLower.includes(keyword.replace(/\s+/g, '-')),
            tip: 'Include the keyword in the URL slug when it reads naturally.',
        },
        {
            id: 'external_link',
            label: 'Content has an outbound link',
            pass: hasExternalLink,
            tip: 'Link to an official source (DGES, AIMA, university).',
        },
        {
            id: 'internal_link',
            label: 'Content has an internal link',
            pass: hasInternalLink,
            tip: 'Link to another page on this site (e.g. /blog or /app).',
        },
    ];

    const passed = checks.filter((c) => c.pass).length;
    const score = Math.round((passed / checks.length) * 100);
    const tone =
        score >= 80 ? 'good' : score >= 50 ? 'ok' : 'poor';

    return { checks, passed, total: checks.length, score, tone, words };
}

export default function SeoPanel({
    title,
    slug,
    excerpt,
    body,
    metaTitle,
    metaDescription,
    focusKeyword,
    hasFeaturedImage,
    onChange,
    errors = {},
    siteUrl = '',
}) {
    const audit = buildSeoAudit({
        title,
        slug,
        excerpt,
        body,
        metaTitle,
        metaDescription,
        focusKeyword,
        hasFeaturedImage,
    });

    const previewTitle = (metaTitle || title || 'Post title').slice(0, 60);
    const previewDesc = (
        metaDescription ||
        excerpt ||
        'Meta description preview…'
    ).slice(0, 160);
    const previewUrl = `${siteUrl.replace(/\/$/, '')}/blog/${slug || 'permalink'}`;

    const scoreColor =
        audit.tone === 'good'
            ? 'text-emerald-600'
            : audit.tone === 'ok'
              ? 'text-amber-600'
              : 'text-red-600';

    return (
        <div className="space-y-5">
            <div className="rounded-md border border-crm bg-crm-canvas/40 p-3">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-crm-muted">
                            SEO score
                        </p>
                        <p className={`text-3xl font-semibold ${scoreColor}`}>
                            {audit.score}
                            <span className="text-base font-medium text-crm-muted">
                                /100
                            </span>
                        </p>
                    </div>
                    <p className="text-xs text-crm-muted">
                        {audit.passed}/{audit.total} checks · {audit.words} words
                    </p>
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-crm-heading">
                    Focus keyword
                </label>
                <input
                    className="w-full rounded-md border-crm text-sm"
                    value={focusKeyword}
                    onChange={(e) => onChange('focus_keyword', e.target.value)}
                    placeholder="e.g. portugal national student"
                />
                {errors.focus_keyword && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.focus_keyword}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-crm-heading">
                    Meta title
                </label>
                <input
                    className="w-full rounded-md border-crm text-sm"
                    value={metaTitle}
                    onChange={(e) => onChange('meta_title', e.target.value)}
                    placeholder="Defaults to post title"
                    maxLength={70}
                />
                <p className="mt-1 text-xs text-crm-muted">
                    {(metaTitle || title || '').length}/60 recommended
                </p>
                {errors.meta_title && (
                    <p className="mt-1 text-sm text-red-600">{errors.meta_title}</p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-crm-heading">
                    Meta description
                </label>
                <textarea
                    rows={3}
                    className="w-full rounded-md border-crm text-sm"
                    value={metaDescription}
                    onChange={(e) =>
                        onChange('meta_description', e.target.value)
                    }
                    placeholder="Defaults to excerpt"
                    maxLength={180}
                />
                <p className="mt-1 text-xs text-crm-muted">
                    {(metaDescription || excerpt || '').length}/160 recommended
                </p>
                {errors.meta_description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.meta_description}
                    </p>
                )}
            </div>

            <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-crm-muted">
                    SERP preview
                </p>
                <div className="rounded-md border border-crm bg-white p-3">
                    <p className="truncate text-sm text-[#1a0dab]">
                        {previewTitle}
                    </p>
                    <p className="truncate text-xs text-[#006621]">{previewUrl}</p>
                    <p className="mt-1 text-xs leading-5 text-[#545454]">
                        {previewDesc}
                    </p>
                </div>
            </div>

            <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-crm-muted">
                    SEO audit
                </p>
                <ul className="space-y-2">
                    {audit.checks.map((check) => (
                        <li
                            key={check.id}
                            className="flex gap-2 rounded-md border border-crm bg-white px-3 py-2 text-sm"
                        >
                            <span
                                className={
                                    check.pass
                                        ? 'font-semibold text-emerald-600'
                                        : 'font-semibold text-amber-600'
                                }
                            >
                                {check.pass ? '✓' : '!'}
                            </span>
                            <div>
                                <p className="font-medium text-crm-heading">
                                    {check.label}
                                </p>
                                {!check.pass && (
                                    <p className="text-xs text-crm-muted">
                                        {check.tip}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
