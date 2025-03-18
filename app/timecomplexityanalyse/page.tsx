"use client"

import { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function Home() {
  const [code, setCode] = useState("// Enter your JavaScript code here");
  const [result, setResult] = useState(null);

  const analyzeCode = async () => {
    try {
      const response = await axios.post("/api/analyze", { code });
      setResult(response.data);
    } catch (error) {
      console.error("Error analyzing code", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold mb-4">Time Complexity Analyzer</h1>
      <div className="w-full h-80 border">
        <MonacoEditor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={(newValue) => setCode(newValue ?? "")} // Fix here
        />
      </div>
      <button
        onClick={analyzeCode}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Analyze Code
      </button>
      {result && (
        <div className="mt-5 p-4 border w-full">
          <h2 className="text-lg font-semibold">Analysis Result:</h2>
          <pre className="bg-gray-100 p-2">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
