import type { AnswerType } from "@custom-types/exam.type";
import { create } from "zustand";

/**
 * 입력을 받는 동안의 답안 데이터 (객관식은 number[], 주관식은 string)
 */
export interface RawAnswer {
  answerType: AnswerType;
  number: number;
  answer: number[] | string;
}

interface AnswerState {
  answers: RawAnswer[];
  // 특정 문항의 답안을 업데이트하거나 추가하는 액션
  setAnswer: (
    number: number,
    answer: number[] | string,
    answerType: AnswerType,
  ) => void;
  // 전체 답안 초기화
  resetAnswers: () => void;
}

export const useAnswerStore = create<AnswerState>((set) => ({
  answers: [],
  setAnswer: (number, answer, answerType) =>
    set((state) => {
      const existingAnswerIndex = state.answers.findIndex(
        (a) => a.number === number,
      );
      if (existingAnswerIndex !== -1) {
        const newAnswers = [...state.answers];
        newAnswers[existingAnswerIndex] = {
          ...newAnswers[existingAnswerIndex],
          answer,
        };
        return { answers: newAnswers };
      }
      return {
        answers: [...state.answers, { number, answer, answerType }],
      };
    }),
  resetAnswers: () => set({ answers: [] }),
}));
