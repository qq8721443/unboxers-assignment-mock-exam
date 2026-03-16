import { ExamStatusFooter } from "@shared/ui/ExamStatusFooter";
import { useTutorial } from "../../model/tutorialContext";

export function Step4Submit() {
  const { actions } = useTutorial();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-[48px] w-full max-w-[1200px] min-h-0 px-10 py-6 overflow-hidden">
      {/* Footer 영역을 감싸고 그 위에 투명한 막(Overlay)을 씌워 클릭을 차단합니다. */}
      <div className="w-full relative">
        <ExamStatusFooter.Root
          className="w-full"
          title="시험 종료까지 남은 시간"
          statusText="5초"
          durationText="시험 시간 60분"
          progress={5}
          variant="warning"
          onHelpClick={() => {}}
        >
          <ExamStatusFooter.Info />
          <ExamStatusFooter.Actions>
            <button
              type="button"
              onClick={actions.next}
              className="bg-gradient-to-r from-[#364f8e] to-[#5784f1] h-[60px] px-8 items-center justify-center rounded-[16px] shadow-[0px_8px_16px_0px_rgba(0,0,0,0.03)] font-bold text-[17px] text-white tracking-[-0.408px]"
            >
              답안 제출하기
            </button>
          </ExamStatusFooter.Actions>
        </ExamStatusFooter.Root>
        {/* 이 div가 전체 컴포넌트를 덮어 모든 상호작용을 차단합니다. */}
        <div className="absolute inset-0 z-10 cursor-default" />
      </div>

      <div className="text-[36px] font-extrabold tracking-[0.364px] text-[#090909] text-center leading-[1.3] max-w-[1000px]">
        <p className="whitespace-pre-line">시간이 모두 지나면 시험은 종료되고 OMR카드는 자동으로 제출돼요</p>
        <p className="text-[#f44c47] mt-2">마킹하지 못한 답안은 모두 오답 처리되니 미리 마킹하세요</p>
      </div>
    </div>
  );
}
