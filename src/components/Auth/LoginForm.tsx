import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const LoginForm = ({ onLogin }: { onLogin: (authenticated: boolean) => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      onLogin(true);
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-card rounded-2xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
        <Input
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="w-full" type="submit">
          Entrar
        </Button>
      </form>
    </div>
  );
};
