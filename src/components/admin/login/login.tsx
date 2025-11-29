"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Помилка",
        description: "Логін або пароль невірні",
      });
    } else {
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="mt-12 flex w-[200px] flex-col gap-4">
        <h1 className="text-center">Увійти</h1>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Увійти</Button>
      </div>
    </div>
  );
}
