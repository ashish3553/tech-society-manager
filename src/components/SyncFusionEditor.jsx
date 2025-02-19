// src/components/SyncfusionEditor.jsx
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { RichTextEditorComponent } from '@syncfusion/ej2-react-richtexteditor';
// Import Syncfusion editor styles (you can choose a different theme if desired)
import '@syncfusion/ej2-react-richtexteditor/styles/material.css';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-buttons/styles/material.css';

const SyncfusionEditor = forwardRef(({ onSave, initialContent = "" }, ref) => {
  const [value, setValue] = useState(initialContent);

  // Update editor state when initialContent changes.
  useEffect(() => {
    setValue(initialContent);
  }, [initialContent]);

  // Expose a triggerSave method so parent can force a save.
  useImperativeHandle(ref, () => ({
    triggerSave: () => {
      onSave && onSave(value);
      return value;
    }
  }));

  return (
    <div>
      <RichTextEditorComponent 
        value={value}
        change={(e) => setValue(e.value)}
      />
      {/* Optional manual save button */}
      <button
        type="button"
        onClick={() => onSave && onSave(value)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Save Content
      </button>
    </div>
  );
});

export default SyncfusionEditor;
