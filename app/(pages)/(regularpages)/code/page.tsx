// // "use client";
// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import dynamic from "next/dynamic";

// // // Dynamically import Monaco Editor to ensure it's only loaded in the client
// // const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
// //   ssr: false,
// // });

// // import * as d3 from "d3";

// // interface RecursionTreeNode {
// //   name: string;
// //   params: string[];
// //   children: RecursionTreeNode[];
// // }

// // interface RawRecursionNode {
// //   function: string;
// //   params: Record<string, unknown>;
// //   children: RawRecursionNode[];
// // }

// // interface D3Node {
// //   name: string;
// //   children: D3Node[];
// // }

// // const CodeExecutionPage = () => {
// //   const [recursionTree, setRecursionTree] = useState<RecursionTreeNode[]>([]);
// //   const [text, setText] = useState<string>("");
// //   const getCode = async () => {
// //     try {
// //       const response = await axios.post("/api/recursion_tree", { code: text });

// //       if (response.data.success) {
// //         let rawText = response.data.data.rawText;
// //         console.log("Raw Response:", rawText);

// //         // Remove Markdown-style code blocks if they exist
// //         rawText = rawText.replace(/```json\n?/, "").replace(/\n?```/, "");

// //         // Ensure rawText is parsed correctly
// //         const jsonData = JSON.parse(rawText);

// //         // Transform the recursion tree
// //         const transformRecursionTree = (node: RawRecursionNode): RecursionTreeNode => ({
// //           name: node.function,
// //           params: Object.entries(node.params).map(([key, value]) => `${key}: ${String(value)}`),
// //           children: node.children.map(transformRecursionTree),
// //         });

// //         setRecursionTree([transformRecursionTree(jsonData)]);
// //       } else {
// //         console.error("API response not successful:", response.data);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching data:", error);
// //     }
// //   };

// //   const renderRecursionTree = () => {
// //     if (recursionTree.length === 0) return;

// //     const width = 800,
// //       height = 600;
// //     d3.select("#recursionTree").selectAll("*").remove();

// //     const svg = d3
// //       .select("#recursionTree")
// //       .attr("width", width)
// //       .attr("height", height)
// //       .append("g")
// //       .attr("transform", "translate(0,50)");

// //     const transformData = (node: RecursionTreeNode): D3Node => ({
// //       name: `${node.name}(${node.params.join(", ")})`,
// //       children: node.children.map(transformData),
// //     });

// //     const root = d3.hierarchy(
// //       transformData({ name: "root", params: [], children: recursionTree })
// //     );
// //     const treeLayout = d3.tree<D3Node>().size([width - 100, height - 100]);
// //     const treeData = treeLayout(root);

// //     // Create links
// //     svg
// //       .selectAll(".link")
// //       .data(treeData.links())
// //       .enter()
// //       .append("line")
// //       .attr("x1", (d) => d.source.x)
// //       .attr("y1", (d) => d.source.y)
// //       .attr("x2", (d) => d.target.x)
// //       .attr("y2", (d) => d.target.y)
// //       .style("stroke", "#ccc");

// //     // Create nodes
// //     svg
// //       .selectAll(".node")
// //       .data(treeData.descendants())
// //       .enter()
// //       .append("circle")
// //       .attr("cx", (d) => d.x)
// //       .attr("cy", (d) => d.y)
// //       .attr("r", 5)
// //       .style("fill", "#69b3a2");

// //     // Labels
// //     svg
// //       .selectAll(".label")
// //       .data(treeData.descendants())
// //       .enter()
// //       .append("text")
// //       .attr("x", (d) => d.x + 10)
// //       .attr("y", (d) => d.y)
// //       .text((d) => d.data.name)
// //       .style("font-size", "12px");
// //   };

// //   useEffect(() => {
// //     renderRecursionTree();
// //   }, [recursionTree]);

// //   return (
// //     <div className="p-6 h-svh  text-white flex justify-between md:flex-row flex-col pt-20">
// //       <div className="flex  justify-center ">
// //         <button
// //           onClick={getCode}
// //           className=" bg-black block md:hidden text-white w-1/2  text-base py-2 rounded-sm mb-1 hover:bg-blue-600"
// //         >
// //           Run
// //         </button>
// //       </div>
// //       <div className=" md:w-1/2 h-[90vh] md:h-full bg-[#1e1e1e]">
// //         <div className="flex justify-end py-2 pr-10 border-b-2 ">
// //           <button
// //           onClick={getCode}
// //           className=" bg-white hidden md:block text-black px-5 font-semibold  text-sm py-1 mb-1 hover:bg-blue-600"
// //         >
// //           Run
// //         </button>
// //         </div>
// //         <div className="h-[92%] border border-gray-700 rounded">
// //           <MonacoEditor
// //             height="100%"
// //             defaultLanguage="plaintext"
// //             value={text}
// //             onChange={(value) => setText(value || "")}
// //             theme="vs-dark"
// //             options={{
// //               fontSize: 14,
// //               minimap: { enabled: false },
// //               lineNumbers: "on",
// //               wordWrap: "on",
// //               scrollBeyondLastLine: false,
// //               automaticLayout: true,
// //             }}
// //           />
// //         </div>
// //       </div>

// //       {/* Output Section */}
// //       <div className="md:w-1/2 h-[90vh] md:h-full border-l-2">
// //         <div className="flex text-white font-semibold py-3 pl-10 bg-[#1e1e1e] border-b-2">
// //         Output Section
// //         </div>
// //         <div className="bg-[#1e1e1e] p-4 shadow md:h-[92%] overflow-y-auto">
// //         <svg className="" id="recursionTree"></svg>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CodeExecutionPage;

// "use client";
// import React, { useState, useRef } from "react";
// import { Play, Copy, Download, Terminal } from "lucide-react";

// // Mock Monaco Editor component since we don't have access to the actual package
// interface MonacoEditorProps {
//   height: string;
//   defaultLanguage: string;
//   value: string;
//   onChange: (value: string) => void;
//   theme: string;
//   options: {
//     fontSize: number;
//     minimap: { enabled: boolean };
//     lineNumbers: string;
//     wordWrap: string;
//     scrollBeyondLastLine: boolean;
//     automaticLayout: boolean;
//   };
// }

// const MonacoEditor: React.FC<MonacoEditorProps> = ({ value, onChange }) => {
//   return (
//     <textarea
//       className="w-full h-full bg-black text-white p-4 font-mono text-sm resize-none border-none outline-none"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder="Write your code here..."
//       style={{
//         fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
//         minHeight: "400px",
//       }}
//     />
//   );
// };

// export default function CodeEditorWithSVG() {
//   const [text, setText] = useState<string>(
//     "// Welcome to the code editor\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nfibonacci(5);"
//   );
//   const [isRunning, setIsRunning] = useState<boolean>(false);
//   const [language, setLanguage] = useState<string>("javascript");
//   const [showOutput, setShowOutput] = useState<boolean>(false);
//   const svgRef = useRef<SVGSVGElement>(null);

//   const getCode = async (): Promise<void> => {
//     setIsRunning(true);
//     setShowOutput(true);
//     try {
//       const response = await fetch("/api/recursion_tree", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ code: text }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) {
//           // Here you would handle the SVG visualization data
//           // For now, we'll create a simple demo visualization
//           createDemoVisualization();
//         } else {
//           console.error("Failed to fetch data");
//         }
//       } else {
//         console.error(`HTTP Error: ${response.status} ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const createDemoVisualization = (): void => {
//     if (svgRef.current) {
//       // Clear previous content
//       svgRef.current.innerHTML = "";

//       // Create a simple recursion tree visualization
//       const svg = svgRef.current;
//       const width = svg.clientWidth || 400;
//       const height = svg.clientHeight || 300;

//       // Set SVG dimensions
//       svg.setAttribute("width", width.toString());
//       svg.setAttribute("height", height.toString());

//       // Create nodes for recursion tree
//       const nodes = [
//         { x: width / 2, y: 50, label: "fib(5)", level: 0 },
//         { x: width / 3, y: 120, label: "fib(4)", level: 1 },
//         { x: (2 * width) / 3, y: 120, label: "fib(3)", level: 1 },
//         { x: width / 4, y: 190, label: "fib(3)", level: 2 },
//         { x: width / 2, y: 190, label: "fib(2)", level: 2 },
//         { x: (3 * width) / 4, y: 190, label: "fib(2)", level: 2 },
//         { x: width / 8, y: 260, label: "fib(1)", level: 3 },
//         { x: (3 * width) / 8, y: 260, label: "fib(2)", level: 3 },
//       ];

//       // Create connections
//       const connections = [
//         [0, 1],
//         [0, 2],
//         [1, 3],
//         [1, 4],
//         [2, 5],
//         [3, 6],
//         [3, 7],
//       ];

//       // Draw connections
//       connections.forEach(([from, to]) => {
//         const line = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "line"
//         );
//         line.setAttribute("x1", nodes[from].x.toString());
//         line.setAttribute("y1", nodes[from].y.toString());
//         line.setAttribute("x2", nodes[to].x.toString());
//         line.setAttribute("y2", nodes[to].y.toString());
//         line.setAttribute("stroke", "#666");
//         line.setAttribute("stroke-width", "2");
//         svg.appendChild(line);
//       });

//       // Draw nodes
//       nodes.forEach((node) => {
//         // Create circle
//         const circle = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "circle"
//         );
//         circle.setAttribute("cx", node.x.toString());
//         circle.setAttribute("cy", node.y.toString());
//         circle.setAttribute("r", "20");
//         circle.setAttribute("fill", "#333");
//         circle.setAttribute("stroke", "#fff");
//         circle.setAttribute("stroke-width", "2");
//         svg.appendChild(circle);

//         // Create text
//         const text = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "text"
//         );
//         text.setAttribute("x", node.x.toString());
//         text.setAttribute("y", (node.y + 5).toString());
//         text.setAttribute("text-anchor", "middle");
//         text.setAttribute("fill", "#fff");
//         text.setAttribute("font-size", "10");
//         text.setAttribute("font-family", "monospace");
//         text.textContent = node.label;
//         svg.appendChild(text);
//       });
//     }
//   };

//   const copyCode = (): void => {
//     navigator.clipboard.writeText(text);
//   };

//   const downloadCode = (): void => {
//     const blob = new Blob([text], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `code.${language === "javascript" ? "js" : "txt"}`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="sm:h-[92vh] mb-10  pt-16 bg-black text-white ">
//       {/* Mobile Header */}
//       <div className="md:hidden bg-black border-b border-gray-800 p-3">
//         <div className="flex items-center justify-between">
//           <h1 className="text-lg font-semibold">Code Visualizer</h1>
//           <div className="flex gap-2">
//             <button
//               onClick={copyCode}
//               className="p-2 bg-gray-900 hover:bg-gray-800 rounded transition-colors"
//             >
//               <Copy size={16} />
//             </button>
//             <button
//               onClick={downloadCode}
//               className="p-2 bg-gray-900 hover:bg-gray-800 rounded transition-colors"
//             >
//               <Download size={16} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Tab Navigation */}
//       <div className="md:hidden bg-black border-b border-gray-800">
//         <div className="flex">
//           <button
//             onClick={() => setShowOutput(false)}
//             className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
//               !showOutput
//                 ? "bg-white text-black border-b-2 border-white"
//                 : "text-gray-400 hover:text-white"
//             }`}
//           >
//             <Terminal size={16} className="inline mr-2" />
//             Editor
//           </button>
//           <button
//             onClick={() => setShowOutput(true)}
//             className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
//               showOutput
//                 ? "bg-white text-black border-b-2 border-white"
//                 : "text-gray-400 hover:text-white"
//             }`}
//           >
//             <Play size={16} className="inline mr-2" />
//             Visualization
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-col md:flex-row md:h-[92vh]">
//         {/* Editor Section */}
//         <div
//           className={`${
//             showOutput ? "hidden" : "flex"
//           } md:flex md:w-1/2 flex-col bg-black h-full`}
//         >
//           {/* Desktop Header */}
//           <div className="hidden md:flex justify-between items-center py-3 px-4 border-b border-gray-800">
//             <div className="flex items-center gap-4">
//               <h2 className="font-semibold">Code Editor</h2>
//               <select
//                 value={language}
//                 onChange={(e) => setLanguage(e.target.value)}
//                 className="bg-gray-900 text-white px-3 py-1 rounded text-sm border border-gray-700"
//               >
//                 <option value="javascript">JavaScript</option>
//                 <option value="python">Python</option>
//                 <option value="html">HTML</option>
//                 <option value="css">CSS</option>
//               </select>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 onClick={copyCode}
//                 className="p-2 bg-gray-900 hover:bg-gray-800 rounded transition-colors border border-gray-700"
//                 title="Copy Code"
//               >
//                 <Copy size={16} />
//               </button>
//               <button
//                 onClick={downloadCode}
//                 className="p-2 bg-gray-900 hover:bg-gray-800 rounded transition-colors border border-gray-700"
//                 title="Download Code"
//               >
//                 <Download size={16} />
//               </button>
//               <button
//                 onClick={getCode}
//                 disabled={isRunning}
//                 className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors border ${
//                   isRunning
//                     ? "bg-gray-800 cursor-not-allowed border-gray-700"
//                     : "bg-white text-black hover:bg-gray-100 border-white"
//                 }`}
//               >
//                 <Play size={16} />
//                 {isRunning ? "Running..." : "Run"}
//               </button>
//             </div>
//           </div>

//           {/* Editor */}
//           <div className="flex-1 border border-gray-800 m-2 rounded overflow-hidden">
//             <MonacoEditor
//               height="100%"
//               defaultLanguage={language}
//               value={text}
//               onChange={(value) => setText(value || "")}
//               theme="vs-dark"
//               options={{
//                 fontSize: 14,
//                 minimap: { enabled: false },
//                 lineNumbers: "on",
//                 wordWrap: "on",
//                 scrollBeyondLastLine: false,
//                 automaticLayout: true,
//               }}
//             />
//           </div>

//           {/* Mobile Run Button */}
//           <div className="md:hidden p-3 bg-black border-t border-gray-800">
//             <button
//               onClick={getCode}
//               disabled={isRunning}
//               className={`w-full flex items-center justify-center gap-2 py-3 rounded font-medium transition-colors ${
//                 isRunning
//                   ? "bg-gray-800 cursor-not-allowed border border-gray-700"
//                   : "bg-white text-black hover:bg-gray-100"
//               }`}
//             >
//               <Play size={16} />
//               {isRunning ? "Running..." : "Run Code"}
//             </button>
//           </div>
//         </div>

//         {/* Visualization Section */}
//         <div
//           className={`${
//             !showOutput ? "hidden" : "flex"
//           } md:flex md:w-1/2 flex-col bg-black h-full md:border-l border-gray-800`}
//         >
//           {/* Visualization Header */}
//           <div className="flex items-center justify-between py-3 px-4 border-b border-gray-800">
//             <h2 className="font-semibold">Recursion Tree</h2>
//             <button
//               onClick={() => {
//                 if (svgRef.current) {
//                   svgRef.current.innerHTML = "";
//                 }
//               }}
//               className="px-3 py-1 bg-gray-900 hover:bg-gray-800 rounded text-sm transition-colors border border-gray-700"
//             >
//               Clear
//             </button>
//           </div>

//           {/* SVG Visualization */}
//           <div className="flex-1 p-4 overflow-auto border border-gray-800 rounded bg-white">
//             <svg
//               ref={svgRef}
//               id="recursionTree"
//               width={1000} // actual canvas size
//               height={800} // large enough for tree
//             >
//               {/* Default content when no visualization */}
//               <text
//                 x="38%"
//                 y="33%"
//                 textAnchor="middle"
//                 fill="#666"
//                 fontSize="18"
//                 fontFamily="monospace"
//               >
//                 Run code to see visualization
//               </text>
//             </svg>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import{ useState, useEffect, useRef, useCallback } from "react";
import axios from "axios"; 
import * as d3 from "d3";
import { 
  Play, ZoomIn, ZoomOut, RotateCcw, 
 Layers, Settings,
  Maximize2, Minimize2, Loader2
} from "lucide-react";

// --- TYPES ---
interface RecursionTreeNode {
  name: string;
  params: string[];
  children: RecursionTreeNode[];
}

interface RawRecursionNode {
  function: string;
  params: Record<string, unknown>;
  children: RawRecursionNode[];
}

// --- MOCK EDITOR COMPONENT ---
const SimpleEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  return (
    <div className="relative h-full w-full bg-white font-mono text-sm">
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-50 border-r border-slate-200 text-slate-400 flex flex-col items-end pr-2 pt-4 select-none">
        {value.split('\n').map((_, i) => (
          <div key={i} className="leading-6">{i + 1}</div>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full bg-transparent text-slate-800 resize-none outline-none p-4 pl-14 leading-6 font-mono whitespace-pre placeholder:text-slate-300"
        spellCheck={false}
      />
    </div>
  );
};

const CodeExecutionPage = () => {
  const [treeData, setTreeData] = useState<RecursionTreeNode | null>(null);
  const [code, setCode] = useState<string>(`// Write a function to visualize
// Example: Fibonacci Sequence

function fib(n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);
}

// Call the function
fib(4);`);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // --- API CALL & DATA TRANSFORMATION ---
  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsLoading(true);

    try {
      const response = await axios.post("/api/recursion_tree", { code });

      if (response.data.success) {
        let rawText = response.data.data.rawText;
        
        // Clean up markdown code blocks if present in the LLM response
        rawText = rawText.replace(/```json\n?/, "").replace(/\n?```/, "");
        
        const jsonData: RawRecursionNode = JSON.parse(rawText);

        // Transform backend format to UI format
        const transformRecursionTree = (node: RawRecursionNode): RecursionTreeNode => ({
          name: node.function,
          params: Object.entries(node.params).map(([key, value]) => `${key}: ${String(value)}`),
          children: node.children.map(transformRecursionTree),
        });

        setTreeData(transformRecursionTree(jsonData));
      } else {
        console.error("API Error:", response.data);
        alert("Failed to generate tree. Check console for details.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error connecting to server.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- D3 VISUALIZATION LOGIC ---
  const renderTree = useCallback(() => {
    if (!treeData || !svgRef.current || !wrapperRef.current) return;

    const { width,} = wrapperRef.current.getBoundingClientRect();
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // Zoom Behavior
    const g = svg.append("g");
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 2])
      .on("zoom", (event) => g.attr("transform", event.transform));
    
    svg.call(zoom);

    // Hierarchy & Layout
    const root = d3.hierarchy<RecursionTreeNode>(treeData);
    
    // Increased horizontal spacing from 100 to 180 to prevent overlap
    const treeLayout = d3.tree<RecursionTreeNode>().nodeSize([180, 120]); 
    treeLayout(root);

    // Links (Curved lines)
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical()
        .x((d: any) => d.x)
        .y((d: any) => d.y) as any
      )
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1") // Slate-300
      .attr("stroke-width", 2)
      .attr("opacity", 0)
      .transition().duration(500).delay((d, i) => i * 50)
      .attr("opacity", 0.8);

    // Nodes (Groups)
    const nodes = g.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
      .attr("cursor", "pointer");

    // Node: Tooltip Title (Native browser tooltip)
    nodes.append("title")
      .text(d => `${d.data.name}\n${d.data.params.join("\n")}`);

    // Node: Circle Background
    nodes.append("circle")
      .attr("r", 0)
      .attr("fill", "#ffffff") // White fill
      .attr("stroke", (d) => d.children && d.children.length > 0 ? "#6366f1" : "#10b981") // Indigo (parent) vs Emerald (leaf)
      .attr("stroke-width", 2.5)
      .attr("class", "shadow-sm")
      .transition().duration(500).ease(d3.easeBackOut)
      .attr("r", 24);

    // Node: Label (Function Name)
    nodes.append("text")
      .attr("dy", -35)
      .attr("text-anchor", "middle")
      .text((d) => d.data.name)
      .attr("fill", "#64748b") // Slate-500
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .transition().delay(300)
      .style("opacity", 1);

    // Helper to truncate long text
    const truncate = (str: string, maxLength: number) => 
      str.length > maxLength ? str.slice(0, maxLength) + "..." : str;

    // Node: Params (Truncated)
    nodes.append("text")
      .attr("dy", 40) // Moved slightly lower to clear the circle
      .attr("text-anchor", "middle")
      .text((d) => truncate(d.data.params.join(", "), 25)) // Truncate to 25 chars
      .attr("fill", "#1e293b") // Slate-800
      .style("font-size", "11px") // Slightly smaller font
      .style("font-weight", "500")
      .style("font-family", "monospace");

    // Center the tree initially
    const initialTransform = d3.zoomIdentity.translate(width / 2, 50).scale(0.9); // Zoomed out slightly
    svg.call(zoom.transform, initialTransform);

  }, [treeData]);

  useEffect(() => {
    renderTree();
    const handleResize = () => renderTree();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderTree]);

  // --- HELPER ACTIONS ---
  const resetView = () => {
    if (!svgRef.current || !wrapperRef.current) return;
    const { width } = wrapperRef.current.getBoundingClientRect();
    const svg = d3.select(svgRef.current);
    const zoom: any = d3.zoom().on("zoom", (e) => svg.select("g").attr("transform", e.transform));
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.translate(width / 2, 50).scale(0.9));
  };

  return (
    <div className={`flex flex-col h-screen bg-slate-50 text-slate-900 font-sans ${isFullscreen ? 'fixed inset-0 z-50' : 'relative pt-16'}`}>
      
      {/* --- TOOLBAR --- */}
      <header className="flex items-center justify-between px-4 py-2 md:px-6 md:py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Layers size={20} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-slate-800 tracking-wide">Recursion Visualizer</h1>
            <p className="text-xs text-slate-500">Tree Depth Analysis</p>
          </div>
           {/* Mobile Title */}
           <div className="sm:hidden">
            <h1 className="text-sm font-bold text-slate-800 tracking-wide">Recursion Viz</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
           {/* Run Button */}
           <button 
            onClick={handleRunCode}
            disabled={isLoading}
            className={`
              flex items-center gap-2 px-3 py-1.5 md:px-6 md:py-2 rounded-md font-semibold text-xs md:text-sm transition-all
              ${isLoading 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 active:scale-95"}
            `}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
            <span>{isLoading ? "Running..." : "Run"}</span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 mx-1 md:mx-2" />
          
          <button className="p-2 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-800 transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT SPLIT --- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* LEFT: EDITOR */}
        <div className="w-full lg:w-[40%] h-[40vh] lg:h-auto flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 bg-white">
          {/* <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200 text-xs font-mono text-slate-500">
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-indigo-600 font-medium"><Code2 size={14}/> script.js</span>
            </div>
          </div> */}
          <div className="flex-1 relative overflow-hidden">
            <SimpleEditor
              value={code}
              onChange={setCode}
            />
          </div>
        </div>

        {/* RIGHT: VISUALIZATION */}
        <div className="flex-1 h-[60vh] lg:h-auto flex flex-col bg-slate-50 relative">
          
          {/* Viz Toolbar */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <div className="flex flex-col bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden">
              <button onClick={() => { if(svgRef.current) d3.select(svgRef.current).transition().call(d3.zoom().scaleBy as any, 1.2); }} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-indigo-600 border-b border-slate-100" title="Zoom In">
                <ZoomIn size={16} />
              </button>
              <button onClick={() => { if(svgRef.current) d3.select(svgRef.current).transition().call(d3.zoom().scaleBy as any, 0.8); }} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-indigo-600 border-b border-slate-100" title="Zoom Out">
                <ZoomOut size={16} />
              </button>
              <button onClick={resetView} className="p-2 hover:bg-slate-50 text-slate-500 hover:text-indigo-600" title="Reset View">
                <RotateCcw size={16} />
              </button>
            </div>
            
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-white hover:bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-lg border border-slate-200 shadow-lg hidden sm:block"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          {/* Viz Canvas */}
          <div ref={wrapperRef} className="flex-1 w-full h-full overflow-hidden cursor-move bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
            {treeData ? (
               <svg ref={svgRef} className="w-full h-full" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-300">
                  <Play size={32} />
                </div>
                <p className="text-sm">Run code to generate tree</p>
              </div>
            )}
          </div>
          
          {/* Status Footer */}
          <div className="px-4 py-2 bg-white border-t border-slate-200 text-xs text-slate-500 flex justify-between">
            <span className="font-medium text-slate-700">{treeData ? "Active" : "Ready"}</span>
            <div className="flex gap-4">
               <span>Nodes: {treeData ? d3.hierarchy(treeData).descendants().length : 0}</span>
               <span className="hidden sm:inline">Zoom: Scroll/Pinch</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CodeExecutionPage;