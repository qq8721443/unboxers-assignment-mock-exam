import { ChevronDownIcon } from "@shared/ui/icons";
import type { ReactNode } from "react";

interface TutorialStepLayoutProps {
  interactiveArea: ReactNode;
  instructionTitle?: string;
  instructionContent: ReactNode;
  showChevron?: boolean;
}

export function TutorialStepLayout({
  interactiveArea,
  instructionTitle,
  instructionContent,
  showChevron = true,
}: TutorialStepLayoutProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full max-w-6xl min-h-0 px-10 py-6 overflow-hidden">
      <div className="flex-1 flex items-center justify-center w-full min-h-0">{interactiveArea}</div>
      <div className="text-center shrink-0">
        {showChevron && (
          <div className="flex flex-col items-center gap-[2px] mb-4">
            <div className="scale-y-[-1]">
              <ChevronDownIcon />
            </div>
            {instructionTitle && <p className="text-[17px] font-bold text-gs-1">{instructionTitle}</p>}
          </div>
        )}
        <div className="text-[30px] font-extrabold tracking-[0.3px] text-gs-1">
          <div className="leading-[1.2] tracking-[0.3px]">{instructionContent}</div>
        </div>
      </div>
    </div>
  );
}
