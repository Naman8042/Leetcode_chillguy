"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";


// Dynamically import Monaco Editor to ensure it's only loaded in the client
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

import * as d3 from "d3";

interface RecursionTreeNode {
  name: string;
  params: any[];
  children: RecursionTreeNode[];
}

interface D3Node {
  name: string;
  children: D3Node[];
}

const CodeExecutionPage = () => {
  const [recursionTree, setRecursionTree] = useState<RecursionTreeNode[]>([]);
  const [text, setText] = useState<string>("");
  const getCode = async () => {
    try {
      const response = await axios.post("/api/recursion_tree", { code: text });
  
      if (response.data.success) {
        let rawText = response.data.data.rawText;
        console.log("Raw Response:", rawText);
  
        // Remove Markdown-style code blocks if they exist
        rawText = rawText.replace(/```json\n?/, "").replace(/\n?```/, "");
  
        // Ensure rawText is parsed correctly
        const jsonData = JSON.parse(rawText);
  
        // Transform the recursion tree
        const transformRecursionTree = (node: any): RecursionTreeNode => ({
          name: node.function,
          params: Object.entries(node.params).map(
            ([key, value]) => `${key}: ${value}`
          ),
          children: node.children.map(transformRecursionTree),
        });
  
        setRecursionTree([transformRecursionTree(jsonData)]);
      } else {
        console.error("API response not successful:", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  
  const renderRecursionTree = () => {
    if (recursionTree.length === 0) return;

    const width = 800,
      height = 600;
    d3.select("#recursionTree").selectAll("*").remove();

    const svg = d3
      .select("#recursionTree")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(0,50)");

    const transformData = (node: RecursionTreeNode): D3Node => ({
      name: `${node.name}(${node.params.join(", ")})`,
      children: node.children.map(transformData),
    });

    const root = d3.hierarchy(
      transformData({ name: "root", params: [], children: recursionTree })
    );
    const treeLayout = d3.tree<D3Node>().size([width - 100, height - 100]);
    const treeData = treeLayout(root);

    // Create links
    svg
      .selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("line")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .style("stroke", "#ccc");

    // Create nodes
    svg
      .selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 5)
      .style("fill", "#69b3a2");

    // Labels
    svg
      .selectAll(".label")
      .data(treeData.descendants())
      .enter()
      .append("text")
      .attr("x", (d) => d.x + 10)
      .attr("y", (d) => d.y)
      .text((d) => d.data.name)
      .style("font-size", "12px");
  };

  useEffect(() => {
    renderRecursionTree();
  }, [recursionTree]);

  return (
    // <div className="container">
    //   <h1>Recursion Tree Visualization</h1>
    //   <button onClick={executeCode} disabled={isExecuting}>
    //     {isExecuting ? "Executing..." : "Execute Code"}
    //   </button>
    //   {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    //   <h3>Output</h3>
    //   <pre>{output}</pre>
    //   <h3>Recursion Tree</h3>
    //   <svg id="recursionTree"></svg>
    // </div>
    <div className="p-6  h-svh text-white flex justify-between gap-4">
      {/* Monaco Editor for Input */}
      <div className="mb-4 w-1/2 h-[93%]">
        <div className="h-full border border-gray-700 rounded">
          <MonacoEditor
            height="100%"
            defaultLanguage="plaintext"
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
      </div>

      {/* Output Section */}
      <div className="h-[93%] w-1/2">
        <button
          onClick={getCode}
          className=" bg-black text-white px-4  text-sm py-1 rounded-sm mb-1 hover:bg-blue-600"
        >
          Run
        </button>
        <div className="  rounded shadow h-[95%] overflow-y-auto">
          <svg className="" id="recursionTree"></svg>
        </div>
      </div>
    </div>
  );
};

export default CodeExecutionPage;
