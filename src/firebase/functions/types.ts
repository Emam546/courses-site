export type ResponseData<T> =
    | {
          success: true;
          msg: string;
          data: T;
      }
    | {
          success: false;
          msg: string;
          err?: unknown;
      };
export type TeacherRegisterResponseData = ResponseData<{ token: string }>;
export interface TeacherRegisterRequestData {
    email: string;
    password: string;
    displayName: string;
}
export type StudentRegisterResponseData = ResponseData<{ id: string }>;
export interface StudentRegisterRequestData {
    userName: string;
    displayname: string;
    phone?: string;
    email?: string;
    teacherId: string;
    levelId: string;
    blocked?: boolean;
}
