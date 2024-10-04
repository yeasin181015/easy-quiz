"use client";
import { useQuizApp } from "@/hooks/useQuiz";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";

interface Props {
  modalIsOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  header: string;
  question: any;
}

const getModalWidth = () => {
  if (window.innerWidth >= 1280) {
    return "40%";
  } else if (window.innerWidth >= 1024) {
    return "50%";
  } else if (window.innerWidth >= 768) {
    return "70%";
  } else {
    return "90%";
  }
};

const EditModal = ({
  modalIsOpen,
  openModal,
  closeModal,
  header,
  question,
}: Props) => {
  const queRef = useRef<HTMLInputElement>(null);
  const { db } = useQuizApp();

  const [modalWidth, setModalWidth] = useState(getModalWidth());

  useEffect(() => {
    const handleResize = () => {
      setModalWidth(getModalWidth());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const editQuestion = async () => {
    if (queRef.current) {
      const data = {
        question: queRef.current.value,
        updatedAt: new Date().toISOString(),
      };

      await db.questions.update(question.questionId, data);
      closeModal();
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: modalWidth,
    },
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h2 className="text-center font-bold text-xl">{header}</h2>
        <div className="h-[80%] flex flex-col justify-center items-center space-y-5">
          <input
            ref={queRef}
            type="text"
            className="w-[50%] outline-none border-b-2 border-b-gray-400"
            defaultValue={question?.question}
          />
          <div className="flex space-x-3">
            <button
              className="flex  items-center  space-x-1 bg-purple-800 hover:bg-purple-700 px-3 py-2 rounded-md text-sm text-white"
              onClick={editQuestion}
            >
              Submit
            </button>
            <button
              onClick={closeModal}
              className="flex  items-center  space-x-1 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm text-white"
            >
              close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditModal;
