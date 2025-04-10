import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import api from "../services/api";

const TinyMICSolutionEditor = ({ initialData, onChange }) => {
  // Store initial data so that the editor isn't re-initialized each render.
  const initialContentRef = useRef(initialData);
  const editorRef = useRef(null);

  // Function to update preview (if needed)
  const handleShowContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const previewEl = document.getElementById("editor-preview");
      if (previewEl) {
        // Wrap content in a container using the shared CSS class
        previewEl.innerHTML = `<div class="solution-content">${content}</div>`;
        
        // Add copy buttons to code blocks (unchanged)
        const codeBlocks = previewEl.querySelectorAll("pre");
        codeBlocks.forEach((pre) => {
          pre.style.overflow = "visible";
          pre.style.position = "relative";
          const copyBtn = document.createElement("button");
          copyBtn.textContent = "Copy";
          copyBtn.style.position = "absolute";
          copyBtn.style.top = "4px";
          copyBtn.style.right = "4px";
          copyBtn.style.fontSize = "12px";
          copyBtn.style.padding = "2px 4px";
          copyBtn.style.cursor = "pointer";
          copyBtn.style.zIndex = "10";
          copyBtn.addEventListener("click", () => {
            const codeText = pre.textContent || "";
            navigator.clipboard
              .writeText(codeText)
              .then(() => {
                copyBtn.textContent = "Copied!";
                setTimeout(() => {
                  copyBtn.textContent = "Copy";
                }, 1500);
              })
              .catch(() => {
                alert("Failed to copy code.");
              });
          });
          pre.appendChild(copyBtn);
        });
      }
    }
  };

  return (
    <div style={{ width: "90%", margin: "auto", marginTop: "20px" }}>
      <h1 style={{ textAlign: "center" }}>
        TinyMCE – Custom Draggable Text Blocks (Images are Default)
      </h1>

      <Editor
        apiKey={ import.meta.env.VITE_TINY_EDITOR_API_KEY }
        onEditorChange={(newContent, editor) => {
          onChange(newContent);
        }}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={initialContentRef.current || "<p></p>"}
        init={{
          height: 500,
          menubar: true,
          plugins: [
            "codesample",
            "fullscreen",
            "a11ychecker",
            "advlist",
            "advcode",
            "advtable",
            "autolink",
            "checklist",
            "export",
            "lists",
            "link",
            "image",  // default image plugin remains active
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "powerpaste",
            "formatpainter",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
            "code",
          ],
          toolbar:
            "codesample fullscreen | image | preview | casechange blocks | " +
            "bold italic backcolor | alignleft aligncenter alignright " +
            "alignjustify | bullist numlist checklist outdent indent | " +
            "removeformat | a11ycheck code table help",
          
          // Keep full iframe access for DOM manipulation:
          iframe_attrs: {
            sandbox: "allow-scripts allow-same-origin",
          },

          extended_valid_elements:
            "img[class|src|border|alt|title|width|height|style|draggable]," +
            "div[class|contenteditable|style|data-*]",
          
          // Load shared CSS for consistency.
          content_css: "/styles/solution-styles.css",
          
          // Inline styles for the editor (only for text boxes).
          // Note: We removed any style forcing images to be absolute.
          content_style: `
            /* Movable text block styles */
            .movable-text {
              position: absolute;
              border: 1px dashed #999;
              background: #ffff88;
              resize: both;
              overflow: auto;
              min-width: 60px;
              min-height: 40px;
            }
            .movable-text-handle {
              display: flex;
              align-items: center;
              background: #ccc;
              height: 22px;
              cursor: move;
              user-select: none;
              padding: 0 4px;
              font-size: 12px;
            }
            .movable-text-body {
              min-height: 22px;
              padding: 5px;
              outline: none;
            }
            /* Code block styling */
            pre[class*='language-'] {
              background: #000 !important;
              color: #ddd !important;
              border-radius: 4px;
              padding: 10px;
            }
            pre[class*='language-'] code {
              background: transparent !important;
              color: #ddd !important;
            }
          `,
          setup: (editor) => {
            editor.on("init", () => {
              const doc = editor.getDoc();
              const body = doc.body;

              // A) Double/triple click logic for creating movable text blocks.
              body.addEventListener("click", (e) => {
                if (
                  e.target.closest(".movable-text") ||
                  e.target.closest(".custom-resize-handle")
                ) {
                  return;
                }
                const bodyRect = body.getBoundingClientRect();
                const x = e.clientX - bodyRect.left;
                const y = e.clientY - bodyRect.top;
                if (e.detail === 3) {
                  e.preventDefault();
                  createTextBlock(x, y);
                  editor.setDirty(true);
                  editor.fire("change");
                } else if (e.detail === 2) {
                  e.preventDefault();
                  placeCaretAtPoint(e.clientX, e.clientY);
                }
              });

              function placeCaretAtPoint(clientX, clientY) {
                if (doc.caretRangeFromPoint) {
                  const range = doc.caretRangeFromPoint(clientX, clientY);
                  if (range) {
                    range.collapse(true);
                    editor.selection.setRng(range);
                    editor.focus();
                  }
                } else {
                  editor.selection.select(editor.getBody(), true);
                  editor.selection.collapse(false);
                  editor.focus();
                }
              }

              function createTextBlock(x, y) {
                const block = doc.createElement("div");
                block.className = "movable-text";
                block.style.left = x + "px";
                block.style.top = y + "px";
                const handle = doc.createElement("div");
                handle.className = "movable-text-handle";
                handle.innerText = "Drag";
                const bodyDiv = doc.createElement("div");
                bodyDiv.className = "movable-text-body";
                bodyDiv.contentEditable = "true";
                bodyDiv.innerHTML = "Type your text here...";
                block.appendChild(handle);
                block.appendChild(bodyDiv);
                body.appendChild(block);
              }

              // B) (Optional) Remove any custom image enhancement.
              // We no longer force images to be draggable—images will now behave
              // with TinyMCE's default inline behavior (allowing positioning via space/enter).

              // C) Pointer events for movable text blocks (keep these)
              let isDragging = false;
              let dragItem = null;
              let offsetX = 0;
              let offsetY = 0;
              let bodyRect = null;
              let isResizing = false;
              let resizeItem = null;
              let startWidth = 0;
              let startHeight = 0;
              let startX = 0;
              let startY = 0;

              const onPointerDown = (e) => {
                // Check for resizing on text blocks only
                const resizeHandle = e.target.closest(".custom-resize-handle");
                if (resizeHandle) {
                  e.preventDefault();
                  e.stopPropagation();
                  isResizing = true;
                  resizeItem = resizeHandle.parentNode;
                  const rect = resizeItem.getBoundingClientRect();
                  if (!resizeItem.style.width) {
                    resizeItem.style.width = rect.width + "px";
                  }
                  if (!resizeItem.style.height) {
                    resizeItem.style.height = rect.height + "px";
                  }
                  startWidth = parseFloat(resizeItem.style.width);
                  startHeight = parseFloat(resizeItem.style.height);
                  startX = e.clientX;
                  startY = e.clientY;
                  return;
                }
                // For text blocks: only add pointer events on movable text handles.
                const handleBar = e.target.closest(".movable-text-handle");
                if (handleBar) {
                  e.preventDefault();
                  isDragging = true;
                  dragItem = handleBar.parentNode;
                  const rect = dragItem.getBoundingClientRect();
                  if (!dragItem.style.left) {
                    dragItem.style.left = rect.left + "px";
                  }
                  if (!dragItem.style.top) {
                    dragItem.style.top = rect.top + "px";
                  }
                  bodyRect = body.getBoundingClientRect();
                  offsetX = e.clientX - bodyRect.left - parseFloat(dragItem.style.left);
                  offsetY = e.clientY - bodyRect.top - parseFloat(dragItem.style.top);
                  return;
                }
              };

              const onPointerMove = (e) => {
                if (isResizing && resizeItem) {
                  const deltaX = e.clientX - startX;
                  const deltaY = e.clientY - startY;
                  resizeItem.style.width = startWidth + deltaX + "px";
                  resizeItem.style.height = startHeight + deltaY + "px";
                  return;
                }
                if (isDragging && dragItem && bodyRect) {
                  e.preventDefault();
                  const pointerX = e.clientX - bodyRect.left;
                  const pointerY = e.clientY - bodyRect.top;
                  dragItem.style.left = pointerX - offsetX + "px";
                  dragItem.style.top = pointerY - offsetY + "px";
                }
              };

              const onPointerUp = () => {
                isDragging = false;
                dragItem = null;
                bodyRect = null;
                isResizing = false;
                resizeItem = null;
                // Critical: force TinyMCE to update its content with new positions.
                const updatedContent = editor.getBody().innerHTML;
                onChange(updatedContent);
                editor.setDirty(true);
                editor.fire("change");
              };

              body.addEventListener("pointerdown", onPointerDown);
              body.addEventListener("pointermove", onPointerMove);
              body.addEventListener("pointerup", onPointerUp);
              body.addEventListener("pointercancel", onPointerUp);

              // D) Deleting blocks (for text blocks or code blocks)
              editor.on("keydown", (evt) => {
                const isCut =
                  (evt.ctrlKey || evt.metaKey) && evt.key.toLowerCase() === "x";
                if (evt.key === "Delete" || isCut) {
                  evt.preventDefault();
                  if (isDragging && dragItem) {
                    if (dragItem.parentNode) {
                      dragItem.parentNode.removeChild(dragItem);
                    }
                    dragItem = null;
                    isDragging = false;
                    editor.setDirty(true);
                    editor.fire("change");
                  } else {
                    const rng = editor.selection.getRng();
                    if (rng && rng.commonAncestorContainer) {
                      let node = rng.commonAncestorContainer;
                      while (node && node.nodeType === 1) {
                        if (node.nodeName === "PRE") {
                          node.remove();
                          editor.setDirty(true);
                          editor.fire("change");
                          break;
                        }
                        node = node.parentNode;
                      }
                    }
                  }
                }
              });
            });
          },
          images_upload_url: "/upload",
          file_picker_types: "image",
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.onchange = async function () {
                const file = this.files[0];
                const formData = new FormData();
                formData.append("file", file);
                try {
                  const res = await api.post("/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });
                  callback(res.data.url, { title: file.name });
                } catch (error) {
                  console.error("Image upload error:", error);
                }
              };
              input.click();
            }
          },
        }}
      />

      <button
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        onClick={handleShowContent}
      >
        Show HTML Content
      </button>

      <div
        id="editor-preview"
        style={{
          position: "relative",
          minwidth: "800px",
          minHeight: "400px",
          border: "1px solid #ccc",
          marginTop: "20px",
          padding: "10px",
          overflow: "auto",
        }}
      ></div>
    </div>
  );
};

export default TinyMICSolutionEditor;
