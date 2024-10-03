"use client";

import { useQuizApp } from "@/hooks/useQuiz";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Question } from "@/db/dexie";
import { handleDateFormat } from "@/utils/handleDateFormat";
import RightArrow from "@/icons/RightArrow";
import Delete from "@/icons/Delete";
import Edit from "@/icons/Edit";
import EditModal from "./EditModal";
import { useRouter } from "next/navigation";

interface Props {
  fetchQuestions: () => void;
  questions: any;
  setQuestions: Dispatch<SetStateAction<Question[] | undefined>>;
}

const QuestionsList = ({ fetchQuestions, questions, setQuestions }: Props) => {
  const { db } = useQuizApp();

  const router = useRouter();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<any>(null);

  useEffect(() => {
    fetchQuestions();
  }, [db]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    fetchQuestions();
    setEditQuestion(null);
    setIsOpen(false);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    await db.questions.delete(questionId);
    fetchQuestions();
  };

  const handleEditQuestion = (question: any) => {
    setEditQuestion(question);
    openModal();
  };

  const handleViewAnswer = (questionId: string) => {
    router.push(`/answers/${questionId}`);
  };

  return (
    <div className="w-[85%] sm:w-[70%]">
      <div className="w-full flex flex-col space-y-6 rounded-md">
        {questions?.map((que: any) => (
          <div className="flex flex-col space-y-2 xs:flex-row justify-between items-center p-4 shadow-md">
            <div>
              <p className="font-semibold text-md">{que.question}</p>
              <p className="text-sm italic">
                Posted on: {handleDateFormat(que.createdAt)}
              </p>
            </div>
            <div className="flex space-x-7 items-center">
              {/* <button
                className="flex  items-center  space-x-1 bg-purple-800 hover:bg-purple-700 px-3 py-2 rounded-md text-sm text-white"
                onClick={() => handleViewAnswer(que.questionId)}
              >
                <span>Answers</span> <RightArrow />
              </button> */}
              <div
                className="w-fit cursor-pointer"
                onClick={() => handleDeleteQuestion(que.questionId)}
              >
                <Delete />
              </div>
              <div
                className="w-fit cursor-pointer"
                onClick={() => handleEditQuestion(que)}
              >
                <Edit />
              </div>
            </div>
          </div>
        ))}
      </div>
      <EditModal
        modalIsOpen={modalIsOpen}
        openModal={openModal}
        closeModal={closeModal}
        header="Edit Question"
        question={editQuestion}
      />
    </div>
  );
};

export default QuestionsList;
