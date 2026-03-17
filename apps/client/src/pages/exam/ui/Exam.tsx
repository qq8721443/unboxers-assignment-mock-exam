import type { ExamSubmitRequest } from "@custom-types/exam.type";
import { useAnswerStore } from "@entities/answer/model/answerStore";
import { useGetExam } from "@entities/exam/api/exam.queries";
import { useGetStudent } from "@entities/student/api/student.queries";
import { OMRCard } from "@features/exam/ui/OMRCard";
import { useSubmitExam } from "@features/submit-exam/api/submit.mutations";
import { SubjectiveKeypad } from "@features/tutorial/ui/SubjectiveKeypad";
import { ExamStatusFooter } from "@shared/ui/ExamStatusFooter";
import { ExitIcon } from "@shared/ui/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

type ExamStatus = "prep" | "testing" | "ready" | "submitting" | "submitted";

// 외부에서 주입해야 할 값이라고 생각하지만 현재는 받아올 값이 없어서 상수로 관리.
const PREP_TIME = 10; // 시험 전 대기 시간 (10초)
const EXAM_TIME = 10; // 시험 시간 (10초)

export function ExamPage() {
  const navigate = useNavigate();
  const { data: examData } = useGetExam();
  const { data: studentData } = useGetStudent();
  const answers = useAnswerStore((state) => state.answers);
  const setAnswer = useAnswerStore((state) => state.setAnswer);
  const resetAnswer = useAnswerStore((state) => state.resetAnswers);
  const { mutateAsync: submit, isPending } = useSubmitExam();

  const exam = examData?.data;
  const student = studentData;

  // 시험 상태 관리 (초기 상태: 시험 전 대기)
  const [status, setStatus] = useState<ExamStatus>("prep");

  // OMR 상태 관리 (Zustand 스토어의 데이터를 OMRCard 포맷에 맞게 변환)
  const markedAnswers = useMemo(() => {
    return answers.reduce(
      (acc, curr) => {
        acc[curr.number] = curr.answer;
        return acc;
      },
      {} as Record<number, number[] | string>,
    );
  }, [answers]);

  const [activeQuestion, setActiveQuestion] = useState<number | undefined>();
  const [tempValue, setTempValue] = useState("");

  // 학년 및 번호 자리수별 독립 관리
  const [grade, setGrade] = useState<number | undefined>();
  const [tens, setTens] = useState<number | undefined>();
  const [units, setUnits] = useState<number | undefined>();

  // 시간 상태
  const [timeLeft, setTimeLeft] = useState(PREP_TIME);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (status === "prep") return `${m}분 ${s}초 뒤 시작`;
    return `${m}분 ${s}초 남음`;
  };

  const handleMarkObjective = (qNum: number, v: number) => {
    // 시험 전(prep)과 시험 중(testing) 모두 마킹 허용
    if (status !== "prep" && status !== "testing") return;

    const current = (markedAnswers[qNum] as number[]) || [];
    const next = current.includes(v)
      ? current.filter((item) => item !== v)
      : [...current, v].sort();

    setAnswer(qNum, next, "objective");
  };

  const handleSelectSubjective = (qNum: number) => {
    if (status !== "prep" && status !== "testing") return;
    if (activeQuestion === qNum) {
      setActiveQuestion(undefined);
      setTempValue("");
    } else {
      setActiveQuestion(qNum);
      setTempValue((markedAnswers[qNum] as string) || "");
    }
  };

  const handleCompleteSubjective = (val: string) => {
    // 현재 활성화된 문항 번호를 캡처합니다.
    const qNum = activeQuestion;
    if (qNum) {
      // 스토어에 저장
      setAnswer(qNum, val, "subjective");
      // 선택 상태 및 입력값 초기화
      setActiveQuestion(undefined);
      setTempValue("");
    }
  };

  const handleExit = () => {
    if (
      confirm(
        "시험을 종료하시겠습니까? 입력 중인 답안이 저장되지 않을 수 있습니다.",
      )
    ) {
      navigate("/tutorial");
    }
  };

  // 푸터에서 제출 버튼 클릭 시
  const handleInitialSubmit = useCallback(() => {
    if (!student) return;

    setStatus("ready");
  }, [student]);

  // 채점 시작하기 버튼 클릭 시
  const handleStartGrading = useCallback(async () => {
    if (!student) return;

    let studentNumber = 0;
    if (tens !== undefined && units !== undefined) {
      studentNumber = tens * 10 + units;
    }

    const payload: ExamSubmitRequest = {
      name: student.name,
      school: student.school,
      grade: grade ?? student.grade,
      studentNumber: studentNumber ?? student.studentNumber,
      seatNumber: student.seatNumber,
      answers: answers.map((a) => {
        let finalAnswer = 0;

        if (a.answerType === "objective") {
          // 객관식: [1, 2] -> "12" -> 12로 변환 (중복 선택 가능 상황 고려)
          finalAnswer = Number(
            Array.isArray(a.answer) ? a.answer.join("") : a.answer,
          );
        } else {
          // 주관식: 문자열에서 숫자와 마이너스, 점 슬래시(/)만 남기고 숫자로 변환
          const cleaned = String(a.answer).replace(/[^0-9.-/]/g, "");
          finalAnswer = cleaned ? Number(cleaned) : 0;
        }

        return {
          answerType: a.answerType,
          // 주관식(subjective)은 31~42번으로 관리되고 있으므로, 서버 전송 시 1~12번이 되도록 30을 뺍니다.
          number: a.answerType === "subjective" ? a.number - 30 : a.number,
          answer: Number.isNaN(finalAnswer) ? 0 : finalAnswer,
        };
      }),
    };

    try {
      setStatus("submitting");
      // 최소 2초 대기 + API 호출
      const [response] = await Promise.all([
        submit(payload),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      resetAnswer();
      navigate("/result", { state: response.data });
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus("testing");
    }
  }, [student, submit, answers, grade, tens, units, navigate, resetAnswer]);

  useEffect(() => {
    // ready, submitting 상태에서는 타이머를 멈춥니다.
    if (status === "ready" || status === "submitting" || status === "submitted")
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (status === "prep") {
            // 대기 시간 종료 시 시험 시작
            setStatus("testing");
            return EXAM_TIME;
          }
          if (status === "testing") {
            // 시험 시간 종료 시 자동 제출
            handleInitialSubmit();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, handleInitialSubmit]);

  useEffect(() => {
    if (isPending) {
      setStatus("submitting");
    }
  }, [isPending]);

  const isTesting = status === "testing" || status === "prep";

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col font-pretendard select-none overflow-hidden items-center justify-center p-4 relative">
      {/* Top Navigation Bar (Exit Button) */}
      <div className="fixed top-[25px] right-[26.04px] z-50">
        <button
          type="button"
          onClick={handleExit}
          className="w-[120px] h-[44px] bg-white rounded-[10px] flex items-center justify-center gap-1.5 px-4 shadow-sm border border-gs-4 active:scale-95 transition-all cursor-pointer"
        >
          <span className="text-gs-1 font-bold text-[15px]">종료하기</span>
          <ExitIcon className="w-6 h-6 text-gs-1" />
        </button>
      </div>

      {/* Main Content Section */}
      <main
        className={`flex items-center justify-center gap-[40px] w-full max-w-[1700px] transition-all duration-500 ease-in-out ${
          isTesting ? "pb-[161px]" : "flex-col"
        }`}
      >
        {/* OMR Card Area */}
        <div
          className={`relative transition-all duration-500 ease-in-out ${
            isTesting
              ? "scale-[0.8] xl:scale-[1]"
              : "scale-[0.85] xl:scale-[0.9]"
          }`}
        >
          <OMRCard
            student={{
              name: student?.name || "로딩 중",
              school: student?.school || "로딩 중",
              seatNumber: `${student?.seatNumber || 0}번`,
              supervisor: exam?.supervisorName || "로딩 중",
              grade: grade,
              tens: tens,
              units: units,
            }}
            exam={{ title: exam?.title || "로딩 중", subject: "공통수학2" }}
            markedAnswers={markedAnswers}
            activeQuestion={activeQuestion}
            tempSubjectiveValue={tempValue}
            onMarkObjective={handleMarkObjective}
            onSelectSubjective={handleSelectSubjective}
            onSelectGrade={setGrade}
            onSelectTens={setTens}
            onSelectUnits={setUnits}
          />

          {/* 스캔 애니메이션 (submitting 상태일 때만 표시) */}
          {status === "submitting" && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[20px]">
              {/* 세로 스캔 라인 */}
              <div className="animate-scan absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] z-20" />
              {/* 스캔 진행 방향 그라데이션 영역 (왼쪽에서 오른쪽) */}
              <div className="animate-scan-area absolute top-0 bottom-0 w-[100px] bg-gradient-to-r from-red-500/20 to-transparent z-10" />
            </div>
          )}
        </div>

        {/* Conditional Layout Elements */}
        {isTesting ? (
          /* Testing Mode: Right Column (Keypad) */
          <div className="w-[243px] shrink-0 flex flex-col gap-8 items-center justify-center h-full animate-in fade-in duration-500">
            <div>
              <p className="text-[#676663] text-[12px] leading-[1] tracking-[0.07px] break-keep whitespace-pre-line">
                {`모든 주관식 답은 숫자와 소숫점, 슬래시(/), 마이너스(-) 기호로 이루어져 있습니다.

                마이너스 2분의 3을 입력할 때는 “-3/2”라고 입력하면 돼요.
                소숫점은 유효숫자 개수를 맞춰서 입력합니다.

                단위가 포함된 주관식 답안은 숫자만 입력합니다.

                예시)
                제3사분면 → 3
                3,700만원 → 37000000
                95% → 95`}
              </p>
            </div>

            <SubjectiveKeypad.Root
              value={tempValue}
              onChange={(val) => {
                if (activeQuestion) setTempValue(val);
              }}
              onComplete={(val) => {
                if (activeQuestion) handleCompleteSubjective(val);
              }}
              placeholder={
                activeQuestion
                  ? `${activeQuestion - 30}번 답안 입력`
                  : "입력할 곳을 터치해주세요"
              }
              disabled={false}
            >
              <SubjectiveKeypad.Display />
              <SubjectiveKeypad.Keys />
              <SubjectiveKeypad.Submit label="완료" />
            </SubjectiveKeypad.Root>
          </div>
        ) : (
          /* Ready/Submitting/Submitted Mode: Status Message & Buttons */
          <div className="flex flex-col items-center gap-[48px] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-[32px] xl:text-[36px] font-extrabold text-gs-1 text-center whitespace-pre-line leading-tight">
              {status === "ready" &&
                "제출 완료!\n고생 많았어요. 결과를 바로 확인해볼까요?"}
              {status === "submitting" &&
                "OMR 카드 스캔중...\n곧 결과가 나와요"}
            </h2>

            {status === "ready" && (
              <button
                onClick={handleStartGrading}
                type="button"
                className="h-[52px] min-w-[243px] rounded-xl bg-black-grad text-white font-bold text-[18px] shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                결과 보기
              </button>
            )}

            {status === "submitting" && (
              <button
                disabled
                type="button"
                className="h-[52px] min-w-[243px] rounded-xl bg-gs-5 text-gs-2 font-bold text-[18px]"
              >
                과연 몇 점일까요?
              </button>
            )}
          </div>
        )}
      </main>

      {/* Footer (only visible during testing or prep) */}
      {isTesting && (
        <footer className="fixed bottom-0 left-0 right-0 h-[161px] bg-white z-40 flex items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-500">
          <ExamStatusFooter
            title={
              status === "prep"
                ? "시험 시작까지 남은 시간"
                : exam?.title || "시험 종료까지 남은 시간"
            }
            statusText={formatTime(timeLeft)}
            durationText={
              // TODO: PREP_TIME, EXAM_TIME에 맞게 변경해야 함.
              status === "prep" ? `대기 시간 10초` : "시험 시간 10초"
            }
            progress={
              status === "prep"
                ? 100
                : ((EXAM_TIME - timeLeft) / EXAM_TIME) * 100
            }
            className="rounded-none h-full border-t border-gs-4 shadow-none px-[60px] w-full"
            onHelpClick={() => alert("도움말 기능은 준비 중입니다.")}
            actionButton={
              status === "testing" && (
                <button
                  type="button"
                  onClick={handleInitialSubmit}
                  className="h-[60px] px-12 bg-gs-1 text-white rounded-xl font-bold text-[20px] shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  제출하기
                </button>
              )
            }
          />
        </footer>
      )}
    </div>
  );
}
