"use client";

import { useState, useEffect } from "react";
import { downloadResumeAsPDF } from "@/lib/Downloadresume";
import ResumePreview from "@/app/_component/Resumepreview";
import {
  EmploymentEntry,
  EducationEntry,
  SkillGroup,
  ProjectEntry,
  FormState,
} from "@/app/_component/types";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

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
    []
  );
  const [educationList, setEducationList] = useState<EducationEntry[]>([]);
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [projectHistory, setProjectHistory] = useState<ProjectEntry[]>([]);

  const { status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (status !== "authenticated") redirect("/api/auth/signin");
  }, [status]);

  useEffect(() => {
    const fetchResume = async () => {
      const res = await fetch("/api/resume");
      const result = await res.json();
      if (result.found && result.data) {
        const data = result.data;
        setInput({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          githubId: data.githubId || "",
          email: data.email || "",
          linkedId: data.linkedId || "",
          phoneNumber: data.phoneNumber || "",
        });
        setEmploymentHistory(data.employmentHistory || []);
        setEducationList(data.educationList || []);
        setSkills(data.skills || []);
        setProjectHistory(data.projectHistory || []);
      }
    };
    fetchResume();
  }, []);

  return (
    <div className="flex flex-col items-center mt-16 p-4 md:p-10 space-y-6">
      <Button
        onClick={() => downloadResumeAsPDF("resume-content", "My_Resume.pdf")}
      >
        Download as PDF
      </Button>

      <div
        id="resume-content"
        className="bg-white shadow-xl rounded-md w-[210mm] h-[297mm] overflow-auto p-10 hidden sm:block"
      >
        <ResumePreview
          skills={skills}
          isFullView={true}
          formData={input}
          educationList={educationList}
          EmploymentData={employmentHistory}
          project={projectHistory}
        />
      </div>
      <div
        id="resume-content"
        className="bg-white shadow-xl rounded-md mx-auto overflow-auto p-4  sm:hidden block w-full max-w-[210mm] h-auto "
      >
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
