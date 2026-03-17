import { createBrowserRouter, redirect } from "react-router";
import { ExamPage } from "../../pages/exam/ui/Exam";
import { ResultPage } from "../../pages/result/ui/Result";
import { TutorialPage } from "../../pages/tutorial/ui/Tutorial";
import { RootLayout } from "../layouts/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
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
