"use client";
import { Answers, Question } from "@/db/dexie";
import { useQuizApp } from "@/hooks/useQuiz";
import CollpaseUp from "@/icons/CollapseUp";
import DownArrow from "@/icons/DownArrow";
import Edit from "@/icons/Edit";
import { handleDateFormat } from "@/utils/handleDateFormat";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  questionsAnswered: any;
  userId: string;
  fetchQuestionsForUsers: () => void;
}

type AnsQues = {
  userId: string;
  question: string;
  questionId: string;
  id: string;
  createdAt: string;
  answerList: Answers[];
};

const AnsweredQuestions = ({
  questionsAnswered,
  userId,
  fetchQuestionsForUsers,
}: Props) => {
  const { db } = useQuizApp();
  const ansRef = useRef<HTMLTextAreaElement | null>(null);
  const [clickAns, setClickAns] = useState(false);
  const [clickedQue, setClickedQue] = useState<AnsQues | null>(null);
  const [edit, setEdit] = useState(false);

  const handleClick = (que: AnsQues) => {
    setClickAns(true);
    setClickedQue(que);
  };

  const handleSubmit = async (item: AnsQues) => {
    if (ansRef.current) {
      const list = [...item.answerList];

      list.unshift({
        answerId: uuidv4(),
        answer: ansRef.current.value,
        timestamp: new Date().toISOString(),
      });

      const data = {
        answerList: list,
      };

      await db.answeredQuestions.update(item.id, data);
      fetchQuestionsForUsers();
      setEdit(false);
    }
  };

  const handleCancel = () => {
    setEdit(false);
  };

  const handleEdit = (ans: any) => {
    setEdit(true);
  };

  return (
    <div>
      <ul>
        {questionsAnswered?.map((item: any) => (
          <li
            key={item.questionId}
            className={`${
              clickAns
                ? "flex flex-col space-y-3"
                : "flex flex-col space-y-2 xs:space-y-0 xs:flex-row justify-between items-center"
            } mb-3 shadow-md p-4 rounded-md border border-black`}
          >
            <div className="flex justify-between items-center pr-4">
              <div>
                <p className="font-semibold">{item.question}</p>
                <p className="text-sm">
                  Posted on: {handleDateFormat(item.createdAt)}
                </p>
              </div>
              {(clickAns || clickedQue?.questionId === item.questionId) && (
                <div
                  className="col-span-1 cursor-pointer w-fit"
                  onClick={() => {
                    setClickAns(false);
                    setClickedQue(null);
                  }}
                >
                  <CollpaseUp />
                </div>
              )}
            </div>

            {(!clickAns || clickedQue?.questionId !== item.questionId) && (
              <div>
                <button
                  className="bg-purple-800 hover:bg-purple-700 px-3 py-2 rounded-md text-white"
                  onClick={() => handleClick(item)}
                >
                  <span className="text-sm whitespace-nowrap">
                    View Answers
                  </span>{" "}
                </button>
              </div>
            )}
            {clickAns && clickedQue?.questionId === item.questionId && (
              <div>
                <ul>
                  {clickedQue?.answerList?.map(
                    (ans: Answers, index: number) => (
                      <li className="flex flex-col space-y-3 shadow-md rounded-md p-3 mb-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p>{ans.answer}</p>
                            <p>
                              Answered on: {handleDateFormat(ans.timestamp)}
                            </p>
                          </div>
                          {index === 0 && (
                            <div
                              className="w-fit cursor-pointer"
                              onClick={() => handleEdit(ans)}
                            >
                              <Edit />
                            </div>
                          )}
                        </div>
                        {edit && index === 0 && (
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
                                onClick={() => handleSubmit(item)}
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
                      </li>
                    )
                  )}
                </ul>

                {/* <button
                className="flex items-center mt-3 space-x-2 bg-purple-800 hover:bg-purple-700 px-3 py-2 rounded-md text-white"
                onClick={() => setClickAns(false)}
              >
                <span>Collapse</span>
              </button> */}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default AnsweredQuestions;
