import { DeleteIcon } from "@shared/ui/icons";
import type { ReactNode } from "react";
import { createContext, use } from "react";

const KEYPAD_KEYS = [".", "/", "-", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

interface SubjectiveKeypadState {
  value: string;
  disabled?: boolean;
  placeholder?: string;
}

interface SubjectiveKeypadActions {
  onChange: (val: string) => void;
  onComplete?: (val: string) => void;
}

interface SubjectiveKeypadContextValue {
  state: SubjectiveKeypadState;
  actions: SubjectiveKeypadActions;
}

const SubjectiveKeypadContext = createContext<SubjectiveKeypadContextValue | null>(null);

function useSubjectiveKeypad() {
  const context = use(SubjectiveKeypadContext);
  if (!context) {
    throw new Error("useSubjectiveKeypad must be used within a SubjectiveKeypadRoot");
  }
  return context;
}

interface SubjectiveKeypadRootProps extends SubjectiveKeypadState, SubjectiveKeypadActions {
  children: ReactNode;
}

function SubjectiveKeypadRoot({
  children,
  value,
  onChange,
  onComplete,
  disabled,
  placeholder,
}: SubjectiveKeypadRootProps) {
  return (
    <SubjectiveKeypadContext
      value={{
        state: { value, disabled, placeholder },
        actions: { onChange, onComplete },
      }}
    >
      <div className={`flex flex-col gap-6 w-[243px] ${disabled ? "opacity-30" : ""}`}>{children}</div>
    </SubjectiveKeypadContext>
  );
}

function SubjectiveKeypadDisplay() {
  const { state } = useSubjectiveKeypad();
  const { value, placeholder } = state;

  return (
    <div className="bg-gs-6 h-[52px] flex items-center justify-center rounded-3 shadow-standard text-center text-gs-1 font-bold text-xl min-w-0 px-2 overflow-hidden">
      <span className="truncate">
        {value || <span className="text-gs-3 text-[17px]">{placeholder || "답안을 입력하세요"}</span>}
      </span>
    </div>
  );
}

function SubjectiveKeypadKeys() {
  const { state, actions } = useSubjectiveKeypad();
  const { value, disabled } = state;
  const { onChange } = actions;

  const handleKeyPress = (k: string) => {
    if (disabled) return;
    if (value.length < 5) onChange(value + k);
  };

  const handleDelete = () => {
    if (disabled) return;
    onChange(value.slice(0, -1));
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {KEYPAD_KEYS.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => handleKeyPress(k)}
          className="bg-gs-6 h-[52px] rounded-3 shadow-standard text-xl font-bold flex items-center justify-center active:bg-gs-5 cursor-pointer"
        >
          {k}
        </button>
      ))}
      <button
        type="button"
        onClick={() => handleKeyPress("0")}
        className="col-span-2 bg-gs-6 h-[52px] rounded-3 shadow-standard text-xl font-bold flex items-center justify-center active:bg-gs-5 cursor-pointer"
      >
        0
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="bg-gs-6 h-[52px] rounded-3 shadow-standard flex items-center justify-center active:bg-gs-5 cursor-pointer"
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

function SubjectiveKeypadSubmit({ label = "완료" }: { label?: string }) {
  const { state, actions } = useSubjectiveKeypad();
  const { value, disabled } = state;
  const { onComplete } = actions;

  return (
    <button
      type="button"
      onClick={() => onComplete?.(value)}
      disabled={disabled || !value}
      className={`h-[52px] rounded-4 shadow-standard font-bold text-[17px] transition-all ${
        value && !disabled ? "bg-blue-grad text-gs-6 active:scale-95 cursor-pointer" : "bg-gs-5 text-gs-3"
      }`}
    >
      {label}
    </button>
  );
}

export function SubjectiveKeypad({
  value,
  onChange,
  onComplete,
  disabled,
  placeholder,
}: Omit<SubjectiveKeypadRootProps, "children">) {
  return (
    <SubjectiveKeypadRoot
      value={value}
      onChange={onChange}
      onComplete={onComplete}
      disabled={disabled}
      placeholder={placeholder}
    >
      <SubjectiveKeypadDisplay />
      <SubjectiveKeypadKeys />
      <SubjectiveKeypadSubmit />
    </SubjectiveKeypadRoot>
  );
}

SubjectiveKeypad.Root = SubjectiveKeypadRoot;
SubjectiveKeypad.Display = SubjectiveKeypadDisplay;
SubjectiveKeypad.Keys = SubjectiveKeypadKeys;
SubjectiveKeypad.Submit = SubjectiveKeypadSubmit;
