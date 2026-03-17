import type { ExamSubmitRequest } from "@custom-types/exam.type";
import { examKeys } from "@entities/exam/api/exam.queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { submitExam } from "./submit.api";

export const useSubmitExam = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: ExamSubmitRequest) => submitExam(payload),
    onSuccess: (response) => {
      // 제출이 성공하면 필요한 경우 관련 쿼리를 무효화합니다.
      queryClient.invalidateQueries({ queryKey: examKeys.detail() });

      // 결과 데이터를 state에 담아 result 페이지로 이동합니다.
      navigate("/result", { state: response.data });
    },
  });
};
