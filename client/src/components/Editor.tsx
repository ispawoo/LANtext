import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { useEffect, useState } from 'react'
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Quote, Code } from 'lucide-react'

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const Editor = ({ content, onChange }: EditorProps) => {
  const [isTyping, setIsTyping] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setIsTyping(true);
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[300px] outline-none',
      },
    },
  });

  // Update content when receiving from peers (only if we aren't the one typing)
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !isTyping) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
    const timeout = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(timeout);
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-surface border border-borderRefined rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-2 p-3 bg-white/5 border-b border-borderRefined">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-primary text-white' : 'hover:bg-white/10 text-gray-300'}`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-primary text-white' : 'hover:bg-white/10 text-gray-300'}`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-primary text-white' : 'hover:bg-white/10 text-gray-300'}`}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </button>
        <div className="w-px h-6 bg-borderRefined mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-white' : 'hover:bg-white/10 text-gray-300'}`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-primary text-white' : 'hover:bg-white/10 text-gray-300'}`}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
        <div className="w-px h-6 bg-borderRefined mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-primary text-white' : 'hover:bg-white/10 text-gray-300'}`}
          title="Quote"
        >
          <Quote size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded-lg transition-colors ${editor.isActive('codeBlock') ? 'bg-primary text-white' : 'hover:bg-white/10 text-gray-300'}`}
          title="Code Block"
        >
          <Code size={18} />
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor.commands.focus()}>
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  )
}
