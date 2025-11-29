"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const changeLanguageHandler = (nextLocal: string): void => {
    router.replace(`/${nextLocal}`);
  };

  return (
    <html lang="en">
      <body className="flex h-screen items-center justify-center bg-[#f0f0f0]">
        <div className="text-center">
          <h1 className="text-8xl text-[#333]">404</h1>
          <p className="text-4xl text-[#333]">
            Oops! The page you are looking for does not exist.
          </p>
          <button
            className="cursor-pointer rounded border-none bg-[#333] px-4 py-2 text-[#fff]"
            onClick={() => changeLanguageHandler("/")}
          >
            Go Back Home
          </button>
        </div>
      </body>
    </html>
  );
}
