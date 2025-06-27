import { Dispatch, SetStateAction } from "react";
import { EducationEntry } from "../types";
import { Input } from "@/components/ui/input";
import DatePicker from "./Datepicker";
import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";

interface EducationInterface {
  educationList: EducationEntry[];
  setEducationList: Dispatch<SetStateAction<EducationEntry[]>>;
}

const Education = ({ educationList, setEducationList }: EducationInterface) => {
  const addEducation = () => {
    setEducationList([
      ...educationList,
      {
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const removeEducation = (index: number) => {
    const updated = [...educationList];
    updated.splice(index, 1);
    setEducationList(updated);
  };

  return (
    <div className="h-[70vh] overflow-y-auto space-y-6">
      {educationList.map((edu, index) => (
        <div key={index} className="my-2   border rounded-lg  p-4">
          <div className="flex justify-end">
            <button
              onClick={() => removeEducation(index)}
              className=" text-sm "
            >
              <IoMdClose />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Input
              type="text"
              label="Degree Name"
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => updateEducation(index, "degree", e.target.value)}
            />
            <Input
              type="text"
              label="Institute"
              placeholder="School/University"
              value={edu.institution}
              onChange={(e) =>
                updateEducation(index, "institution", e.target.value)
              }
            />

            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Start Date
              </label>
              <DatePicker
                value={edu.startDate}
                onChange={(val) => updateEducation(index, "startDate", val)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                End Date
              </label>
              <DatePicker
                value={edu.endDate}
                onChange={(val) => updateEducation(index, "endDate", val)}
              />
            </div>
          </div>
        </div>
      ))}
      <Button
        onClick={addEducation}
      >
        + Add one more Education
      </Button>
    </div>
  );
};

export default Education;
