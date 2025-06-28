import React from "react";
import { Input } from "@/components/ui/input";
import { FormState } from "../types";

interface PersonalInfoInterface {
  formData: FormState;
  onFormChange: React.Dispatch<React.SetStateAction<FormState>>;
}

const Personalinfo = ({ formData, onFormChange }: PersonalInfoInterface) => {
  const handleChange = (target: string, value: string) => {
    onFormChange({
      ...formData,
      [target]: value,
    });
  };

  return (
    <div className="w-full border border-gray-200 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        Personal Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="text"
          label="First Name"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          className="h-11"
        />
        <Input
          type="text"
          label="Last Name"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          className="h-11"
        />
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="h-11"
        />
        <Input
          type="tel"
          label="Phone Number"
          placeholder="Enter your phone number"
          value={formData.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
          className="h-11"
        />
        <Input
          type="text"
          label="LinkedIn"
          placeholder="LinkedIn URL"
          value={formData.linkedId}
          onChange={(e) => handleChange("linkedId", e.target.value)}
          className="h-11"
        />
        <Input
          type="text"
          label="GitHub"
          placeholder="GitHub URL"
          value={formData.githubId}
          onChange={(e) => handleChange("githubId", e.target.value)}
          className="h-11"
        />
        {/* Optional Fields */}
        {/* <Input type="text" label="LeetCode" placeholder="LeetCode ID" className="h-11" />
        <Input type="text" label="Portfolio" placeholder="Portfolio/Website" className="h-11" /> */}
      </div>
    </div>
  );
};

export default Personalinfo;
