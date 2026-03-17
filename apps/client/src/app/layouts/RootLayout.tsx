import { useGetExam } from "@entities/exam/api/exam.queries";
import { useGetStudent } from "@entities/student/api/student.queries";
import { Outlet } from "react-router";

export const RootLayout = () => {
  // 최상위에서 데이터를 호출하여 캐싱합니다.
  const { isLoading: isExamLoading, error: examError } = useGetExam();
  const { isLoading: isStudentLoading, error: studentError } = useGetStudent();

  if (isExamLoading || isStudentLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gs-6 text-gs-1 font-pretendard">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
          <p className="text-lg font-medium">데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (examError || studentError) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gs-6 text-gs-1 font-pretendard">
        <div className="text-center">
          <p className="text-xl font-bold text-red-500">
            데이터를 불러오는데 실패했습니다.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-brand-primary px-4 py-2 text-white"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
