import "./validator/auth";
import "./validator/database";

import "./teacher/validator";
export {
  onTeacherDelete,
  registerTeacher,
  onTeacherUpdate,
  onTeacherCreate,
} from "./teacher/index";
export * from "./auth";
export * from "./student";
export * from "./level";
export * from "./course";
export * from "./lesson";
export * from "./exam";

export * from "./server";
