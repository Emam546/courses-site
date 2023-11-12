import { Timestamp } from "firebase/firestore";
declare global {
    type FailType = {
        success: false;
        msg: string;
        err?: unknown;
    };
    type ResponseData<T> =
        | {
              success: true;
              msg: string;
              data: T;
          }
        | FailType;
    declare namespace DataBase {
        type WithOrder<T> = { order: number } & T;
        type WithIdType<T> = { id: string } & T;
        type TimeStampToDate<T> = {
            [K in keyof T]: T[K] extends Timestamp ? Date : T[K];
        };
        type KeyToString<T, G extends string> = {
            [K in keyof T]: K extends G ? string : T[K];
        };
    }
    interface DataBase {
        Levels: WithOrder<{
            name: string;
            desc: string;
            hide: boolean;
            teacherId: string;
        }>;
        Courses: WithOrder<{
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
        Lessons: WithOrder<{
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
        Exams: WithOrder<
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
                WithOrder<
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
            time: number;
            startAt: Timestamp;
            endAt?: Timestamp;
        };
        Teacher: {
            createdAt: Timestamp;
            contactPhone?: string;
            contactEmail?: string;
        };
        Students: {
            teacherId: string;
            levelId: string;
            blocked: boolean;
            displayname: string;
            emailVerified: boolean;
            email: string;
            phone: string;
            createdAt: Timestamp;
        };
        AuthStudent: {
            passwordHash: string;
            passwordSalt: string;
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
