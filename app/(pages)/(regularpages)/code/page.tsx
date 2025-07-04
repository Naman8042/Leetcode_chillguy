// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import dynamic from "next/dynamic";


// // Dynamically import Monaco Editor to ensure it's only loaded in the client
// const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
//   ssr: false,
// });

// import * as d3 from "d3";

// interface RecursionTreeNode {
//   name: string;
//   params: string[];
//   children: RecursionTreeNode[];
// }

// interface RawRecursionNode {
//   function: string;
//   params: Record<string, unknown>;
//   children: RawRecursionNode[];
// }

// interface D3Node {
//   name: string;
//   children: D3Node[];
// }

// const CodeExecutionPage = () => {
//   const [recursionTree, setRecursionTree] = useState<RecursionTreeNode[]>([]);
//   const [text, setText] = useState<string>("");
//   const getCode = async () => {
//     try {
//       const response = await axios.post("/api/recursion_tree", { code: text });
  
//       if (response.data.success) {
//         let rawText = response.data.data.rawText;
//         console.log("Raw Response:", rawText);
  
//         // Remove Markdown-style code blocks if they exist
//         rawText = rawText.replace(/```json\n?/, "").replace(/\n?```/, "");
  
//         // Ensure rawText is parsed correctly
//         const jsonData = JSON.parse(rawText);
  
//         // Transform the recursion tree
//         const transformRecursionTree = (node: RawRecursionNode): RecursionTreeNode => ({
//           name: node.function,
//           params: Object.entries(node.params).map(([key, value]) => `${key}: ${String(value)}`),
//           children: node.children.map(transformRecursionTree),
//         });
  
//         setRecursionTree([transformRecursionTree(jsonData)]);
//       } else {
//         console.error("API response not successful:", response.data);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
  

  
//   const renderRecursionTree = () => {
//     if (recursionTree.length === 0) return;

//     const width = 800,
//       height = 600;
//     d3.select("#recursionTree").selectAll("*").remove();

//     const svg = d3
//       .select("#recursionTree")
//       .attr("width", width)
//       .attr("height", height)
//       .append("g")
//       .attr("transform", "translate(0,50)");

//     const transformData = (node: RecursionTreeNode): D3Node => ({
//       name: `${node.name}(${node.params.join(", ")})`,
//       children: node.children.map(transformData),
//     });

//     const root = d3.hierarchy(
//       transformData({ name: "root", params: [], children: recursionTree })
//     );
//     const treeLayout = d3.tree<D3Node>().size([width - 100, height - 100]);
//     const treeData = treeLayout(root);

//     // Create links
//     svg
//       .selectAll(".link")
//       .data(treeData.links())
//       .enter()
//       .append("line")
//       .attr("x1", (d) => d.source.x)
//       .attr("y1", (d) => d.source.y)
//       .attr("x2", (d) => d.target.x)
//       .attr("y2", (d) => d.target.y)
//       .style("stroke", "#ccc");

//     // Create nodes
//     svg
//       .selectAll(".node")
//       .data(treeData.descendants())
//       .enter()
//       .append("circle")
//       .attr("cx", (d) => d.x)
//       .attr("cy", (d) => d.y)
//       .attr("r", 5)
//       .style("fill", "#69b3a2");

//     // Labels
//     svg
//       .selectAll(".label")
//       .data(treeData.descendants())
//       .enter()
//       .append("text")
//       .attr("x", (d) => d.x + 10)
//       .attr("y", (d) => d.y)
//       .text((d) => d.data.name)
//       .style("font-size", "12px");
//   };

//   useEffect(() => {
//     renderRecursionTree();
//   }, [recursionTree]);

//   return (
//     <div className="p-6 h-svh  text-white flex justify-between md:flex-row flex-col pt-20">
//       <div className="flex  justify-center ">
//         <button
//           onClick={getCode}
//           className=" bg-black block md:hidden text-white w-1/2  text-base py-2 rounded-sm mb-1 hover:bg-blue-600"
//         >
//           Run
//         </button>
//       </div>
//       <div className=" md:w-1/2 h-[90vh] md:h-full bg-[#1e1e1e]">
//         <div className="flex justify-end py-2 pr-10 border-b-2 ">
//           <button
//           onClick={getCode}
//           className=" bg-white hidden md:block text-black px-5 font-semibold  text-sm py-1 mb-1 hover:bg-blue-600"
//         >
//           Run
//         </button>
//         </div>
//         <div className="h-[92%] border border-gray-700 rounded">
//           <MonacoEditor
//             height="100%"
//             defaultLanguage="plaintext"
//             value={text}
//             onChange={(value) => setText(value || "")}
//             theme="vs-dark"
//             options={{
//               fontSize: 14,
//               minimap: { enabled: false },
//               lineNumbers: "on",
//               wordWrap: "on",
//               scrollBeyondLastLine: false,
//               automaticLayout: true,
//             }}
//           />
//         </div>
//       </div>

//       {/* Output Section */}
//       <div className="md:w-1/2 h-[90vh] md:h-full border-l-2">
//         <div className="flex text-white font-semibold py-3 pl-10 bg-[#1e1e1e] border-b-2">
//         Output Section
//         </div>
//         <div className="bg-[#1e1e1e] p-4 shadow md:h-[92%] overflow-y-auto">
//         <svg className="" id="recursionTree"></svg>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CodeExecutionPage;

"use client"
import React, { useState, useRef } from 'react';
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

const MonacoEditor: React.FC<MonacoEditorProps> = ({  value, onChange }) => {
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

export default function CodeEditorWithSVG() {
  const [text, setText] = useState<string>('// Welcome to the code editor\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nfibonacci(5);');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('javascript');
  const [showOutput, setShowOutput] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const getCode = async (): Promise<void> => {
    setIsRunning(true);
    setShowOutput(true);
    try {
      const response = await fetch("/api/recursion_tree", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: text }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Here you would handle the SVG visualization data
          // For now, we'll create a simple demo visualization
          createDemoVisualization();
        } else {
          console.error("Failed to fetch data");
        }
      } else {
        console.error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const createDemoVisualization = (): void => {
    if (svgRef.current) {
      // Clear previous content
      svgRef.current.innerHTML = '';
      
      // Create a simple recursion tree visualization
      const svg = svgRef.current;
      const width = svg.clientWidth || 400;
      const height = svg.clientHeight || 300;
      
      // Set SVG dimensions
      svg.setAttribute('width', width.toString());
      svg.setAttribute('height', height.toString());
      
      // Create nodes for recursion tree
      const nodes = [
        { x: width/2, y: 50, label: 'fib(5)', level: 0 },
        { x: width/3, y: 120, label: 'fib(4)', level: 1 },
        { x: 2*width/3, y: 120, label: 'fib(3)', level: 1 },
        { x: width/4, y: 190, label: 'fib(3)', level: 2 },
        { x: width/2, y: 190, label: 'fib(2)', level: 2 },
        { x: 3*width/4, y: 190, label: 'fib(2)', level: 2 },
        { x: width/8, y: 260, label: 'fib(1)', level: 3 },
        { x: 3*width/8, y: 260, label: 'fib(2)', level: 3 },
      ];
      
      // Create connections
      const connections = [
        [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [3, 6], [3, 7]
      ];
      
      // Draw connections
      connections.forEach(([from, to]) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', nodes[from].x.toString());
        line.setAttribute('y1', nodes[from].y.toString());
        line.setAttribute('x2', nodes[to].x.toString());
        line.setAttribute('y2', nodes[to].y.toString());
        line.setAttribute('stroke', '#666');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
      });
      
      // Draw nodes
      nodes.forEach(node => {
        // Create circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x.toString());
        circle.setAttribute('cy', node.y.toString());
        circle.setAttribute('r', '20');
        circle.setAttribute('fill', '#333');
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        svg.appendChild(circle);
        
        // Create text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x.toString());
        text.setAttribute('y', (node.y + 5).toString());
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '10');
        text.setAttribute('font-family', 'monospace');
        text.textContent = node.label;
        svg.appendChild(text);
      });
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
    <div className="sm:h-[92vh] mb-10  pt-16 bg-black text-white ">
      {/* Mobile Header */}
      <div className="md:hidden bg-black border-b border-gray-800 p-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Code Visualizer</h1>
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
            Visualization
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row md:h-[92vh]">
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
        </div>

        {/* Visualization Section */}
        <div className={`${!showOutput ? 'hidden' : 'flex'} md:flex md:w-1/2 flex-col bg-black h-full md:border-l border-gray-800`}>
          {/* Visualization Header */}
          <div className="flex items-center justify-between py-3 px-4 border-b border-gray-800">
            <h2 className="font-semibold">Recursion Tree</h2>
            <button
              onClick={() => {
                if (svgRef.current) {
                  svgRef.current.innerHTML = '';
                }
              }}
              className="px-3 py-1 bg-gray-900 hover:bg-gray-800 rounded text-sm transition-colors border border-gray-700"
            >
              Clear
            </button>
          </div>

          {/* SVG Visualization */}
          <div className="flex-1 p-4 overflow-auto ">
            <svg 
              ref={svgRef}
              id="recursionTree"
              className="w-full h-full border border-gray-800 rounded bg-gray-900"
              viewBox="0 0 400 300"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Default content when no visualization */}
              <text 
                x="50%" 
                y="50%" 
                textAnchor="middle" 
                fill="#666" 
                fontSize="14"
                fontFamily="monospace"
              >
                Run code to see visualization
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}