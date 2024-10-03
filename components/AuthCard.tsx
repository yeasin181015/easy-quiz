"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useState } from "react";
import {
  handlePasswordDecryption,
  handlePasswordEncryption,
} from "@/utils/handleEncryption";
import { useQuizApp } from "@/hooks/useQuiz";
import { v4 as uuidv4 } from "uuid";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(4, { message: "Password must contain at least 4 characters" }),
});

type FormFields = z.infer<typeof schema>;

interface Props {
  buttonText: string;
  header: string;
  auth: string;
}

const AuthCard = ({ buttonText, header, auth }: Props) => {
  const router = useRouter();
  const { db } = useQuizApp();

  const [role, setRole] = useState("user");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (auth === "signin") {
      const userInfo = await db.users.where("email").equals(data.email).first();
      if (userInfo) {
        const match = handlePasswordDecryption(
          data.password,
          userInfo.password
        );
        if (match) {
          const { role, userId, email } = userInfo;

          localStorage.setItem("role", role);
          localStorage.setItem("userId", userId);
          localStorage.setItem("email", email);
          localStorage.setItem("isAuthenticated", "true");

          if (role === "admin") {
            router.push("/questions");
          } else {
            router.push("/answers");
          }
        } else {
          toast("Invalid credentials!");
        }
      } else {
        toast("No such user exists!");
      }
    } else {
      const securedPassword = handlePasswordEncryption(data.password);

      const userInfo = {
        userId: uuidv4(),
        email: data.email,
        password: securedPassword,
        role,
      };

      const res = await db.users.add(userInfo);
      if (res) {
        toast("User created successfully!");
        router.push("/auth/signin");
      } else {
        toast("User couldn't be created!");
      }
    }
  };

  const handleRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
  };

  return (
    <div className="flex items-center h-screen">
      <div className="w-[70%] md:w-[55%] sm:w-[50%] lg:w-[40%] mx-auto">
        <h1 className="text-center font-bold text-2xl mb-3">{header}</h1>
        <form
          className="flex flex-col space-y-5 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          {auth === "signup" && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <input
                  id="admin-radio"
                  type="radio"
                  value="admin" // Set value for Admin
                  name="role-radio"
                  checked={role === "admin"}
                  onChange={handleRole}
                />
                <label
                  htmlFor="admin-radio"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Admin
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="user-radio"
                  type="radio"
                  value="user" // Set value for User
                  name="role-radio"
                  checked={role === "user"}
                  onChange={handleRole}
                />
                <label
                  htmlFor="user-radio"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  User
                </label>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email address
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="email"
            />
            {errors.email && (
              <div className="text-red-500">{errors.email.message}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="•••••••••"
            />
            {errors.password && (
              <div className="text-red-500">{errors.password.message}</div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white py-2.5 bg-[#301934] hover:bg-white hover:border hover:border-[#301934] hover:text-black font-medium rounded-lg text-sm text-center"
          >
            {isSubmitting ? "Submitting..." : buttonText}
          </button>
        </form>
        {auth === "signin" && (
          <p className="mt-2 text-sm italic text-center text-gray-500">
            Dont't have an account?{" "}
            <Link href="/auth/signup" className="underline">
              Sign up
            </Link>
          </p>
        )}

        {auth === "signup" && (
          <p className="mt-2 text-sm italic text-center text-gray-500">
            Already have an account?
            <Link href="/auth/signin" className="underline">
              {" "}
              Login
            </Link>
          </p>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default AuthCard;
