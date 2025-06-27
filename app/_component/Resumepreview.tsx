"use client";

import React from "react";
import {
  EmploymentEntry,
  EducationEntry,
  SkillGroup,
  ProjectEntry,
  FormState,
} from "./types";

interface ChildProps {
  formData: FormState;
  EmploymentData: EmploymentEntry[];
  educationList: EducationEntry[];
  skills: SkillGroup[];
  project: ProjectEntry[];
  isFullView: boolean;
}

const ResumePreview = ({
  formData,
  EmploymentData,
  educationList,
  skills,
  project,
  isFullView,
}: ChildProps) => {
  return (
    <div
      className={`mx-auto bg-white p-4 font-sans h-full overflow-y-auto ${
        isFullView ? "text-sm" : "text-[8px] leading-tight"
      }`}
    >
      {/* Header */}
      {(formData.firstName || formData.lastName) && (
        <h1
          className={`font-bold text-center ${
            isFullView ? "text-3xl" : "text-xs"
          }`}
        >
          {formData.firstName} {formData.lastName}
        </h1>
      )}

      {(formData.email || formData.phoneNumber || formData.githubId || formData.linkedId) && (
        <p className="text-center text-gray-600 mt-1">
          {formData.phoneNumber && `${formData.phoneNumber} ⋅ `}
          {formData.email && `${formData.email} ⋅ `}
          {formData.linkedId && (
            <>
              <a
                href={formData.linkedId}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn
              </a>{" "}
              ⋅{" "}
            </>
          )}
          {formData.githubId}
        </p>
      )}

      {/* Education */}
      {educationList.some(e => e.degree || e.institution) && (
        <section className="mt-4">
          <h2
            className={`font-bold border-b-2 border-black pb-1 ${
              isFullView ? "text-lg" : "text-[10px]"
            }`}
          >
            EDUCATION
          </h2>
          {educationList.map((edu, i) => (
            <div key={i} className="mt-2">
              <p className="font-semibold">
                {edu.degree}
                <span className="float-right">
                  {edu.startDate && new Date(edu.startDate).getFullYear()} -{" "}
                  {edu.endDate && new Date(edu.endDate).getFullYear()}
                </span>
              </p>
              <p className="text-gray-700 italic">{edu.institution}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.some(s => s.heading.trim() && s.skills.some(skill => skill.trim())) && (
        <section className="mt-4">
          <h2
            className={`font-bold border-b-2 border-black pb-1 ${
              isFullView ? "text-lg" : "text-[10px]"
            }`}
          >
            SKILLS
          </h2>
          <div className="grid gap-2 mt-4 text-sm pt-2">
            {skills.map((group, index) =>
              group.heading.trim() && group.skills.length > 0 ? (
                <p key={index}>
                  <strong>{group.heading}:</strong>{" "}
                  {group.skills.filter(s => s.trim()).join(", ")}
                </p>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* Experience */}
      {EmploymentData.some(e => e.company || e.title || e.description) && (
        <section className="mt-4">
          <h2
            className={`font-bold border-b-2 border-black pb-1 ${
              isFullView ? "text-lg" : "text-[10px]"
            }`}
          >
            EXPERIENCE
          </h2>
          {EmploymentData.map((exp, i) => (
            <div key={i} className="mt-3">
              <p className="font-semibold">
                {exp.title}
                <span className="float-right">
                  {exp.startDate && new Date(exp.startDate).getFullYear()} -{" "}
                  {exp.endDate && new Date(exp.endDate).getFullYear()}
                </span>
              </p>
              <p className="italic text-gray-700">
                {exp.company}
                <span className="float-right">{exp.location}</span>
              </p>
              <div
                className="ql-editor prose prose-sm text-gray-800 mt-2 pl-0"
                dangerouslySetInnerHTML={{ __html: exp.description }}
              />
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {project.some(p => p.title || p.description) && (
        <section className="mt-4">
          <h2
            className={`font-bold border-b-2 border-black pb-1 ${
              isFullView ? "text-lg" : "text-[10px]"
            }`}
          >
            PROJECTS
          </h2>
          {project.map((proj, i) => (
            <div key={i} className="mt-3">
              <p className="font-semibold">
                {proj.title}
                {proj.stack?.length > 0 && (
                  <span className="text-gray-500 float-right">
                    {proj.stack.join(", ")}
                  </span>
                )}
              </p>
              <div
                className="ql-editor prose prose-sm text-gray-800 mt-2 pl-0"
                dangerouslySetInnerHTML={{ __html: proj.description }}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ResumePreview;
