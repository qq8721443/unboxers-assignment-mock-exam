import type {
  ApiResponse,
  ExamResult,
  ExamSubmitRequest,
} from "@custom-types/exam.type";
import { apiClient } from "@shared/api/apiClient";

export const submitExam = async (
  payload: ExamSubmitRequest,
): Promise<ApiResponse<ExamResult>> => {
  const { data } = await apiClient.post<ApiResponse<ExamResult>>(
    "/api/exams/submit",
    payload,
  );
  return data;
};
