import { isRouteErrorResponse, useRouteError } from "react-router";

export function GlobalErrorFallback() {
  const error = useRouteError();

  let errorMessage = "알 수 없는 오류가 발생했습니다.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorMessage = "요청하신 페이지를 찾을 수 없습니다.";
    } else if (error.status === 401) {
      errorMessage = "접근 권한이 없습니다.";
    } else if (error.status === 500) {
      errorMessage = "서버 내부 오류가 발생했습니다.";
    } else {
      errorMessage = error.statusText || errorMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gs-6 text-gs-1 font-pretendard">
      <div className="flex flex-col items-center w-100 p-8 bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="w-[60px] h-[60px] mb-6 flex items-center justify-center rounded-full bg-red-50">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>error icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-[24px] font-bold text-gs-1 mb-2 text-center">
          앗! 문제가 발생했어요
        </h1>
        <p className="text-[15px] text-gs-3 mb-8 text-center leading-relaxed">
          {errorMessage}
        </p>

        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={handleGoHome}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-gs-2 bg-gs-5 hover:bg-gs-4 transition-colors"
          >
            홈으로 가기
          </button>
          <button
            type="button"
            onClick={handleRetry}
            className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-brand-primary hover:bg-opacity-90 transition-colors shadow-md"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}
