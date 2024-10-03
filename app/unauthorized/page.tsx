"use client";

import Image from "next/image";
import Error from "../../images/unauthorized.jpg";
import Link from "next/link";

const UnAuthorized = () => {
  return (
    <div className="flex flex-col items-center">
      <Image src={Error} alt="" />
      <p className="text-center">
        You have been logged out due to an attempt to access a restricted page.
      </p>

      <Link href="/answers" className="text-blue-800 underline italic text-sm">
        Please login again!
      </Link>
    </div>
  );
};

export default UnAuthorized;
