"use client";
import Resumeinput from "@/app/_component/Resumeinput";
import ResumePreview from "@/app/_component/Resumepreview";
import { useState } from "react";
import { EmploymentEntry, EducationEntry ,SkillGroup ,ProjectEntry ,FormState} from "@/app/_component/types";


const Page = () => {
  const [input, setInput] = useState<FormState>({
    firstName: "",
    lastName: "",
    githubId: "",
    email: "",
    linkedId: "",
    phoneNumber: "",
  });

  const [employmentHistory, setEmploymentHistory] = useState<EmploymentEntry[]>(
    [
      {
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        location: "",
      },
    ]
  );

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
    stack:[],
    description: "",
  },
]);


  return (
    <div className="mt-16 h-[91vh] flex px-10  gap-10">
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
      <div className="w-[25%]  border-4">
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
