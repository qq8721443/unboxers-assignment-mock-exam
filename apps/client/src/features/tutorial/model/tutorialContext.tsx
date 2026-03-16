import type { ReactNode } from "react";
import { createContext, use, useCallback, useState } from "react";
import { useNavigate } from "react-router";

interface TutorialState {
  currentStep: number;
  interactionCompleted: boolean;
  markedAnswers: { [key: number]: number | number[] | string };
}

interface TutorialActions {
  next: () => void;
  prev: () => void;
  skip: () => void;
  updateAnswers: (answers: { [key: number]: number | number[] | string }) => void;
  completeInteraction: (completed: boolean) => void;
}

interface TutorialContextValue {
  state: TutorialState;
  actions: TutorialActions;
}

const TutorialContext = createContext<TutorialContextValue | null>(null);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [interactionCompleted, setInteractionCompleted] = useState(false);
  const [markedAnswers, setMarkedAnswers] = useState<{
    [key: number]: number | number[] | string;
  }>({});
  const navigate = useNavigate();

  const resetStepState = useCallback(() => {
    setInteractionCompleted(false);
    setMarkedAnswers({});
  }, []);

  const next = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      resetStepState();
    } else {
      navigate("/exam");
    }
  }, [currentStep, resetStepState, navigate]);

  const prev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      resetStepState();
    }
  }, [currentStep, resetStepState]);

  const skip = useCallback(() => {
    navigate("/exam");
  }, [navigate]);

  return (
    <TutorialContext
      value={{
        state: { currentStep, interactionCompleted, markedAnswers },
        actions: {
          next,
          prev,
          skip,
          updateAnswers: setMarkedAnswers,
          completeInteraction: setInteractionCompleted,
        },
      }}
    >
      {children}
    </TutorialContext>
  );
}

export function useTutorial() {
  const context = use(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
}
