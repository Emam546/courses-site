export type WithIdType<T> = { id: string } & T;
export type WithOrder<T> = { order: number } & T;
export interface DataBase {
    Levels: WithOrder<{
        name: string;
        desc: string;
        hide: boolean;
    }>;
    Courses: WithOrder<{
        name: string;
        desc: string;
        hide: boolean;
        levelId: string;
        price: {
            num: string;
            currency: string;
        };
        createdAt: Date;
        publishedAt: Date;
    }>;
    Lessons: WithOrder<{
        name: string;
        desc: string;
        hide: boolean;
        courseId: string;
        createdAt: Date;
        publishedAt: Date;
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
            createdAt: Date;
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
                WithIdType<{
                    textContext: string;
                }>
            >
        >;
        answer: string;
        shuffle: boolean;
        lessonId: string;
        createdAt: Date;
    };
    Results: {
        examId: string;
        questions: Array<{
            questionId: string;
            state: "visited" | "unvisited" | "marked";
            answer?: string;
            correctState: boolean;
        }>;

        startAt: Date;
        endAt?: Date;
        userId: string;
    };
    Users: {
        phone?: string;
        email?: string;
        password: string;
        userName: string;
        name: string;
        createdAt: Date;
        blocked: boolean;
        levelId: string;
    };
    Payment:
        | {
              activatedAt: Date;
              userId: string;
              courseId: string;
          } & (
              | {
                    type: "admin";
                }
              | {
                    type: "code";
                    createdAT: Date;
                }
          );
}
