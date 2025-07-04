"use client"
import React, { useState } from 'react';
import { Play, Copy, Download, Terminal } from 'lucide-react';

// Mock Monaco Editor component since we don't have access to the actual package
interface MonacoEditorProps {
  height: string;
  defaultLanguage: string;
  value: string;
  onChange: (value: string) => void;
  theme: string;
  options: {
    fontSize: number;
    minimap: { enabled: boolean };
    lineNumbers: string;
    wordWrap: string;
    scrollBeyondLastLine: boolean;
    automaticLayout: boolean;
  };
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ value, onChange }) => {
  return (
    <textarea
      className="w-full h-full bg-black text-white p-4 font-mono text-sm resize-none border-none outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write your code here..."
      style={{ 
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
        minHeight: '400px'
      }}
    />
  );
};

export default function EnhancedCodeEditor() {
  const [text, setText] = useState<string>('// Welcome to the code editor\nfunction hello() {\n  console.log("Hello, World!");\n}\n\nhello();');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('javascript');
  const [showOutput, setShowOutput] = useState<boolean>(false);

  const getCode = async (): Promise<void> => {
    setIsRunning(true);
    setShowOutput(true);
    setOutput(['🚀 Executing code...', 'Processing input...', 'Running analysis...']);
    
    try {
      // Since we can't use axios in artifacts, we'll use fetch instead
      const response = await fetch("/api/codevisuals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: text }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const rawText: string = data.data.rawText;
          console.log(rawText);
          
          // Process the text to remove special characters and clean it up
          const formattedText: string[] = rawText
            .replace(/[*-]/g, "") // Remove '*' and '-' characters
            .replace(/`/g, "") // Remove '`' characters
            .split("\n") // Split into lines
            .filter((line: string) => line.trim() !== ""); // Remove empty lines

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
        "An error occurred while connecting to the server.",
        "Please check your connection and try again.",
        "",
        `Error details: ${error instanceof Error ? error.message : 'Unknown error'}`
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
    a.download = `code.${language === 'javascript' ? 'js' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sm:h-[93vh] pt-16 bg-green-500 text-white ">
      {/* Mobile Header */}
      <div className="md:hidden bg-black border-b border-gray-800 p-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Code Editor</h1>
          <div className="flex gap-2">
            <button
              onClick={copyCode}
              className="p-2 bg-gray-900 hover:bg-gray-800 rounded transition-colors"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={downloadCode}
              className="p-2 bg-gray-900 hover:bg-gray-800 rounded transition-colors"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden bg-black border-b border-gray-800">
        <div className="flex">
          <button
            onClick={() => setShowOutput(false)}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              !showOutput
                ? 'bg-white text-black border-b-2 border-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Terminal size={16} className="inline mr-2" />
            Editor
          </button>
          <button
            onClick={() => setShowOutput(true)}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              showOutput
                ? 'bg-white text-black border-b-2 border-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Play size={16} className="inline mr-2" />
            Output
          </button>
        </div>
      </div>
      <div className="md:hidden p-3 bg-black border-t border-gray-800">
            <button
              onClick={getCode}
              disabled={isRunning}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded font-medium transition-colors ${
                isRunning
                  ? 'bg-gray-800 cursor-not-allowed border border-gray-700'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              <Play size={16} />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
      {/* Main Content */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] md:h-[90vh]">
        {/* Editor Section */}
        <div className={`${showOutput ? 'hidden' : 'flex'} md:flex md:w-1/2 flex-col bg-black h-full`}>
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center py-3 px-4 border-b border-gray-800">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold">Code Editor</h2>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-900 text-white px-3 py-1 rounded text-sm border border-gray-700"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyCode}
                className="p-2 bg-gray-900 hover:bg-gray-800 rounded transition-colors border border-gray-700"
                title="Copy Code"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={downloadCode}
                className="p-2 bg-gray-900 hover:bg-gray-800 rounded transition-colors border border-gray-700"
                title="Download Code"
              >
                <Download size={16} />
              </button>
              <button
                onClick={getCode}
                disabled={isRunning}
                className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors border ${
                  isRunning
                    ? 'bg-gray-800 cursor-not-allowed border-gray-700'
                    : 'bg-white text-black hover:bg-gray-100 border-white'
                }`}
              >
                <Play size={16} />
                {isRunning ? 'Running...' : 'Run'}
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 border border-gray-800 m-2 rounded overflow-hidden">
            <MonacoEditor
              height="100%"
              defaultLanguage={language}
              value={text}
              onChange={(value) => setText(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                lineNumbers: "on",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Mobile Run Button */}
          
        </div>

        {/* Output Section */}
        <div className={`${!showOutput ? 'hidden' : 'flex'} md:flex md:w-1/2 flex-col bg-black h-full md:border-l border-gray-800`}>
          {/* Output Header */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-800">
            <h2 className="font-semibold">Output</h2>
            <button
              onClick={() => setOutput([])}
              className="px-3 py-1 bg-gray-900 hover:bg-gray-800 rounded text-sm transition-colors border border-gray-700"
            >
              Clear
            </button>
          </div>

          {/* Output Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {output.length > 0 ? (
              output.map((line, index) => {
                // Check for headings and add styles
                if (
                  line.toLowerCase().includes("final output") ||
                  line.toLowerCase().includes("execution steps") ||
                  line.toLowerCase().includes("initial input") ||
                  line.includes("===")
                ) {
                  return (
                    <p key={index} className="mb-4 text-lg font-bold text-white">
                      {line}
                    </p>
                  );
                }
                // Error messages
                if (line.toLowerCase().includes("error") || line.includes("❌")) {
                  return (
                    <p key={index} className="mb-2 text-gray-300 font-medium">
                      {line}
                    </p>
                  );
                }
                // Success messages
                if (line.includes("✅") || line.toLowerCase().includes("success")) {
                  return (
                    <p key={index} className="mb-2 text-white font-medium">
                      {line}
                    </p>
                  );
                }
                // Regular lines
                return (
                  <p key={index} className="mb-2 text-gray-300 leading-relaxed">
                    {line}
                  </p>
                );
              })
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <Terminal size={48} className="mx-auto mb-4 opacity-50" />
                <p>No output to display yet.</p>
                <p className="text-sm mt-2">Run your code to see the results here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}