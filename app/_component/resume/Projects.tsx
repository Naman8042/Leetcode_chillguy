"use client";

import { Dispatch, SetStateAction } from "react";
import { ProjectEntry } from "../types";
import { IoMdClose } from "react-icons/io";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

const RichTextEditor = dynamic(
  () => import("@/app/_component/RichTextEditor"),
  {
    ssr: false,
  }
);

interface ProjectInterface {
  projectHistory: ProjectEntry[];
  setProjectHistory: Dispatch<SetStateAction<ProjectEntry[]>>;
}

const techStacks = [
  "React",
  "Next.js",
  "Node.js",
  "MongoDB",
  "TypeScript",
  "TailwindCSS",
  "Express",
  "Firebase",
];

const Projects = ({ projectHistory, setProjectHistory }: ProjectInterface) => {
  const updateProject = <K extends keyof ProjectEntry>(
  index: number,
  field: K,
  value: ProjectEntry[K]
) => {
  const updated = [...projectHistory];
  updated[index][field] = value;
  setProjectHistory(updated);
};


  const toggleStack = (projectIndex: number, tech: string) => {
    const current = projectHistory[projectIndex].stack || [];
    const updated = current.includes(tech)
      ? current.filter((t) => t !== tech)
      : [...current, tech];
    updateProject(projectIndex, "stack", updated);
  };

  const removeProject = (index: number) => {
    const updated = [...projectHistory];
    updated.splice(index, 1);
    setProjectHistory(updated);
  };

  const addProject = () => {
    setProjectHistory([
      ...projectHistory,
      { title: "", stack: [], description: "" },
    ]);
  };

  return (
    <div className="overflow-y-auto h-[74vh]">
      {projectHistory.map((project, index) => (
        <div key={index} className="my-3 border-b p-4 border rounded-lg">
          <div className="flex justify-end">
            <button
              onClick={() => removeProject(index)}
              className=" text-sm "
            >
              <IoMdClose />
            </button>
          </div>
          <Input
            type="text"
            placeholder="Project Title"
            label="Project Title"
            value={project.title}
            onChange={(e) => updateProject(index, "title", e.target.value)}
          />

          <div className="mt-4">
            <label className="block text-sm text-gray-600 mb-2">
              Tech Stack
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-gray-600"
                >
                  {project.stack?.length > 0
                    ? project.stack.join(", ")
                    : "Select Technologies"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-2">
                {techStacks.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center space-x-2 py-1 w-full"
                  >
                    <Checkbox
                      checked={project.stack?.includes(tech)}
                      onCheckedChange={() => toggleStack(index, tech)}
                    />
                    <label className="text-sm">{tech}</label>
                  </div>
                ))}
              </PopoverContent>
            </Popover>

            {/* Show selected techs */}
            <div className="flex flex-wrap gap-2 mt-2">
              {project.stack?.map((tech) => (
                <div
                  key={tech}
                  onClick={() => toggleStack(index, tech)}
                  className="bg-gray-200  text-sm px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {tech} <IoMdClose />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <RichTextEditor
              value={project.description}
              onChange={(val) => updateProject(index, "description", val)}
            />
          </div>

          
        </div>
      ))}

      <Button onClick={addProject} className="mt-4">
        + Add One More Project
      </Button>
    </div>
  );
};

export default Projects;
