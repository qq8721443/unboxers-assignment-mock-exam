import { useState } from "react";
import { useTutorial } from "../../model/tutorialContext";
import { SubjectiveKeypad } from "../SubjectiveKeypad";
import { SubjectiveTable } from "../SubjectiveTable";
import { TutorialStepLayout } from "../TutorialStepLayout";

export function Step3Subjective() {
  const { state, actions } = useTutorial();
  const [subStatus, setSubStatus] = useState(0);
  const [tempInput, setTempInput] = useState("");

  return (
    <TutorialStepLayout
      instructionTitle={subStatus === 2 ? "좋아요! 다음으로 넘어가볼까요?" : "다음으로 넘어가려면 직접 해보세요"}
      interactiveArea={
        <div className="flex gap-[24px] items-end scale-90">
          <div className="bg-[#fffdf1] p-[12px_20px_4px] rounded-8 shadow-strong border border-gs-5">
            <SubjectiveTable.Root
              highlightedQuestion={subStatus === 0 ? 4 : undefined}
              activeQuestion={subStatus === 1 ? 4 : undefined}
              answers={subStatus === 1 ? { ...state.markedAnswers, 4: tempInput } : state.markedAnswers}
              onSelect={(q) => {
                if (q === 4) {
                  setSubStatus(1);
                  setTempInput((state.markedAnswers[4] as string) || "");
                }
              }}
            >
              <SubjectiveTable.Header />
              <SubjectiveTable.Content />
            </SubjectiveTable.Root>
          </div>
          <SubjectiveKeypad.Root
            disabled={false}
            value={tempInput}
            placeholder={subStatus === 1 ? "4번 답안을 입력하세요" : "입력할 곳을 터치해주세요"}
            onChange={(val) => {
              if (subStatus === 1) {
                setTempInput(val);
              }
            }}
            onComplete={(val) => {
              if (subStatus === 1) {
                actions.updateAnswers({ ...state.markedAnswers, 4: val });
                setSubStatus(2);
                actions.completeInteraction(true);
                setTempInput("");
              }
            }}
          >
            <SubjectiveKeypad.Display />
            <SubjectiveKeypad.Keys />
            <SubjectiveKeypad.Submit label="완료" />
          </SubjectiveKeypad.Root>
        </div>
      }
      instructionContent={
        <>
          {subStatus === 0 && (
            <p className="leading-[1.2]">
              주관식 답안을 입력하려면 입력할 곳을 터치해요
              <br />
              <span className="text-interactive-blue">4번 문제</span>의 답안을 입력해볼까요?
            </p>
          )}
          {subStatus === 1 && (
            <p className="leading-[1.2]">
              아무 숫자나 입력하고
              <br />
              <span className="text-interactive-blue">완료</span> 버튼을 눌러서 답안을 작성해요
            </p>
          )}
          {subStatus === 2 && (
            <p className="leading-[1.2]">
              입력한 답안을 수정하려면
              <br />
              해당 문제를 다시 한 번 터치해요
            </p>
          )}
        </>
      }
    />
  );
}
