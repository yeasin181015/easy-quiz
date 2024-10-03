"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "./Loading";

const withAuth = (Component: React.ComponentType, requiredRole?: string) => {
  return function ProtectedComponent(props: any) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const isAuthenticated = localStorage.getItem("isAuthenticated");
        const role = localStorage.getItem("role");

        if (!isAuthenticated || isAuthenticated === "false") {
          router.push("/auth/signin");
          return;
        }
        if (requiredRole && role !== requiredRole) {
          router.push("/unauthorized");
          return;
        }
        setIsAuthorized(true);
      }
    }, [router]);

    if (!isAuthorized) {
      return <Loading />;
    }

    return <Component {...props} />;
  };
};

export default withAuth;
