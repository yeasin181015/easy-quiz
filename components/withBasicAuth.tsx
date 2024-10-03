"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

const withBasicAuth = (Component: React.ComponentType) => {
  return function ProtectedComponent(props: any) {
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (!isAuthenticated) {
        router.push("/auth/signin");
        return;
      }

      setAuthenticated(true);
    }, [router]);

    if (!authenticated) {
      return <Loading />;
    }

    return <Component {...props} />;
  };
};

export default withBasicAuth;
