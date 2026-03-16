import { PaperStack } from "../PaperStack";
import { TutorialStepLayout } from "../TutorialStepLayout";

export function Step0Intro() {
  return (
    <TutorialStepLayout
      showChevron={false}
      interactiveArea={
        <div className="max-h-full flex items-center justify-center">
          <PaperStack />
        </div>
      }
      instructionContent={
        <p>
          모의고사 모드는 처음이시죠? 실전 모의고사는
          <br />
          실전과 최대한 비슷한 환경으로 진행돼요
        </p>
      }
    />
  );
}
