import type { ReactNode } from "react";
import { createContext, use } from "react";

const SUBJECTIVE_QUESTION_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);

interface SubjectiveTableState {
  highlightedQuestion?: number;
  activeQuestion?: number;
  answers?: { [key: number]: number | number[] | string };
}

interface SubjectiveTableActions {
  onSelect?: (q: number) => void;
}

interface SubjectiveTableContextValue {
  state: SubjectiveTableState;
  actions: SubjectiveTableActions;
}

const SubjectiveTableContext = createContext<SubjectiveTableContextValue | null>(null);

function useSubjectiveTable() {
  const context = use(SubjectiveTableContext);
  if (!context) {
    throw new Error("useSubjectiveTable must be used within a SubjectiveTableRoot");
  }
  return context;
}

interface SubjectiveTableRootProps extends SubjectiveTableState, SubjectiveTableActions {
  children: ReactNode;
}

function SubjectiveTableRoot({
  children,
  highlightedQuestion,
  activeQuestion,
  onSelect,
  answers,
}: SubjectiveTableRootProps) {
  return (
    <SubjectiveTableContext
      value={{
        state: { highlightedQuestion, activeQuestion, answers },
        actions: { onSelect },
      }}
    >
      <div className="flex flex-col bg-gs-6 border-[1.5px] border-interactive-blue w-[360px]">{children}</div>
    </SubjectiveTableContext>
  );
}

function SubjectiveTableHeader({ title = "주 관 식 답 안" }: { title?: string }) {
  return (
    <div className="w-full border-b border-interactive-blue py-1 text-center font-semibold text-inbrain-blue text-[24px]">
      {title}
    </div>
  );
}

function SubjectiveTableContent() {
  const { state, actions } = useSubjectiveTable();
  const { highlightedQuestion, activeQuestion, answers } = state;
  const { onSelect } = actions;

  return (
    <>
      {SUBJECTIVE_QUESTION_NUMBERS.map((qNum) => {
        const isActive = activeQuestion === qNum;
        const isHighlighted = highlightedQuestion === qNum;
        return (
          <div key={qNum} className="flex h-10 border-b border-interactive-blue last:border-0">
            <div className="w-10 bg-interactive-blue/20 flex items-center justify-center text-inbrain-blue font-semibold border-r border-interactive-blue">
              {qNum}
            </div>
            <button
              type="button"
              onClick={() => onSelect?.(qNum)}
              className={`flex-1 flex items-center justify-center px-4 transition-all ${
                isActive ? "border-[3px] border-interactive-blue" : ""
              } ${isHighlighted ? "bg-yellow-50 font-bold animate-pulse" : ""}`}
            >
              <span className={`text-[15px] ${answers?.[qNum] ? "text-gs-1 font-bold" : "text-gs-3"}`}>
                {answers?.[qNum] ||
                  (isActive ? "답안을 입력하세요" : isHighlighted ? "여기를 터치해줘요!" : "터치해서 주관식 답안 입력")}
              </span>
            </button>
          </div>
        );
      })}
    </>
  );
}

export function SubjectiveTable({
  highlightedQuestion,
  activeQuestion,
  onSelect,
  answers,
}: Omit<SubjectiveTableRootProps, "children">) {
  return (
    <SubjectiveTableRoot
      highlightedQuestion={highlightedQuestion}
      activeQuestion={activeQuestion}
      onSelect={onSelect}
      answers={answers}
    >
      <SubjectiveTableHeader />
      <SubjectiveTableContent />
    </SubjectiveTableRoot>
  );
}

SubjectiveTable.Root = SubjectiveTableRoot;
SubjectiveTable.Header = SubjectiveTableHeader;
SubjectiveTable.Content = SubjectiveTableContent;
