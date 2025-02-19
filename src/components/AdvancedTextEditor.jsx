// src/components/AdvancedTextEditor.jsx
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import SimpleMDEReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import api from "../services/api";

const options = {
  autofocus: false,
  spellChecker: false,
  autosave: {
    enabled: false,
    uniqueId: "advancedEditor",
    delay: 1000,
  },
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: true,
  },
  toolbar: [
    "bold", "italic", "heading", "|",
    "quote", "code", "table", "horizontal-rule", "unordered-list", "ordered-list", "|",
    {
      name: "link",
      action: (editor) => {
        editor.toggleLink();
      },
      className: "fa fa-link",
      title: "Insert Link",
    },
    {
      name: "uploadImage",
      action: (editor) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.onchange = async function () {
          const file = this.files[0];
          if (!file) return;
          const formData = new FormData();
          formData.append("file", file);
          try {
            const res = await api.post("/upload", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            const imageUrl = res.data.url;
            if (imageUrl) {
              const caption = "Image" || "";
              const html = `<figure style="text-align: center;">
                              <img src="${imageUrl}" alt="${caption}" style="display: block; margin: 0 auto;" width="300" height="150" />
                              ${caption ? `<figcaption>${caption}</figcaption>` : ""}
                            </figure>`;
              editor.codemirror.replaceSelection(html);
            }
            
          } catch (error) {
            console.error("Image upload error:", error);
          }
        };
        input.click();
      },
      className: "fa fa-upload",
      title: "Upload Image",
    },
    "|", "preview", "side-by-side", "fullscreen", "|", "guide"
  ],
};

const AdvancedTextEditor = forwardRef(({ onSave, onChange, initialContent = "" }, ref) => {
  const [value, setValue] = useState(initialContent);
  const editorRef = useRef(null);

  // Update local state when initialContent changes.
  useEffect(() => {
    setValue(initialContent);
  }, [initialContent]);

  // Call onChange on every change, so parent's state is always up-to-date.
  const handleEditorChange = (val) => {
    setValue(val);
    onChange && onChange(val);
  };

  // Expose triggerSave method (if needed).
  useImperativeHandle(ref, () => ({
    triggerSave: () => {
      onSave && onSave(value);
      return value;
    }
  }));

  return (
    <div className="max-w-2xl mx-auto">
      <SimpleMDEReact 
        ref={editorRef}
        value={value}
        onChange={handleEditorChange}
        options={options}
      />
    </div>
  );
});

export default AdvancedTextEditor;
