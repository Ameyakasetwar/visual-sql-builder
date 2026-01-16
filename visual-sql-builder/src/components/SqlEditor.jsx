import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { githubLight } from '@uiw/codemirror-theme-github'; // Light theme
import { RefreshCw } from 'lucide-react';

const SqlEditor = ({ sql: sqlCode, onSqlChange, isModified, onSync }) => {
  return (
    <div className="vsqb-sql-shell">
        <div className="vsqb-sql-header">
            <h3 className="font-semibold text-sm">SQL Editor</h3>
            {isModified && (
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                        SQL Modified
                    </span>
                     <button onClick={onSync} className="flex items-center gap-1 text-sm text-blue-600 hover:underline" title="Attempt to sync manual SQL changes back to the UI builder.">
                        <RefreshCw size={14} /> Sync to UI
                    </button>
                </div>
            )}
        </div>
      <CodeMirror
        value={sqlCode}
        height="100%"
        extensions={[sql()]}
        onChange={(value) => onSqlChange(value)}
        className="flex-grow overflow-auto text-sm"
        theme={githubLight} // Use the light theme
      />
    </div>
  );
};
export default SqlEditor;
