"use client";

import React, { useState } from 'react';
import { 
  Play, Copy, Download, Terminal, 
  Code2, Eraser, Loader2,
  FileCode, ChevronDown
} from 'lucide-react';

// --- MOCK MONACO EDITOR (Light Theme) ---
interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language:string
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ value, onChange, language }) => {
  return (
    <div className="relative h-full w-full bg-white font-mono text-sm group">
      {/* Line Numbers */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-50 border-r border-slate-200 text-slate-400 flex flex-col items-end pr-3 pt-4 select-none">
        {value.split('\n').map((_, i) => (
          <div key={i} className="leading-6 text-xs">{i + 1}</div>
        ))}
      </div>
      
      {/* Text Area */}
      <textarea
        className="w-full h-full bg-transparent text-slate-800 resize-none border-none outline-none p-4 pl-14 leading-6 font-mono whitespace-pre placeholder:text-slate-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Write your ${language} code here...`}
        spellCheck={false}
      />
    </div>
  );
};

export default function EnhancedCodeEditor() {
  const [text, setText] = useState<string>('// Welcome to the code editor\nfunction hello() {\n  console.log("Hello, World!");\n}\n\nhello();');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('javascript');
  const [activeTab, setActiveTab] = useState<'editor' | 'output'>('editor'); // For mobile

  const getCode = async (): Promise<void> => {
    setIsRunning(true);
    // Auto-switch to output on mobile when running
    if (window.innerWidth < 768) setActiveTab('output');
    
    setOutput(['🚀 Executing code...', 'Processing input...', 'Running analysis...']);
    
    try {
      const response = await fetch("/api/codevisuals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: text }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const rawText: string = data.data.rawText;
          // Clean up text
          const formattedText: string[] = rawText
            .replace(/[*-]/g, "")
            .replace(/`/g, "")
            .split("\n")
            .filter((line: string) => line.trim() !== "");

          setOutput(formattedText);
        } else {
          setOutput(["Failed to fetch data. Please try again."]);
        }
      } else {
        setOutput([`HTTP Error: ${response.status} ${response.statusText}`]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setOutput([
        "❌ Connection Error",
        `Details: ${error instanceof Error ? error.message : 'Unknown error'}`
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = (): void => {
    navigator.clipboard.writeText(text);
  };

  const downloadCode = (): void => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // a.download = `code.${language === 'javascript' ? 'js' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-16 bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
        
        {/* Title & Language Selector */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Code2 size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800">Code Playground</h1>
              <p className="text-xs text-slate-500">Execution Environment</p>
            </div>
          </div>

          <div className="relative group">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>
            <FileCode size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button onClick={copyCode} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Copy">
            <Copy size={18} />
          </button>
          <button onClick={downloadCode} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Download">
            <Download size={18} />
          </button>
          
          <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />
          
          <button
            onClick={getCode}
            disabled={isRunning}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all
              ${isRunning 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95'}
            `}
          >
            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
            <span className="hidden sm:inline">{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* --- MOBILE TABS --- */}
      <div className="md:hidden flex border-b border-slate-200 bg-white">
        <button 
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'editor' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
        >
          Editor
        </button>
        <button 
          onClick={() => setActiveTab('output')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'output' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
        >
          Output
        </button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* EDITOR SECTION */}
        <div className={`
          flex-1 bg-white flex flex-col border-r border-slate-200 transition-all duration-300
          ${activeTab === 'editor' ? 'flex' : 'hidden md:flex'}
        `}>
          <div className="flex-1 relative overflow-hidden">
             <MonacoEditor value={text} onChange={setText}  language={language}/>
          </div>
        </div>

        {/* OUTPUT SECTION */}
        <div className={`
          w-full md:w-[45%] lg:w-[40%] bg-slate-50 flex flex-col transition-all duration-300
          ${activeTab === 'output' ? 'flex' : 'hidden md:flex'}
        `}>
          {/* Output Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <Terminal size={14} />
              <span>Console Output</span>
            </div>
            <button 
              onClick={() => setOutput([])}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
            >
              <Eraser size={12} />
              Clear
            </button>
          </div>

          {/* Output Content */}
          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
            {output.length > 0 ? (
              <div className="space-y-2">
                {output.map((line, index) => {
                  const lowerLine = line.toLowerCase();
                  let styleClass = "text-slate-600 pl-2 border-l-2 border-slate-200";

                  if (lowerLine.includes("error") || lowerLine.includes("❌")) {
                    styleClass = "text-red-600 bg-red-50 p-2 rounded border-l-2 border-red-500";
                  } else if (lowerLine.includes("success") || line.includes("✅")) {
                    styleClass = "text-emerald-700 bg-emerald-50 p-2 rounded border-l-2 border-emerald-500";
                  } else if (lowerLine.includes("executing") || lowerLine.includes("processing")) {
                    styleClass = "text-indigo-600 italic pl-2 border-l-2 border-indigo-200";
                  } else if (line.includes("===")) {
                    styleClass = "text-slate-900 font-bold mt-4 border-b border-slate-200 pb-1";
                  }

                  return (
                    <div key={index} className={`${styleClass} break-words`}>
                      {line}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200/50 flex items-center justify-center">
                  <Terminal size={24} />
                </div>
                <p>Run code to see output...</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}