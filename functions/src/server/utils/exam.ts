import { shuffle } from "../../utils";

export type QuestionData = {
  questionIds: string[];
} & (
  | {
      random: true;
      num: number;
    }
  | {
      random: false;
      shuffle: boolean;
    }
);
export function createExamQuestions(data: QuestionData): string[] {
  if (data.random) {
    const questions: string[] = [];
    const dataQuestions = [...data.questionIds];
    for (let i = 0; i < data.num && dataQuestions.length > 0; i++) {
      const floor = Math.floor(Math.random() * dataQuestions.length);
      const elem = dataQuestions[floor];
      if (elem == undefined) break;
      dataQuestions.splice(floor, 1);
      questions.push(elem);
    }
    return questions;
  }
  if (data.shuffle) return shuffle(data.questionIds);
  return [...data.questionIds];
}
