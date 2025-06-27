"use client";
import { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor to ensure it's only loaded in the client
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const Page = () => {
  const [text, setText] = useState<string>("");
  const [output, setOutput] = useState<string[]>([]);

  const getCode = async () => {
    try {
      const response = await axios.post("/api/codevisuals", { code: text });
      if (response.data.success) {
        const rawText = response.data.data.rawText;
        console.log(rawText);
        // Process the text to remove special characters and clean it up
        const formattedText = rawText
          .replace(/[*-]/g, "") // Remove '*' and '-' characters
          .replace(/`/g, "") // Remove '`' characters
          .split("\n") // Split into lines
          .filter((line: string) => line.trim() !== ""); // Remove empty lines

        setOutput(formattedText);
      } else {
        setOutput(["Failed to fetch data. Please try again."]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setOutput(["An error occurred. Please try again later."]);
    }
  };

  return (
    <div className="p-6 h-svh  text-white flex justify-between md:flex-row flex-col pt-20">
      <div className="flex  justify-center ">
        <button
          onClick={getCode}
          className=" bg-black block md:hidden text-white w-1/2  text-base py-2 rounded-sm mb-1 hover:bg-blue-600"
        >
          Run
        </button>
      </div>
      <div className=" md:w-1/2 h-[90vh] md:h-full bg-[#1e1e1e]">
        <div className="flex justify-end py-2 pr-10 border-b-2 ">
          <button
          onClick={getCode}
          className=" bg-white hidden md:block text-black px-5 font-semibold  text-sm py-1 mb-1 hover:bg-blue-600"
        >
          Run
        </button>
        </div>
        <div className="h-[92%] border border-gray-700 rounded">
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
      <div className="md:w-1/2 h-[90vh] md:h-full border-l-2">
        <div className="flex text-white font-semibold py-3 pl-10 bg-[#1e1e1e] border-b-2">
        Output Section
        </div>
        <div className="bg-[#1e1e1e] p-4 shadow md:h-[92%] overflow-y-auto">
          {output.length > 0 ? (
            output.map((line, index) => {
              // Check for headings and add styles
              if (
                line.toLowerCase().includes("final output") ||
                line.toLowerCase().includes("execution steps") ||
                line.toLowerCase().includes("initial input")
              ) {
                return (
                  <p key={index} className="mb-4 text-lg font-bold text-white">
                    {line}
                  </p>
                );
              }
              // Regular lines
              return (
                <p key={index} className="mb-2 text-gray-300">
                  {line}
                </p>
              );
            })
          ) : (
            <p className="text-gray-500">No output to display yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
