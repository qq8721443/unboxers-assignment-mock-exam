import { apiClient } from '@shared/api/apiClient';
import type { ApiResponse, Exam } from '@custom-types/exam.type';

export const getExam = async (): Promise<ApiResponse<Exam>> => {
  const { data } = await apiClient.get<ApiResponse<Exam>>('/api/exams');
  return data;
};
