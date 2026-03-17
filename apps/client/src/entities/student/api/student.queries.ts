import { useQuery } from '@tanstack/react-query';
import { getStudent } from './student.api';

export const studentKeys = {
  all: ['student'] as const,
};

export const useGetStudent = () => {
  return useQuery({
    queryKey: studentKeys.all,
    queryFn: getStudent,
    // 학생 정보는 한 번 가져오면 세션 동안 변경되지 않는다고 가정
    staleTime: Infinity,
  });
};
