"use client";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role");

      if (role === "admin") {
        router.push("/questions");
      } else if (role === "user") {
        router.push("/answers");
      } else {
        router.push("/auth/signin");
      }
    }
  }, [router]);

  return <Loading />;
}
