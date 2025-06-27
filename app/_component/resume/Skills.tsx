import { Dispatch, SetStateAction } from "react";
import { SkillGroup } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SkillsInterface {
  skills: SkillGroup[];
  setSkills: Dispatch<SetStateAction<SkillGroup[]>>;
}

const skillOptions = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Next.js",
  "Python",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Git",
];

const Skills = ({ skills, setSkills }: SkillsInterface) => {
  const addSkillGroup = () => {
    setSkills([...skills, { heading: "", skills: [] }]);
  };

  const removeSkillGroup = (groupIndex: number) => {
    const updated = [...skills];
    updated.splice(groupIndex, 1);
    setSkills(updated);
  };

  const updateSkillHeading = (groupIndex: number, value: string) => {
    const updated = [...skills];
    updated[groupIndex].heading = value;
    setSkills(updated);
  };

  const addSkillToGroup = (groupIndex: number, skill: string) => {
    const updated = [...skills];
    if (!updated[groupIndex].skills.includes(skill)) {
      updated[groupIndex].skills.push(skill);
    }
    setSkills(updated);
  };

  const removeSkill = (groupIndex: number, skillIndex: number) => {
    const updated = [...skills];
    updated[groupIndex].skills.splice(skillIndex, 1);
    setSkills(updated);
  };

  return (
    <div className="h-[70vh] overflow-y-auto space-y-6">
    
      {skills.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className=" rounded-lg p-4 border  bg-white"
        >
          <div className="flex justify-end">
             <button
              onClick={() => removeSkillGroup(groupIndex)}
              className=" text-sm "
            >
              <IoMdClose />
            </button>
          </div>
          <div className="flex justify-between items-center mb-2">
            <div className="w-full">
              <label className="text-sm text-gray-600">Skill Category</label>
              <Input
                type="text"
                placeholder="e.g. Programming Languages"
                value={group.heading}
                onChange={(e) =>
                  updateSkillHeading(groupIndex, e.target.value)
                }
              />
            </div>
            
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">
              Add Skill
            </label>
            <Select onValueChange={(val) => addSkillToGroup(groupIndex, val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {skillOptions.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            {group.skills.map((skill, skillIndex) => (
              <div
                key={skillIndex}
                className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-2"
              >
                {skill}
                <button
                  onClick={() => removeSkill(groupIndex, skillIndex)}
                  className="text-red-500 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button
        onClick={addSkillGroup}
      >
        + Add Skill Group
      </Button>
    </div>
  );
};

export default Skills;
