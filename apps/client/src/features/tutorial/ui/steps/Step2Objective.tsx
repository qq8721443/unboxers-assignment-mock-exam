import { useState } from "react";
import { useTutorial } from "../../model/tutorialContext";
import { SimpleOMR } from "../SimpleOMR";
import { TutorialStepLayout } from "../TutorialStepLayout";

const TUTORIAL_TARGET = { q: 15, v: 3 };

export function Step2Objective() {
  const { state, actions } = useTutorial();
  const [subStatus, setSubStatus] = useState(0);

  const handleMark = (q: number, v: number) => {
    const current = state.markedAnswers[q];
    if (current === v) {
      const next = { ...state.markedAnswers };
      delete next[q];
      actions.updateAnswers(next);
      if (subStatus === 1) {
        setSubStatus(2);
        actions.completeInteraction(true);
      }
    } else {
      actions.updateAnswers({ ...state.markedAnswers, [q]: v });
      if (subStatus === 0) setSubStatus(1);
    }
  };

  return (
    <TutorialStepLayout
      instructionTitle={subStatus === 2 ? "좋아요! 다음으로 넘어가볼까요?" : "다음으로 넘어가려면 직접 해보세요"}
      interactiveArea={
        <div className="bg-[#fffdf1] p-[20px_20px_4px] rounded-8 shadow-strong border border-gs-5 scale-90">
          <SimpleOMR.Root marked={state.markedAnswers} target={TUTORIAL_TARGET} onMark={handleMark}>
            <SimpleOMR.Header />
            <SimpleOMR.Content />
          </SimpleOMR.Root>
        </div>
      }
      instructionContent={
        <>
          {subStatus === 0 && (
            <p className="leading-[1.2]">
              객관식 답안은 화면을 터치해서 마킹해요
              <br />
              <span className="text-interactive-blue">15번 문제</span>에{" "}
              <span className="text-interactive-blue">3번</span>으로 답안을 마킹해보세요
            </p>
          )}
          {subStatus === 1 && (
            <p className="leading-[1.2]">
              마킹한 곳을 한 번 더 터치하면 지울 수 있어요
              <br />
              <span className="text-interactive-blue">15번 문제</span>에{" "}
              <span className="text-interactive-blue">3번</span> 답안을 지워보세요
            </p>
          )}
          {subStatus === 2 && (
            <p className="leading-[1.2]">
              2개 이상의 답안을 골라야 하는 문제에서는
              <br />두 답안 모두 마킹하면 돼요
            </p>
          )}
        </>
      }
    />
  );
}
