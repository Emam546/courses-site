import { Timestamp } from "firebase/firestore";
declare global {
    namespace DataBase {
        export type WithIdType<T> = { id: string } & T;
        export type WithOrder<T> = { order: number } & T;
        export interface Price {
            num: number;
            currency: string;
        }
    }

    export interface DataBase {
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
            price: DataBase.Price;
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
            video?:
                | ({
                      type: "youtube";
                      id: string;
                  } & {
                      hide: boolean;
                  })
                | null;
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
                  price: DataBase.Price;
              } & {
                  type: "admin";
              };
    }
}
