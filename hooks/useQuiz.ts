import { EasyQuizContext } from "@/contexts/dbContext";
import { useContext } from "react";

export const useQuizApp = () => {
  const context = useContext(EasyQuizContext);
  if (!context) {
    throw new Error("useQuizApp must be used within a EasyQuizProvider");
  }
  return context;
};
