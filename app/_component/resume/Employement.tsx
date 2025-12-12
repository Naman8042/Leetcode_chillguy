"use client";
import { Button } from "@/components/ui/button";
import { EmploymentEntry } from "../types";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { X, Plus, Briefcase,Building2 } from "lucide-react";
import DatePicker from "./Datepicker";

const RichTextEditor = dynamic(
  () => import("@/app/_component/RichTextEditor"),
  {
    ssr: false,
  }
);

interface EmploymentInterface {
  employmentHistory: EmploymentEntry[];
  onEmploymentChange: React.Dispatch<React.SetStateAction<EmploymentEntry[]>>;
}

const Employment = ({
  employmentHistory,
  onEmploymentChange,
}: EmploymentInterface) => {
  
  const addEmployment = () => {
    onEmploymentChange([
      ...employmentHistory,
      {
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        location: "",
      },
    ]);
  };

  const updateEmployment = <K extends keyof EmploymentEntry>(
    index: number,
    field: K,
    value: EmploymentEntry[K]
  ) => {
    const updated = [...employmentHistory];
    updated[index][field] = value;
    onEmploymentChange(updated);
  };

  const removeEmployment = (index: number) => {
    const updated = [...employmentHistory];
    updated.splice(index, 1);
    onEmploymentChange(updated);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-6">
        {employmentHistory.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-medium text-slate-900">No employment history</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Add your past work experience to build a comprehensive professional profile.</p>
            <Button onClick={addEmployment} variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Add Position
            </Button>
          </div>
        )}

        {employmentHistory.map((job, index) => (
          <div 
            key={index} 
            className="group relative bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Header / Remove Button */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Position</h3>
              </div>
              <Button
                variant="ghost"
                onClick={() => removeEmployment(index)}
                className="text-slate-400 hover:text-red-600 hover:bg-red-50 -mr-2 -mt-2"
                title="Remove position"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="space-y-5">
              {/* Row 1: Company & Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Job Title"
                  placeholder="e.g. Senior Software Engineer"
                  value={job.title}
                  onChange={(e: any) => updateEmployment(index, "title", e.target.value)}
                />
                <div className="relative">
                    <Input
                    label="Company Name"
                    placeholder="e.g. Acme Inc."
                    value={job.company}
                    onChange={(e: any) => updateEmployment(index, "company", e.target.value)}
                    className="pl-9" // space for icon
                    />
                    {/* <Building2 className="absolute left-3 top-[34px] h-4 w-4 text-slate-400 pointer-events-none" /> */}
                </div>
              </div>

              {/* Row 2: Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Start Date</label>
                  <DatePicker
                    value={job.startDate}
                    onChange={(val) => updateEmployment(index, "startDate", val)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">End Date</label>
                  <DatePicker
                    value={job.endDate}
                    onChange={(val) => updateEmployment(index, "endDate", val)}
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <RichTextEditor
                value={job.description}
                onChange={(value) => updateEmployment(index, "description", value)}
              />
            </div>
          </div>
        ))}

        {employmentHistory.length > 0 && (
            <Button onClick={addEmployment} variant="link">
                <Plus className="mr-2 h-4 w-4" />
                Add Another Position
            </Button>
        )}
      </div>
    </div>
  );
};

export default Employment;
