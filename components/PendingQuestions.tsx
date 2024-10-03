"use client";
import { Question } from "@/db/dexie";
import { useQuizApp } from "@/hooks/useQuiz";
import { handleDateFormat } from "@/utils/handleDateFormat";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  questionsUnanswered: any;
  userId: string;
  fetchQuestionsForUsers: () => void;
}

const PendingQuestions = ({
  questionsUnanswered,
  userId,
  fetchQuestionsForUsers,
}: Props) => {
  const { db } = useQuizApp();
  const ansRef = useRef<HTMLTextAreaElement | null>(null);
  const [clickAns, setClickAns] = useState(false);
  const [clickedQue, setClickedQue] = useState<Question | null>(null);

  const handleClick = (que: Question) => {
    setClickAns(true);
    setClickedQue(que);
  };

  const handleSubmit = async () => {
    if (ansRef.current) {
      const data = {
        id: uuidv4(),
        userId,
        questionId: clickedQue?.questionId || "",
        answerList: [
          {
            answerId: uuidv4(),
            answer: ansRef.current.value,
            timestamp: new Date().toISOString(),
          },
        ],
      };

      await db.answeredQuestions.add(data);
      fetchQuestionsForUsers();
      setClickAns(false);
      setClickedQue(null);
    }
  };

  const handleCancel = () => {
    setClickedQue(null);
    setClickAns(false);
  };

  return (
    <div>
      <ul>
        {questionsUnanswered?.map((item: Question, index: number) => (
          <li
            key={index}
            className="grid grid-cols-6 items-center justify-between mb-3 shadow-md p-4 rounded-md"
          >
            <div className="col-span-5 pr-4">
              <div>
                <p className="font-semibold">{item.question}</p>
                <p className="text-sm italic">
                  {handleDateFormat(item.createdAt)}
                </p>
              </div>
              {clickAns && clickedQue?.questionId === item.questionId && (
                <div>
                  <textarea
                    ref={ansRef}
                    id="answer"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your thoughts here..."
                  ></textarea>
                  <div className="flex space-x-3 mt-2">
                    <button
                      className=" bg-purple-800 hover:bg-purple-700 px-3 py-2 rounded-md text-white"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                    <button
                      className=" bg-red-500 hover:bg-red-700 px-3 py-2 rounded-md text-white"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            {(!clickAns || clickedQue?.questionId !== item.questionId) && (
              <div className="col-span-1 flex justify-center">
                <button
                  className=" bg-purple-800 hover:bg-purple-700 px-3 py-2 rounded-md text-white"
                  onClick={() => handleClick(item)}
                >
                  Answer
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingQuestions;
