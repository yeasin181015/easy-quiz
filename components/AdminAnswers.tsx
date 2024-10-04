"use client";

import { Answers } from "@/db/dexie";
import { useQuizApp } from "@/hooks/useQuiz";
import { handleDateFormat } from "@/utils/handleDateFormat";
import { useEffect, useState } from "react";
import Empty from "../images/noitems.png";
import Image from "next/image";
import Link from "next/link";

const AdminAnswers = () => {
  const { db } = useQuizApp();

  const [allAnswers, setAllAnsers] = useState<Array<any>>([]);

  const fetchAllAnswers = async () => {
    const users = await db.users.toArray();
    const allAnswers = await db.answeredQuestions.toArray();
    const allQuestions = await db.questions.toArray();

    const groupedAnswers = allAnswers.reduce((acc, curr) => {
      const { questionId, userId, answerList } = curr;

      if (!acc[questionId]) {
        acc[questionId] = [];
      }

      const email = users.find((user) => user.userId === userId)?.email || "";

      acc[questionId].push({ userId, email, answers: answerList });

      return acc;
    }, {} as { [key: string]: { userId: string; email: string; answers: Answers[] }[] });

    const combinedResult = allQuestions.map((question) => {
      return {
        ...question,
        answerDetails: groupedAnswers[question.questionId] || [],
      };
    });

    setAllAnsers(combinedResult);
  };

  useEffect(() => {
    fetchAllAnswers();
  }, [db]);

  return (
    <div className="w-full xs:w-[80%] md:w-[70%] mx-auto">
      {allAnswers.length > 0 ? (
        allAnswers?.map((item, index) => (
          <div key={index} className="p-3 shadow-md rounded-md mb-3">
            <div>
              <h2 className="font-semibold text-md">{item?.question}</h2>
              <p className="text-sm italic">
                Posted on: {handleDateFormat(item.createdAt)}
              </p>
              {item?.answerDetails?.length === 0 && (
                <p className="text-red-600 italic text-sm">No Answers Yet!</p>
              )}
            </div>
            {item?.answerDetails?.length > 0 && (
              <ul className="ml-3 shadow-md rounded-md p-3 ">
                {item?.answerDetails?.map((ans: any, index: number) => (
                  <li
                    key={index}
                    className="shadow-md rounded p-3 mb-2 bg-gray-100"
                  >
                    <p>
                      Answered by:{" "}
                      <span className="font-semibold italic text-sm">
                        {ans.email}
                      </span>
                    </p>
                    <ul className="ml-3">
                      {ans?.answers?.map((temp: any, index: number) => (
                        <li
                          key={index}
                          className="shadow-md rounded-md p-2 mb-2 bg-gray-200"
                        >
                          <p>Answer: {temp.answer}</p>
                          <p className="text-sm italic">
                            Answered on: {handleDateFormat(temp.timestamp)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <div className="w-full flex justify-center">
          <Image src={Empty} alt="" />
        </div>
      )}
      <div className="flex justify-center">
        <button className="px-3 py-2 bg-purple-800 hover:bg-purple-600 rounded-md text-white">
          <Link href="/questions">Go back</Link>
        </button>
      </div>
    </div>
  );
};

export default AdminAnswers;
