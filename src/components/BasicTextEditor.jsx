// src/components/BasicTextEditor.jsx
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const BasicTextEditor = forwardRef(({ onSave, initialContent }, ref) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(initialContent || "");

  // When initialContent changes, update the editor's innerHTML.
  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleFormat = (command) => {
    document.execCommand(command, false, null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileURL = e.target.result;
        let html = "";
        if (file.type.startsWith("image/")) {
          html = `<img src="${fileURL}" alt="Inserted Image" class="max-w-full my-2" />`;
        } else if (file.type === "application/pdf") {
          html = `<a href="${fileURL}" target="_blank" class="text-blue-600 underline my-2">View PDF</a>`;
        }
        document.execCommand("insertHTML", false, html);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save the current editor content.
  const handleSave = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      onSave && onSave(htmlContent);
      return htmlContent;
    }
    return "";
  };

  // Expose a triggerSave method to the parent.
  useImperativeHandle(ref, () => ({
    triggerSave: handleSave
  }));

  return (
    <div className="basic-text-editor max-w-2xl mx-auto p-4">
      <div className="toolbar flex flex-wrap items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className="px-3 py-1 border rounded hover:bg-gray-200 transition-colors"
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className="px-3 py-1 border rounded hover:bg-gray-200 transition-colors"
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => handleFormat('underline')}
          className="px-3 py-1 border rounded hover:bg-gray-200 transition-colors"
        >
          Underline
        </button>
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-1"
          accept="image/*,application/pdf"
        />
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="border p-4 min-h-[200px] rounded"
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
      ></div>
      {/* Optional save button if you want manual saving */}
      <button
        type='button'
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Save
      </button>
    </div>
  );
});

export default BasicTextEditor;
