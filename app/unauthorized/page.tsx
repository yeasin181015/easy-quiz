"use client";

import Image from "next/image";
import Error from "../../images/unauthorized.jpg";
import Link from "next/link";

const UnAuthorized = () => {
  return (
    <div className="flex flex-col items-center">
      <Image src={Error} alt="" />
      <p className="text-center italic">
        Only Admin have access to this page. Sorry!
      </p>
      <Link href="/answers" className="underline italic text-blue-800">
        Go back
      </Link>
    </div>
  );
};

export default UnAuthorized;
