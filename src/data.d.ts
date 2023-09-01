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
        wrongQuestions: Array<{
            questionId: string;
            wrongAnswers: number;
        }>;
        questionsIds: Array<string>;
        startAt: number;
        endAt: number;
        userId: string;
    };
}
