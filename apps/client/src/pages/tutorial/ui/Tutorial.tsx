import omrImage from "@features/tutorial/assets/omr-image.png";
import { TutorialProvider, useTutorial } from "@features/tutorial/model/tutorialContext";
import { Step0Intro } from "@features/tutorial/ui/steps/Step0Intro";
import { Step1Environment } from "@features/tutorial/ui/steps/Step1Environment";
import { Step2Objective } from "@features/tutorial/ui/steps/Step2Objective";
import { Step3Subjective } from "@features/tutorial/ui/steps/Step3Subjective";
import { Step4Submit } from "@features/tutorial/ui/steps/Step4Submit";
import { ArrowLeftIcon, ChevronDownIcon } from "@shared/ui/icons";

// 앱 로드 시점에 이미지를 한 번만 로드하여 메모리에 상주시킵니다.
if (typeof window !== "undefined") {
  const img = new Image();
  img.src = omrImage;
}

function TutorialContent() {
  const { state, actions } = useTutorial();
  const { currentStep, interactionCompleted } = state;

  // 단계별 컴포넌트 렌더링 매핑
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step0Intro />;
      case 1:
        return <Step1Environment />;
      case 2:
        return <Step2Objective />;
      case 3:
        return <Step3Subjective />;
      case 4:
        return <Step4Submit />;
      default:
        return null;
    }
  };

  const isInteractiveStep = currentStep === 2 || currentStep === 3;
  const canGoNext = !isInteractiveStep || interactionCompleted;

  return (
    <div className="fixed inset-0 bg-gs-6 flex flex-col font-pretendard select-none overflow-hidden text-gs-1">
      <header className="h-[65px] flex items-center justify-between px-[24px] border-b border-gs-5 shrink-0 bg-gs-6 z-10">
        <div className="flex items-center gap-[12px] flex-1">
          <div className="w-[40px] h-[40px] flex items-center justify-center">
            <img src="/logo.svg" alt="로고" className="w-full h-full" />
          </div>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-[20px] font-bold text-brand-primary tracking-[-0.408px]">모의고사 모드</h1>
        </div>
        <div className="flex items-center gap-[16px] flex-1 justify-end">
          <div className="bg-gs-6 border border-gs-5 h-[44px] px-[16px] flex items-center justify-between rounded-[10px] shadow-standard w-[180px]">
            <span className="text-[17px] font-bold tracking-[-0.408px]">홍정기 학생</span>
            <ChevronDownIcon />
          </div>
          <button
            type="button"
            className="bg-gs-6 h-[44px] px-[16px] flex items-center justify-center rounded-[10px] shadow-standard text-[17px] font-bold hover:bg-gs-5 transition-colors tracking-[-0.408px]"
          >
            홈으로
          </button>
        </div>
      </header>

      <main className="flex-1 bg-gs-4 flex flex-col items-center justify-between min-h-0">
        {renderStep()}

        <div
          className={`w-full max-w-[1200px] flex items-center shrink-0 px-10 pb-8 pt-4 ${currentStep === 0 ? "justify-center" : "justify-between"}`}
        >
          {currentStep > 0 && (
            <div className="w-[200px]">
              <button
                type="button"
                onClick={actions.prev}
                className="bg-gs-6 w-full h-[52px] flex items-center justify-center gap-2 rounded-3 shadow-standard text-[17px] font-bold active:scale-95 transition-all tracking-[-0.408px]"
              >
                <ArrowLeftIcon />
                이전으로
              </button>
            </div>
          )}
          <div className="flex items-center gap-[12px]">
            {currentStep < 4 && (
              <button
                type="button"
                onClick={actions.skip}
                className="bg-gs-6 w-[200px] h-[52px] flex items-center justify-center rounded-3 shadow-standard text-[17px] font-bold active:scale-95 transition-all hover:bg-gs-5 tracking-[-0.408px]"
              >
                튜토리얼 건너뛰기
              </button>
            )}
            <button
              type="button"
              onClick={actions.next}
              disabled={!canGoNext}
              className={`w-[200px] h-[52px] flex items-center justify-center rounded-3 shadow-standard text-[17px] font-bold transition-all active:scale-95 tracking-[-0.408px] ${
                canGoNext
                  ? "bg-black-grad text-gs-6 shadow-md cursor-pointer hover:opacity-90"
                  : "bg-gs-5 text-gs-3 cursor-not-allowed"
              }`}
            >
              {currentStep === 4 ? "시험 화면으로 이동" : "다음"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export function TutorialPage() {
  return (
    <TutorialProvider>
      <TutorialContent />
    </TutorialProvider>
  );
}
