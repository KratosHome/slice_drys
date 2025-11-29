"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const LogOut = () => {
  return (
    <div>
      <Button onClick={() => signOut()}>Вийтиt</Button>
    </div>
  );
};

export default LogOut;
