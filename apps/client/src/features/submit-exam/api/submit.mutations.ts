import type { ExamSubmitRequest } from "@custom-types/exam.type";
import { examKeys } from "@entities/exam/api/exam.queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitExam } from "./submit.api";

export const useSubmitExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ExamSubmitRequest) => submitExam(payload),
    onSuccess: () => {
      // 제출이 성공하면 필요한 경우 관련 쿼리를 무효화합니다.
      queryClient.invalidateQueries({ queryKey: examKeys.detail() });
    },
  });
};
