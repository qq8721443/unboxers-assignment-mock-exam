import type { ReactNode } from "react";
import { createContext, use } from "react";

const COLUMN_BASES = [0, 10, 20];
const QUESTION_PER_COLUMN = Array.from({ length: 10 }, (_, i) => i);
const CHOICES = [1, 2, 3, 4, 5];

interface SimpleOMRState {
  marked: { [key: number]: number | number[] | string };
  allowMultiple?: boolean;
  target?: { q: number; v: number };
}

interface SimpleOMRActions {
  onMark: (q: number, v: number) => void;
}

interface SimpleOMRContextValue {
  state: SimpleOMRState;
  actions: SimpleOMRActions;
}

const SimpleOMRContext = createContext<SimpleOMRContextValue | null>(null);
function useSimpleOMR() {
  const context = use(SimpleOMRContext);
  if (!context) {
    throw new Error("useSimpleOMR must be used within a SimpleOMRRoot");
  }
  return context;
}

interface SimpleOMRRootProps {
  children: ReactNode;
  marked: { [key: number]: number | number[] | string };
  onMark: (q: number, v: number) => void;
  allowMultiple?: boolean;
  target?: { q: number; v: number };
}

function SimpleOMRRoot({
  children,
  marked,
  onMark,
  allowMultiple,
  target,
}: SimpleOMRRootProps) {
  return (
    <SimpleOMRContext
      value={{
        state: { marked, allowMultiple, target },
        actions: { onMark },
      }}
    >
      <div className="flex flex-col items-center bg-gs-6 border-[1.5px] border-inbrain-lightblue shadow-strong overflow-hidden rounded-[2px]">
        {children}
      </div>
    </SimpleOMRContext>
  );
}

function SimpleOMRHeader({ title = "객 관 식 답 안" }: { title?: string }) {
  return (
    <div className="w-full border-b-[1.5px] border-inbrain-lightblue py-[6px] text-center font-bold text-inbrain-blue text-[24px] bg-white">
      {title}
    </div>
  );
}

function SimpleOMRContent() {
  const { state, actions } = useSimpleOMR();
  const { marked, allowMultiple, target } = state;
  const { onMark } = actions;

  return (
    <div className="flex gap-px bg-inbrain-lightblue">
      {COLUMN_BASES.map((base) => (
        <div key={base} className="flex bg-gs-6">
          <div className="flex flex-col bg-inbrain-lightblue/10 border-r border-inbrain-lightblue">
            {QUESTION_PER_COLUMN.map((i) => (
              <div
                key={i}
                className="h-11 w-7 flex items-center justify-center text-[17px] font-semibold text-inbrain-blue"
              >
                {base + i + 1}
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            {QUESTION_PER_COLUMN.map((i) => (
              <div
                key={i}
                className={`flex gap-[10px] px-3 h-11 items-center ${
                  (base + i + 1) % 5 === 0
                    ? "border-b-[0.5px] border-inbrain-lightblue/30"
                    : ""
                }`}
              >
                {CHOICES.map((v) => {
                  const qNum = base + i + 1;
                  const isTarget = target
                    ? target.q === qNum && target.v === v
                    : true;
                  const isMarked = allowMultiple
                    ? (marked[qNum] as number[])?.includes(v)
                    : marked[qNum] === v;

                  return (
                    <button
                      key={v}
                      type="button"
                      disabled={!isTarget}
                      onClick={() => onMark(qNum, v)}
                      className={`w-5 h-[34px] rounded-full flex items-center justify-center text-[14px] font-bold transition-all ${
                        isMarked
                          ? "bg-gs-1 text-gs-6"
                          : "bg-[#a5a4a0] text-gs-6"
                      } ${!isTarget ? "opacity-30 cursor-not-allowed" : "hover:scale-110 active:scale-95 cursor-pointer"}`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 헬퍼 컴포넌트 (기존 인터페이스 유지용)
export function SimpleOMR({
  marked,
  onMark,
  allowMultiple,
  target,
}: Omit<SimpleOMRRootProps, "children">) {
  return (
    <SimpleOMRRoot
      marked={marked}
      onMark={onMark}
      allowMultiple={allowMultiple}
      target={target}
    >
      <SimpleOMRHeader />
      <SimpleOMRContent />
    </SimpleOMRRoot>
  );
}

SimpleOMR.Root = SimpleOMRRoot;
SimpleOMR.Header = SimpleOMRHeader;
SimpleOMR.Content = SimpleOMRContent;
