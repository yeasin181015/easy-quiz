"use client";
import { EasyQuizDB } from "@/db/dexie";
import React, { createContext, useEffect } from "react";

interface EasyQuizContextProps {
  db: EasyQuizDB;
}

export const EasyQuizContext = createContext<EasyQuizContextProps | undefined>(
  undefined
);

export const EasyQuizProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: any) => {
  const db = new EasyQuizDB();

  useEffect(() => {}, [db]);

  return (
    <EasyQuizContext.Provider value={{ db }}>
      {children}
    </EasyQuizContext.Provider>
  );
};
