"use client";

import { useQuizApp } from "@/hooks/useQuiz";
import { useEffect, useState } from "react";
import withBasicAuth from "@/components/withBasicAuth";
import PendingQuestions from "@/components/PendingQuestions";
import AnsweredQuestions from "@/components/AnsweredQuestions";
import AdminAnswers from "@/components/AdminAnswers";

const Answers = () => {
  const { db } = useQuizApp();

  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [queState, setQueState] = useState("pending");
  const [questionsAnswered, setQuestionsAnswered] = useState<Array<any>>([]);
  const [questionsUnanswered, setQuestionsUnanswered] = useState<Array<any>>(
    []
  );

  const fetchQuestionsForUsers = async () => {
    const id = localStorage.getItem("userId");
    const allQuestions = await db.questions.toArray();

    if (id) {
      const answeredQuestions = await db.answeredQuestions
        .where("userId")
        .equals(id)
        .toArray();

      const newData = answeredQuestions.map((item) => {
        const queObj = allQuestions.find(
          (que) => que.questionId === item.questionId
        );
        const data = {
          ...item,
          question: queObj?.question,
          createdAt: queObj?.createdAt,
        };
        return data;
      });

      const queIds = answeredQuestions.map((item) => item.questionId);

      const unansweredQuestions = allQuestions.filter(
        (question) => !queIds.includes(question.questionId)
      );

      setQuestionsAnswered(newData);
      setQuestionsUnanswered(unansweredQuestions);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");
    role && setUserRole(role);
    id && setUserId(id);
  }, [localStorage]);

  useEffect(() => {
    fetchQuestionsForUsers();
  }, [db]);

  return (
    <div className="mt-5 w-full px-2 xs:px-0 xs:w-[80%] sm:w-[70%] mx-auto">
      {userRole === "user" ? (
        <>
          <div className="flex space-x-3 p-3 sticky top-0 bg-white z-10">
            <label
              onClick={() => setQueState("pending")}
              className={`${
                queState === "pending" ? "border-b-2 border-b-purple-700" : ""
              } cursor-pointer pb-2 font-bold text-sm xs:text-md px-2`}
            >
              Pending Questions
            </label>
            <label
              onClick={() => setQueState("answered")}
              className={`${
                queState === "answered" ? "border-b-2 border-b-purple-700" : ""
              } cursor-pointer pb-2 font-bold text-sm xs:text-md px-2`}
            >
              Answered Questions
            </label>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-150px)]">
            {queState === "pending" ? (
              <PendingQuestions
                questionsUnanswered={questionsUnanswered}
                userId={userId}
                fetchQuestionsForUsers={fetchQuestionsForUsers}
              />
            ) : (
              <AnsweredQuestions
                questionsAnswered={questionsAnswered}
                userId={userId}
                fetchQuestionsForUsers={fetchQuestionsForUsers}
              />
            )}
          </div>
        </>
      ) : (
        <AdminAnswers />
      )}
    </div>
  );
};

export default withBasicAuth(Answers);
