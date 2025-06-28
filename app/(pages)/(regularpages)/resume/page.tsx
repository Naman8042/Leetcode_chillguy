"use client";
import Resumeinput from "@/app/_component/Resumeinput";
import ResumePreview from "@/app/_component/Resumepreview";
import { useState} from "react";
import {
  EmploymentEntry,
  EducationEntry,
  SkillGroup,
  ProjectEntry,
  FormState,
} from "@/app/_component/types";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react"

const Page = () => {
  const [input, setInput] = useState<FormState>({
    firstName: "",
    lastName: "",
    githubId: "",
    email: "",
    linkedId: "",
    phoneNumber: "",
  });

  const [employmentHistory, setEmploymentHistory] = useState<EmploymentEntry[]>([
    {
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      description: "",
      location: "",
    },
  ]);

  const [educationList, setEducationList] = useState<EducationEntry[]>([
    {
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
    },
  ]);

  const [skills, setSkills] = useState<SkillGroup[]>([]);

  const [projectHistory, setProjectHistory] = useState<ProjectEntry[]>([
    {
      title: "",
      stack: [],
      description: "",
    },
  ]);
  const { data: session} = useSession()

  if (!session) {
     redirect("/api/auth/signin");
  }

  
  return (
    <div className="mt-16 sm:h-[91vh] flex flex-col md:flex-row px-4 md:px-10 gap-6 ">
      <div className="w-full md:w-[70%] ">
        <Resumeinput
          formData={input}
          onFormChange={setInput}
          employmentHistory={employmentHistory}
          onEmploymentChange={setEmploymentHistory}
          educationList={educationList}
          setEducationList={setEducationList}
          skills={skills}
          setSkills={setSkills}
          projectHistory={projectHistory}
          setProjectHistory={setProjectHistory}
        />
      </div>

      <div className="w-full md:w-[30%] border-4 rounded-md shadow-sm overflow-y-auto max-h-[90vh]">
        <ResumePreview
          skills={skills}
          isFullView={false}
          formData={input}
          educationList={educationList}
          EmploymentData={employmentHistory}
          project={projectHistory}
        />
      </div>
    </div>
  );
};

export default Page;
