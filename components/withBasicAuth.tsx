"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

const withBasicAuth = (Component: React.ComponentType) => {
  return function ProtectedComponent(props: any) {
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      if (typeof window !== "undefined") {
        const isAuthenticated = localStorage.getItem("isAuthenticated");

        if (!isAuthenticated || isAuthenticated === "false") {
          router.push("/auth/signin");
        } else {
          setAuthenticated(true);
        }
      }
    }, [router]);

    if (!authenticated) {
      return <Loading />;
    }

    return <Component {...props} />;
  };
};

export default withBasicAuth;
