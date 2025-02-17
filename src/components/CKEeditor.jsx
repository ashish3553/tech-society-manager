// src/components/SolutionEditorCK.jsx
import React, { useState } from 'react';
import { CKEditor } from '@tinymce/ckeditor5-react';
import ClassicEditor from '@tinymce/ckeditor5-build-classic';

function SolutionEditorCK({ initialData, onChange }) {
  const [editorData, setEditorData] = useState(initialData || '');

  return (
    <div className="solution-editor-ck">
      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        config={{
          licenseKey: '', // Leave empty for the free community version
          toolbar: [
            'heading', '|',
            'bold', 'italic', 'underline', '|',
            'bulletedList', 'numberedList', 'blockQuote', '|',
            'link', 'codeBlock', '|',
            'undo', 'redo'
          ],
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setEditorData(data);
          if (onChange) {
            onChange(data);
          }
        }}
      />
    </div>
  );
}

export default SolutionEditorCK;
