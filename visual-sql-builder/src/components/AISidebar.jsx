import React, { useState } from 'react';
import { Sparkles, Bot, X, Clipboard, Settings, Lightbulb } from 'lucide-react'; // Added Lightbulb icon

const AISidebar = ({ schema, onUseQuery, onClose, dbType, backendUrl }) => {
    const [userInput, setUserInput] = useState('');
    
    // NEW: State for explanation
    const [aiResult, setAiResult] = useState({ sql: '', explanation: '' });
    
    const [isLoading, setIsLoading] = useState(false);
    
    const [aiMode, setAiMode] = useState('local'); 
    const [customApiKey, setCustomApiKey] = useState('');

    const handleGenerate = async () => {
        if (!userInput.trim()) return;
        setIsLoading(true);
        setAiResult({ sql: '', explanation: '' }); // Reset previous result
        
        const payload = {
            userInput,
            schema,
            dbType,
            mode: aiMode,
            customKey: aiMode === 'custom' ? customApiKey : null
        };

        try {
            const response = await fetch(`${backendUrl}/api/generate-query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (response.ok) {
                // Update state with both SQL and Explanation
                setAiResult({ sql: data.sqlQuery, explanation: data.explanation });
            } else {
                setAiResult({ sql: `-- Error: ${data.error}`, explanation: '' });
            }
        } catch (error) {
            setAiResult({ sql: `-- Network Error.`, explanation: '' });
        }
        setIsLoading(false);
    };
    
    const handleCopy = () => {
        if (aiResult.sql) navigator.clipboard.writeText(aiResult.sql).then(() => alert('Copied!'));
    };

    return (
        <div className="vsqb-ai-sidebar">
            <div className="vsqb-ai-header">
                <div className="flex items-center gap-2">
                    <Bot size={20} className="text-blue-500" />
                    <h3 className="font-semibold">AI Assistant</h3>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><X size={18} /></button>
            </div>
            
            <div className="p-3 flex-grow flex flex-col gap-4 overflow-y-auto">
                
                <div className="vsqb-ai-card">
                    <label className="text-xs font-bold mb-2 flex items-center gap-1">
                        <Settings size={12} /> INTELLIGENCE ENGINE
                    </label>
                    <select 
                        value={aiMode} 
                        onChange={(e) => setAiMode(e.target.value)}
                        className="w-full p-2 text-sm border-slate-300 rounded-md mb-2 bg-white cursor-pointer"
                    >
                        <option value="cloud">☁️ Cloud API (Gemini 2.5)</option>
                        <option value="local">🔒 On-Premise AI (Qwen 2.5)</option>
                        <option value="custom">🔑 Custom Enterprise Key</option>
                    </select>
                    {aiMode === 'custom' && <input type="password" placeholder="Paste Key..." value={customApiKey} onChange={(e) => setCustomApiKey(e.target.value)} className="w-full p-2 text-xs border rounded" />}
                </div>

                <div>
                    <p className="text-xs mb-2 text-slate-500 dark:text-slate-300">
                        Ask a question about your <b>{dbType === 'mysql' ? 'MySQL' : 'MariaDB'}</b> data.
                    </p>
                    <textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="e.g., Show me top 5 products by stock"
                        className="w-full h-24 p-2 text-sm border-slate-300 rounded-md bg-white border shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                    />
                    <button onClick={handleGenerate} disabled={isLoading} className="btn-primary mt-2 w-full flex justify-center items-center gap-2">
                        <Sparkles size={16} />
                        <span>{isLoading ? 'Thinking...' : 'Generate SQL'}</span>
                    </button>
                </div>

                {/* --- RESULTS SECTION --- */}
                {aiResult.sql && (
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
                        
                        {/* SQL Code Block */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="text-sm font-semibold">SQL Code:</h4>
                                <button onClick={handleCopy} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                    <Clipboard size={12}/> Copy
                                </button>
                            </div>
                            <pre className="bg-slate-900 text-green-400 p-3 rounded-md text-xs whitespace-pre-wrap font-mono">
                                <code>{aiResult.sql}</code>
                            </pre>
                        </div>

                        {/* NEW: Explanation Box */}
                        {aiResult.explanation && (
                            <div className="bg-blue-50 dark:bg-slate-900 p-3 rounded-md border border-blue-100 dark:border-slate-700">
                                <h4 className="text-xs font-bold flex items-center gap-1 mb-1 text-blue-700 dark:text-blue-300">
                                    <Lightbulb size={12} /> Explanation:
                                </h4>
                                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                                    {aiResult.explanation}
                                </p>
                            </div>
                        )}

                        <button onClick={() => onUseQuery(aiResult.sql)} className="btn-secondary w-full">
                            Run this Query
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AISidebar;
