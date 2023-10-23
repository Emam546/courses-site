import { Timestamp } from "firebase/firestore";
declare global {
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
    declare namespace DataBase {
        type WithOrder<T> = { order: number } & T;
        type WithIdType<T> = { id: string } & T;
    }
    interface DataBase {
        Levels: DataBase.WithOrder<{
            name: string;
            desc: string;
            hide: boolean;
            teacherId: string;
        }>;
        Courses: DataBase.WithOrder<{
            name: string;
            desc: string;
            hide: boolean;
            levelId: string;
            teacherId: string;
            featured: boolean;
            price: {
                num: string;
                currency: string;
            };
            createdAt: Timestamp;
            publishedAt: Timestamp;
        }>;
        Lessons: DataBase.WithOrder<{
            name: string;
            briefDesc: string;
            desc: string;
            hide: boolean;
            courseId: string;
            createdAt: Timestamp;
            publishedAt: Timestamp;
            teacherId: string;
            adderIds: Record<string, ["editor"]>;
            video?: {
                type: "youtube";
                id: string;
            } & {
                hide: boolean;
            };
        }>;
        Exams: DataBase.WithOrder<
            {
                name: string;
                desc: string;
                hide: boolean;
                lessonId: string;
                courseId: string;
                teacherId: string;
                createdAt: Timestamp;
                repeatable: boolean;
                questionIds: Array<string>;
                time: number;
            } & (
                | {
                      random: true;
                      num: number;
                  }
                | {
                      random: false;
                      shuffle: boolean;
                  }
            )
        >;
        Questions: {
            quest: string;
            choices: Array<
                DataBase.WithOrder<
                    DataBase.WithIdType<{
                        textContext: string;
                    }>
                >
            >;
            answer: string;
            shuffle: boolean;
            lessonId: string;
            courseId: string;
            createdAt: Timestamp;
            creatorId: string;
        };
        Results: {
            courseId: string;
            teacherId: string;
            userId: string;
            examId: string;
            questions: Array<{
                questionId: string;
                state: "visited" | "unvisited" | "marked";
                answer?: string;
                correctAnswer?: string;
                correctState?: boolean;
            }>;
            startAt: Timestamp;
            endAt?: Timestamp;
        };
        Teacher: {
            createdAt: Timestamp;
            contactPhone?: string;
            contactEmail?: string;
        };
        UsersTeachers: {
            userId: string;
            teacherId: string;
            levelId: string;
            blocked: boolean;
            displayname: string;
            email: string;
            phone: string;
            createdAt: Timestamp;
        };
        Payments:
            | {
                  activatedAt: Timestamp;
                  userId: string;
                  courseId: string;
                  teacherId: string;
              } & {
                  type: "admin";
              };
    }
}
