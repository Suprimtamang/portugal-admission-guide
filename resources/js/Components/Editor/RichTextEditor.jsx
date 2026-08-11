import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { useEffect } from 'react';

function ToolbarButton({ active, onClick, children, title }) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`rounded px-2 py-1 text-xs font-semibold ${
                active
                    ? 'bg-crm-primary/10 text-crm-primary'
                    : 'text-crm-muted hover:bg-crm-canvas hover:text-crm-heading'
            }`}
        >
            {children}
        </button>
    );
}

export default function RichTextEditor({ value, onChange, placeholder }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-crm-primary underline' },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start writing…',
            }),
        ],
        content: value || '',
        onUpdate: ({ editor: current }) => {
            onChange(current.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose-editor min-h-[280px] px-4 py-3 focus:outline-none',
            },
        },
    });

    useEffect(() => {
        if (!editor) {
            return;
        }
        const current = editor.getHTML();
        if ((value || '') !== current && value !== undefined) {
            editor.commands.setContent(value || '', { emitUpdate: false });
        }
    }, [value, editor]);

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previous = editor.getAttributes('link').href;
        const url = window.prompt('Link URL', previous || 'https://');
        if (url === null) {
            return;
        }
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="overflow-hidden rounded-md border border-crm bg-white">
            <div className="flex flex-wrap gap-1 border-b border-crm bg-crm-canvas/60 px-2 py-1.5">
                <ToolbarButton
                    title="Bold"
                    active={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    B
                </ToolbarButton>
                <ToolbarButton
                    title="Italic"
                    active={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    I
                </ToolbarButton>
                <ToolbarButton
                    title="Underline"
                    active={editor.isActive('underline')}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    U
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 2"
                    active={editor.isActive('heading', { level: 2 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    H2
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 3"
                    active={editor.isActive('heading', { level: 3 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                >
                    H3
                </ToolbarButton>
                <ToolbarButton
                    title="Bullet list"
                    active={editor.isActive('bulletList')}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    • List
                </ToolbarButton>
                <ToolbarButton
                    title="Numbered list"
                    active={editor.isActive('orderedList')}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    1. List
                </ToolbarButton>
                <ToolbarButton
                    title="Quote"
                    active={editor.isActive('blockquote')}
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                >
                    Quote
                </ToolbarButton>
                <ToolbarButton
                    title="Link"
                    active={editor.isActive('link')}
                    onClick={setLink}
                >
                    Link
                </ToolbarButton>
                <ToolbarButton
                    title="Undo"
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    Undo
                </ToolbarButton>
                <ToolbarButton
                    title="Redo"
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    Redo
                </ToolbarButton>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
