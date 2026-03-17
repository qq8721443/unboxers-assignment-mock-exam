import type { ExamResult } from "@custom-types/exam.type";
import { ArrowLeftIcon, CheckIcon, XIcon } from "@shared/ui/icons";
import { useLocation, useNavigate } from "react-router";

/**
 * 개발용 더미 데이터
 */
const MOCK_RESULT: ExamResult = {
  title: "2024년 3월 고3 수학 모의고사 (더미)",
  score: 85,
  correctCount: 22,
  wrongCount: 3,
  unansweredCount: 5,
  results: Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    answerType: i < 21 ? "objective" : "subjective",
    result: i % 10 === 0 ? "wrong" : i % 7 === 0 ? "unanswered" : "correct",
  })),
};

export function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // state에 데이터가 없으면 MOCK_RESULT를 기본값으로 사용합니다.
  const result = (location.state as ExamResult) || MOCK_RESULT;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8 lg:p-16">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between mb-12">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="p-4 bg-white hover:bg-slate-100 rounded-2xl shadow-sm border border-slate-200 transition-colors"
          aria-label="Back"
        >
          <ArrowLeftIcon />
        </button>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {result.title} 결과 리포트
        </h1>
        <div className="w-14" />
      </header>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 요약 점수 섹션 */}
        <section className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center">
            <span className="text-slate-500 text-2xl font-semibold mb-4 block">
              최종 점수
            </span>
            <div className="text-[120px] leading-none font-black text-blue-600 mb-8 drop-shadow-sm">
              {result.score}
            </div>

            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-100">
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-sm font-medium">정답</span>
                <span className="text-emerald-500 text-3xl font-bold">
                  {result.correctCount}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-sm font-medium">오답</span>
                <span className="text-rose-500 text-3xl font-bold">
                  {result.wrongCount}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-sm font-medium">
                  미응답
                </span>
                <span className="text-slate-400 text-3xl font-bold">
                  {result.unansweredCount}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-6 bg-slate-900 text-white rounded-3xl text-2xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10"
          >
            시험 종료 및 닫기
          </button>
        </section>

        {/* 문항별 상세 섹션 */}
        <section className="lg:col-span-8 bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="text-2xl font-bold text-slate-800">
              문항별 채점 결과
            </h2>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500" />
                <span className="text-sm font-bold text-slate-600">정답</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-rose-500" />
                <span className="text-sm font-bold text-slate-600">오답</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-200" />
                <span className="text-sm font-bold text-slate-600">미응답</span>
              </div>
            </div>
          </div>

          <div className="p-10 overflow-y-auto max-h-[600px] custom-scrollbar">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-10 gap-5">
              {result.results.map((item) => (
                <div
                  key={`${item.answerType}-${item.number}`}
                  className={`
                    relative aspect-square flex flex-col items-center justify-center rounded-[24px] text-2xl font-black border-4 transition-all
                    ${item.result === "correct" ? "bg-emerald-50 border-emerald-500 text-emerald-600" : ""}
                    ${item.result === "wrong" ? "bg-rose-50 border-rose-500 text-rose-600" : ""}
                    ${item.result === "unanswered" ? "bg-slate-50 border-slate-200 text-slate-300" : ""}
                  `}
                >
                  <span className="mb-1">{item.number}</span>
                  <span
                    className={`
                    text-[10px] font-bold px-1.5 py-0.5 rounded-full border
                    ${item.answerType === "objective" ? "bg-white text-slate-500" : "bg-slate-800 text-white border-slate-800"}
                  `}
                  >
                    {item.answerType === "objective" ? "객관식" : "주관식"}
                  </span>

                  {/* 상태 아이콘 */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center bg-white shadow-md border">
                    {item.result === "correct" && (
                      <CheckIcon className="w-4 h-4 text-emerald-500" />
                    )}
                    {item.result === "wrong" && (
                      <XIcon className="w-4 h-4 text-rose-500" />
                    )}
                    {item.result === "unanswered" && (
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
