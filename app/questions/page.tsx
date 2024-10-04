"use client";
import QuestionsList from "@/components/Questions";
import withAuth from "@/components/withAuth";
import { Question } from "@/db/dexie";
import { useQuizApp } from "@/hooks/useQuiz";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Questions = () => {
  const queRef = useRef<HTMLInputElement>(null);
  const [questions, setQuestions] = useState<Question[]>();
  const [showInput, setShowInput] = useState(false);

  const { db } = useQuizApp();

  const fetchQuestions = async () => {
    const questions = await db.questions.toArray();
    questions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setQuestions(questions);
  };

  const handleAddQuestion = async () => {
    setShowInput(true);
  };

  const handleSubmit = async () => {
    const time = new Date();
    if (queRef?.current?.value) {
      const data = {
        questionId: uuidv4(),
        question: queRef.current.value,
        createdAt: time.toISOString(),
        createdBy: "admin",
        updatedAt: time.toISOString(),
      };
      await db.questions.add(data);
      toast("Question created successfully!");
      queRef.current.value = "";
      await fetchQuestions();
      setShowInput(false);
    }
  };

  return (
    <div className="mt-10 flex flex-col space-y-8 items-center">
      <div className="flex flex-col space-y-3 items-center sm:flex-row sm:space-x-12 w-fit">
        {showInput && (
          <div>
            <input
              ref={queRef}
              type="text"
              className="outline-none border-b-2 border-b-gray-400"
            />
          </div>
        )}
        <div className="flex space-x-5">
          {!showInput ? (
            <button
              className="px-3 py-2 bg-purple-800 hover:bg-purple-600 rounded-md text-white"
              onClick={handleAddQuestion}
            >
              <span>Add Question</span>
            </button>
          ) : (
            <button
              className="px-3 py-2 bg-red-700 hover:bg-red-800 rounded-md text-white"
              onClick={handleSubmit}
            >
              <span>Submit</span>
            </button>
          )}
          <button
            className="px-3 py-2 bg-purple-800 rounded-md text-white"
            onClick={handleAddQuestion}
          >
            <Link href="/answers">View Answers</Link>
          </button>
        </div>
      </div>
      <QuestionsList
        fetchQuestions={fetchQuestions}
        questions={questions}
        setQuestions={setQuestions}
      />
      <ToastContainer />
    </div>
  );
};

export default withAuth(Questions, "admin");
