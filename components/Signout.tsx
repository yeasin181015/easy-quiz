"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const noNavbarRoutes = ["/auth/signin", "/auth/signup", "/"];

const Signout = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Only run this on the client side
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(authStatus === "true");

      const userEmail = localStorage.getItem("email");
      const userRole = localStorage.getItem("role");
      userEmail && setEmail(userEmail);
      userRole && setRole(userRole);
    }
  }, [pathname]);

  const handleSignout = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", "false");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");

      router.push("/auth/signin");
    }
  };

  if (noNavbarRoutes.includes(pathname) || !isAuthenticated) {
    return null;
  }

  return (
    <div className="z-10 flex justify-between items-center top-0 sticky w-full py-3 bg-black rounded-md">
      <div className="w-full flex items-center justify-between px-3">
        <div className="flex justify-between w-[75%] xs:w-[65%] sm:w-[50%] text-white">
          <p>
            <span className="font-bold">Email: </span>
            {email}
          </p>
          <p>
            <span className="font-bold">Role: </span> {role}
          </p>
        </div>
        <button
          className="cursor-pointer bg-white hover:bg-slate-300 text-black px-4 py-2 rounded-md"
          onClick={handleSignout}
        >
          logout
        </button>
      </div>
    </div>
  );
};

export default Signout;
