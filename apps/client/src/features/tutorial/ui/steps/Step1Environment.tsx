import omrImage from "../../assets/omr-image.png";
import { PaperStack } from "../PaperStack";
import { TutorialStepLayout } from "../TutorialStepLayout";

export function Step1Environment() {
  return (
    <TutorialStepLayout
      showChevron={false}
      interactiveArea={
        <div className="flex items-center gap-[40px] scale-90">
          <PaperStack small />
          <div className="bg-[#fffdf1] p-6 rounded-8 shadow-strong border border-gs-5 shrink-0">
            <div className="w-[611px] h-[320px] flex items-center justify-center overflow-hidden">
              <img
                src={omrImage}
                alt="OMR Card"
                width={611}
                height={320}
                className="h-[320px] w-auto object-contain rounded-[2px]"
              />
            </div>
          </div>
        </div>
      }
      instructionContent={
        <p>
          실제 시험지 크기에 인쇄된 시험지에 문제를 풀고
          <br />
          화면에 표시된 OMR카드에 답을 마킹해요
        </p>
      }
    />
  );
}
