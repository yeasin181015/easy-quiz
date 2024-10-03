import Dexie from "dexie";

export class EasyQuizDB extends Dexie {
  users: Dexie.Table<User, string>;
  questions: Dexie.Table<Question, string>;
  answeredQuestions: Dexie.Table<AnsweredQuestions, string>;

  constructor() {
    super("EasyQuizDB");
    this.version(11).stores({
      users: "userId, email",
      questions: "questionId",
      answeredQuestions: "id, userId",
    });

    this.users = this.table("users");
    this.questions = this.table("questions");
    this.answeredQuestions = this.table("answeredQuestions");
  }
}

export interface User {
  userId: string;
  email: string;
  password: string;
  role: string;
}

export interface Question {
  questionId: string;
  question: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnsweredQuestions {
  id: string;
  userId: string;
  questionId: string;
  answerList: Answers[];
}

export interface Answers {
  answerId: string;
  answer: string;
  timestamp: string;
}
