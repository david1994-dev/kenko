"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

type Props = { id: string; name: string; initialHtml: string };

function Btn({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-sm font-bold disabled:opacity-40 ${
        active ? "bg-navy text-white" : "text-ink hover:bg-mist"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ id, name, initialHtml }: Props) {
  const [html, setHtml] = useState(initialHtml);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true },
        code: false,
        codeBlock: false,
        strike: false,
      }),
    ],
    content: initialHtml,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => setHtml(e.isEmpty ? "" : e.getHTML()),
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-multiline": "true",
        class: "rich min-h-[180px] px-3 py-2.5 outline-none",
      },
    },
  });

  const s = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            underline: e.isActive("underline"),
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            ul: e.isActive("bulletList"),
            ol: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
            canUndo: e.can().undo(),
            canRedo: e.can().redo(),
          }
        : null,
  });

  const run = () => editor?.chain().focus();

  function applyLink() {
    const url = linkUrl.trim();
    if (!url) return;
    const href = /^(https?:|mailto:|tel:)/i.test(url) ? url : `https://${url}`;
    run()?.extendMarkRange("link").setLink({ href }).run();
    setLinkOpen(false);
    setLinkUrl("");
  }

  return (
    <div className="rounded-lg border border-edge bg-white focus-within:border-teal">
      <input type="hidden" name={name} value={html} />
      <div role="toolbar" aria-label="Định dạng" className="flex flex-wrap gap-1 border-b border-line p-1.5">
        <Btn label="In đậm" active={s?.bold} onClick={() => run()?.toggleBold().run()}>B</Btn>
        <Btn label="In nghiêng" active={s?.italic} onClick={() => run()?.toggleItalic().run()}><span className="italic">I</span></Btn>
        <Btn label="Gạch chân" active={s?.underline} onClick={() => run()?.toggleUnderline().run()}><span className="underline">U</span></Btn>
        <span className="mx-1 w-px self-stretch bg-line" aria-hidden="true" />
        <Btn label="Tiêu đề lớn" active={s?.h2} onClick={() => run()?.toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn label="Tiêu đề nhỏ" active={s?.h3} onClick={() => run()?.toggleHeading({ level: 3 }).run()}>H3</Btn>
        <span className="mx-1 w-px self-stretch bg-line" aria-hidden="true" />
        <Btn label="Danh sách chấm" active={s?.ul} onClick={() => run()?.toggleBulletList().run()}>• Dòng</Btn>
        <Btn label="Danh sách số" active={s?.ol} onClick={() => run()?.toggleOrderedList().run()}>1. Dòng</Btn>
        <Btn label="Trích dẫn" active={s?.quote} onClick={() => run()?.toggleBlockquote().run()}>“ ”</Btn>
        <Btn
          label="Chèn liên kết"
          active={s?.link}
          onClick={() => {
            setLinkUrl(editor?.getAttributes("link").href ?? "");
            setLinkOpen((v) => !v);
          }}
        >
          Link
        </Btn>
        <span className="mx-1 w-px self-stretch bg-line" aria-hidden="true" />
        <Btn label="Hoàn tác" disabled={!s?.canUndo} onClick={() => run()?.undo().run()}>↶</Btn>
        <Btn label="Làm lại" disabled={!s?.canRedo} onClick={() => run()?.redo().run()}>↷</Btn>
      </div>

      {linkOpen && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line bg-ground p-2">
          <label htmlFor={`${id}-link`} className="sr-only">Địa chỉ liên kết</label>
          <input
            id={`${id}-link`}
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
            }}
            placeholder="https://..."
            className="h-10 min-w-0 flex-1 rounded-lg border border-edge bg-white px-3 text-sm outline-none focus:border-teal"
          />
          <button type="button" onClick={applyLink} className="h-10 rounded-lg bg-cta px-4 text-sm font-bold text-white">
            Gắn link
          </button>
          {s?.link && (
            <button
              type="button"
              onClick={() => {
                run()?.extendMarkRange("link").unsetLink().run();
                setLinkOpen(false);
              }}
              className="h-10 rounded-lg border border-edge px-4 text-sm font-semibold text-price"
            >
              Gỡ link
            </button>
          )}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
