/**
 * 공통 API 응답 형식
 */
export interface ApiResponse<T> {
  message: string;
  data: T;
}

/**
 * 문제 유형: 객관식 또는 주관식
 */
export type AnswerType = "objective" | "subjective";

/**
 * 채점 결과 상태
 */
export type ResultStatus = "correct" | "wrong" | "unanswered";

/**
 * 시험 기본 정보
 */
export interface Exam {
  title: string;
  description: string;
  supervisorName: string;
  totalQuestions: number;
  totalScore: number;
}

/**
 * 학생 인적 사항
 */
export interface Student {
  name: string;
  school: string;
  grade: number;
  studentNumber: number;
  seatNumber: number;
}

/**
 * 개별 문항 제출 답안
 */
export interface Answer {
  answerType: AnswerType;
  number: number;
  answer: string | number;
}

/**
 * 시험 제출 요청 본문 (학생 정보 + 답안 목록)
 */
export type ExamSubmitRequest = Student & {
  answers: Answer[];
};

/**
 * 개별 문항 채점 결과
 */
export interface QuestionResult {
  answerType: AnswerType;
  number: number;
  result: ResultStatus;
}

/**
 * 시험 최종 결과 리포트
 */
export interface ExamResult {
  title: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  results: QuestionResult[];
}
