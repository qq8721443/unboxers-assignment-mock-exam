import { createBrowserRouter, redirect } from "react-router";
import { ExamPage } from "../../pages/exam/ui/Exam";
import { ResultPage } from "../../pages/result/ui/Result";
import { TutorialPage } from "../../pages/tutorial/ui/Tutorial";
import { GlobalErrorFallback } from "../../shared/ui/GlobalErrorFallback";
import { RootLayout } from "../layouts/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <GlobalErrorFallback />,
    children: [
      {
        path: "/",
        loader: async () => redirect("/tutorial"),
      },
      {
        path: "/tutorial",
        element: <TutorialPage />,
      },
      {
        path: "/exam",
        element: <ExamPage />,
      },
      {
        path: "/result",
        element: <ResultPage />,
      },
    ],
  },
]);
