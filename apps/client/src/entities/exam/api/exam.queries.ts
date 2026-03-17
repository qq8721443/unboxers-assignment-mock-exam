import { useQuery } from '@tanstack/react-query';
import { getExam } from './exam.api';

export const examKeys = {
  all: ['exams'] as const,
  detail: () => [...examKeys.all, 'detail'] as const,
};

export const useGetExam = () => {
  return useQuery({
    queryKey: examKeys.detail(),
    queryFn: getExam,
  });
};
