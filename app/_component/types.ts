export interface Folder {
    _id: string;
    name: string;
  }

  export interface EmploymentEntry {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}


export interface EducationEntry {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface SkillGroup {
  heading: string;
  skills: string[];
}

export interface ProjectEntry {
  title: string;
  stack: string[],
  description: string;
}

export interface FormState {
  firstName: string;
  lastName: string;
  githubId: string;
  email: string;
  linkedId: string;
  phoneNumber: string;
}