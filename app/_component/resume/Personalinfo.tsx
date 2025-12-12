import React from "react";
import { Input } from "@/components/ui/input";
import { FormState } from "../types";
import { User, Mail, Phone, Linkedin, Github } from "lucide-react";

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
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Section Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <User size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Personal Details</h2>
          <p className="text-xs text-slate-500">How employers can reach you.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* First Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name</label>
          <Input
            type="text"
            placeholder="e.g. Alex"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Last Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</label>
          <Input
            type="text"
            placeholder="e.g. DeVore"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Mail size={12} /> Email
          </label>
          <Input
            type="email"
            placeholder="alex@example.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Phone size={12} /> Phone Number
          </label>
          <Input
            type="tel"
            placeholder="+1 234 567 890"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 transition-all"
          />
        </div>

        {/* LinkedIn */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Linkedin size={12} /> LinkedIn URL
          </label>
          <Input
            type="text"
            placeholder="linkedin.com/in/alex"
            value={formData.linkedId}
            onChange={(e) => handleChange("linkedId", e.target.value)}
            className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 transition-all"
          />
        </div>

        {/* GitHub */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Github size={12} /> GitHub URL
          </label>
          <Input
            type="text"
            placeholder="github.com/alex"
            value={formData.githubId}
            onChange={(e) => handleChange("githubId", e.target.value)}
            className="h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default Personalinfo;