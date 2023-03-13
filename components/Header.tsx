import Image from "next/image";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <header className="flex justify-between w-full mt-0  pb-0 sm:px-2 px-2">
      <Link href="/" className="flex space-x-2 mx-4 my-2">
        <img
          alt="header text"
          src="/logo.png"
          className="w-[110px] h-[105px]"
        />
      </Link>
    </header>
  );
}

export default Header;
