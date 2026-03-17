import type { ReactNode } from "react";
import { createContext, use, useEffect, useState } from "react";
import { CheckOneIcon, MessageReportIcon } from "./icons";

interface ExamStatusFooterState {
  title: string;
  statusText: string;
  durationText: string;
  progress: number;
  variant?: "default" | "warning";
  className?: string;
}

interface ExamStatusFooterActions {
  onHelpClick?: () => void;
  onClick?: () => void;
}

interface ExamStatusFooterContextValue {
  state: ExamStatusFooterState;
  actions: ExamStatusFooterActions;
}

const ExamStatusFooterContext =
  createContext<ExamStatusFooterContextValue | null>(null);

function useExamStatusFooter() {
  const context = use(ExamStatusFooterContext);
  if (!context) {
    throw new Error(
      "useExamStatusFooter must be used within a ExamStatusFooterRoot",
    );
  }
  return context;
}

interface ExamStatusFooterRootProps
  extends ExamStatusFooterState,
    ExamStatusFooterActions {
  children: ReactNode;
}

function ExamStatusFooterRoot({
  children,
  title,
  statusText,
  durationText,
  progress,
  variant = "default",
  className = "",
  onHelpClick,
  onClick,
}: ExamStatusFooterRootProps) {
  return (
    <ExamStatusFooterContext
      value={{
        state: {
          title,
          statusText,
          durationText,
          progress,
          variant,
          className,
        },
        actions: { onHelpClick, onClick },
      }}
    >
      <div
        className={`bg-white flex items-center justify-between gap-9 px-[60px] py-6 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.15)] ${className || "rounded-[16px]"}`}
      >
        {children}
      </div>
    </ExamStatusFooterContext>
  );
}

function ExamStatusFooterInfo() {
  const { state, actions } = useExamStatusFooter();
  const { title, statusText, durationText, progress, variant } = state;
  const { onClick } = actions;

  const [prevProgress, setPrevProgress] = useState(progress);

  useEffect(() => {
    setPrevProgress(progress);
  }, [progress]);

  const isWarning = variant === "warning";
  const statusColor = isWarning ? "text-[#f44c47]" : "text-[#333]";
  const progressColor = isWarning ? "bg-[#f44c47]" : "bg-[#333]";

  // 진행률이 감소하는 경우(예: 100% -> 0% 리셋)에는 애니메이션을 끕니다.
  const isResetting = progress < prevProgress;

  return (
    <div
      className={`flex flex-1 flex-col gap-2 items-start ${onClick ? "cursor-pointer active:opacity-70" : ""}`}
    >
      <p className="font-extrabold text-[17px] text-[#333] tracking-wider">
        {title}
      </p>
      <div className="flex items-end justify-between w-full">
        <p className={`font-extrabold text-[48px] ${statusColor} leading-none`}>
          {statusText}
        </p>
        <p className="font-semibold text-[17px] text-[#333] mb-1">
          {durationText}
        </p>
      </div>
      <div className="w-full h-2 bg-[#f5f5f5] rounded-full overflow-hidden mt-1">
        <div
          className={`h-full ${progressColor} ${isResetting ? "transition-none" : "transition-all duration-1000 ease-linear"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ExamStatusFooterActions({ children }: { children: ReactNode }) {
  const { actions } = useExamStatusFooter();
  const { onHelpClick } = actions;
  const [isCalled, setIsCalled] = useState(false);

  useEffect(() => {
    if (isCalled) {
      const timer = setTimeout(() => {
        setIsCalled(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCalled]);

  const handleHelpClick = () => {
    onHelpClick?.();
    setIsCalled(true);
  };

  return (
    <div className="flex items-center gap-3">
      {isCalled ? (
        <div className="flex items-center justify-center gap-2 h-[52px] w-[200px] bg-white rounded-xl shadow-[0px_8px_16px_0px_rgba(0,0,0,0.03)] border border-gray-100">
          <CheckOneIcon className="w-6 h-6 text-[#090909]" />
          <span className="font-bold text-[17px] text-[#090909] tracking-tight">
            선생님 호출 완료!
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleHelpClick}
          className="flex items-center gap-2 w-50 h-13 px-6 bg-white rounded-xl shadow-standard border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <MessageReportIcon className="w-6 h-6 text-[#090909]" />
          <span className="font-bold text-[17px] text-[#090909] tracking-tight">
            문제가 생겼나요?
          </span>
        </button>
      )}
      {children}
    </div>
  );
}

export const ExamStatusFooter = ({
  title,
  statusText,
  durationText,
  progress,
  onHelpClick,
  onClick,
  variant = "default",
  className = "",
  actionButton,
}: ExamStatusFooterState &
  ExamStatusFooterActions & { actionButton?: ReactNode }) => {
  return (
    <ExamStatusFooterRoot
      title={title}
      statusText={statusText}
      durationText={durationText}
      progress={progress}
      variant={variant}
      className={className}
      onHelpClick={onHelpClick}
      onClick={onClick}
    >
      <ExamStatusFooterInfo />
      <ExamStatusFooterActions>{actionButton}</ExamStatusFooterActions>
    </ExamStatusFooterRoot>
  );
};

ExamStatusFooter.Root = ExamStatusFooterRoot;
ExamStatusFooter.Info = ExamStatusFooterInfo;
ExamStatusFooter.Actions = ExamStatusFooterActions;
