"use client";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  EmploymentEntry,
  EducationEntry,
  SkillGroup,
  ProjectEntry,
  FormState,
} from "./types";
import Projects from "./resume/Projects";
import Personalinfo from "./resume/Personalinfo";
import Employement from "./resume/Employement";
import Education from "./resume/Education";
import Skills from "./resume/Skills";
import { useRouter } from "next/navigation";

interface ChildProps {
  formData: FormState;
  onFormChange: React.Dispatch<React.SetStateAction<FormState>>;
  employmentHistory: EmploymentEntry[];
  onEmploymentChange: React.Dispatch<React.SetStateAction<EmploymentEntry[]>>;
  educationList: EducationEntry[];
  setEducationList: Dispatch<SetStateAction<EducationEntry[]>>;
  skills: SkillGroup[];
  setSkills: Dispatch<SetStateAction<SkillGroup[]>>;
  projectHistory: ProjectEntry[];
  setProjectHistory: Dispatch<SetStateAction<ProjectEntry[]>>;
}

const sections = [
  "Personal Details",
  "Employment History",
  "Education",
  "Skills",
  "Projects",
];

const ResumeInput = ({
  formData,
  onFormChange,
  employmentHistory,
  onEmploymentChange,
  educationList,
  setEducationList,
  skills,
  setSkills,
  projectHistory,
  setProjectHistory,
}: ChildProps) => {
  const [sectionIndex, setSectionIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchResume = async () => {
      const res = await fetch("/api/resume");
      const result = await res.json();

      if (result.found && result.data) {
        const data = result.data;

        onFormChange({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          githubId: data.githubId || "",
          email: data.email || "",
          linkedId: data.linkedId || "",
          phoneNumber: data.phoneNumber || "",
        });

        onEmploymentChange(data.employmentHistory || []);
        setEducationList(data.educationList || []);
        setSkills(data.skills || []);
        setProjectHistory(data.projectHistory || []);
      }
    };

    fetchResume();
  }, []);

  const handleNext = async () => {
    const payload = {
      ...formData,
      employmentHistory,
      educationList,
      skills,
      projectHistory,
    };

    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.found && result.data) {
        console.log("Resume already exists. Loading...");
        const data = result.data;

        // ✅ Set all states
        onFormChange({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          githubId: data.githubId || "",
          email: data.email || "",
          linkedId: data.linkedId || "",
          phoneNumber: data.phoneNumber || "",
        });

        onEmploymentChange(data.employmentHistory || []);
        setEducationList(data.educationList || []);
        setSkills(data.skills || []);
        setProjectHistory(data.projectHistory || []);
      } else {
        console.log("New resume saved.");
      }

      if (sectionIndex < sections.length - 1) {
        setSectionIndex(sectionIndex + 1);
      }
    } catch (err) {
      console.error("Error saving or fetching resume:", err);
    }
  };

  const handleBack = () => {
    if (sectionIndex > 0) setSectionIndex(sectionIndex - 1);
  };

  const renderSection = () => {
    switch (sectionIndex) {
      case 0:
        return <Personalinfo formData={formData} onFormChange={onFormChange} />;
      case 1:
        return (
          <Employement
            employmentHistory={employmentHistory}
            onEmploymentChange={onEmploymentChange}
          />
        );
      case 2:
        return (
          <Education
            educationList={educationList}
            setEducationList={setEducationList}
          />
        );
      case 3:
        return <Skills skills={skills} setSkills={setSkills} />;
      case 4:
        return (
          <Projects
            projectHistory={projectHistory}
            setProjectHistory={setProjectHistory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full  pt-4 flex flex-col justify-between h-full">
  {/* Section Selector */}
  <div className="flex justify-end items-center mb-4">
    <select
      value={sectionIndex}
      onChange={(e) => setSectionIndex(Number(e.target.value))}
      className="p-2 bg-gray-100 rounded outline-none border border-gray-300 text-sm"
    >
      {sections.map((section, i) => (
        <option key={section} value={i}>
          {section}
        </option>
      ))}
    </select>
  </div>

  {/* Form Section Renderer */}
  <div className="flex-1 overflow-auto">
    {renderSection()}
  </div>

  {/* Navigation Buttons */}
  <div className="flex justify-between items-center mt-4">
    <Button
      onClick={handleBack}
      disabled={sectionIndex === 0}
      variant="default"
    >
      Back
    </Button>

    {sectionIndex === sections.length - 1 ? (
      <Button
        onClick={async () => {
          await handleNext();
          router.push("/resume/preview");
        }}
      >
        Continue
      </Button>
    ) : (
      <Button onClick={handleNext}>Next</Button>
    )}
  </div>
</div>

  );
};

export default ResumeInput;
