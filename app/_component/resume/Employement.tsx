"use client";
import { Button } from "@/components/ui/button";
import { EmploymentEntry } from "../types";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { IoMdClose } from "react-icons/io";
import DatePicker from "./Datepicker";

const RichTextEditor = dynamic(
  () => import("@/app/_component/RichTextEditor"),
  {
    ssr: false,
  }
);

interface EmployementInterface {
  employmentHistory: EmploymentEntry[];
  onEmploymentChange: React.Dispatch<React.SetStateAction<EmploymentEntry[]>>;
}

const Employement = ({
  employmentHistory,
  onEmploymentChange,
}: EmployementInterface) => {
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

  const updateEmployment = (index: number, field: string, value: string) => {
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
    <div className="overflow-y-auto h-[74vh] space-y-6">
      {employmentHistory.map((job, index) => (
        <div key={index} className="my-2 p-4 rounded-lg border">
          <div className="flex justify-end">
            <button
              onClick={() => removeEmployment(index)}
              className=" text-sm "
            >
              <IoMdClose />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Input
              type="text"
              placeholder="Company Name"
              value={job.company}
              onChange={(e) =>
                updateEmployment(index, "company", e.target.value)
              }
              label="Company Name"
            />
            <Input
              type="text"
              placeholder="Job Title"
              value={job.title}
              onChange={(e) => updateEmployment(index, "title", e.target.value)}
              label="Job Title"
            />

            {/* Start Date with Label */}
            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Start Date
              </label>
              <DatePicker
                value={job.startDate}
                onChange={(val) => updateEmployment(index, "startDate", val)}
              />
            </div>

            {/* End Date with Label */}
            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                End Date
              </label>
              <DatePicker
                value={job.endDate}
                onChange={(val) => updateEmployment(index, "endDate", val)}
              />
            </div>
          </div>
          <RichTextEditor
            value={job.description}
            onChange={(value) => updateEmployment(index, "description", value)}
          />
        </div>
      ))}

      <Button
        onClick={addEmployment}
        // className="px-2 py-1 rounded text-sm mt-2 bg-blue-500 text-white"
      >
        + Add One More Employment
      </Button>
    </div>
  );
};

export default Employement;
