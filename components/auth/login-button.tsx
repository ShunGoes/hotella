"use client";

import { useRouter } from "next/navigation";

interface LoginBtnProps {
  children: React.ReactNode;
  mode: "modal" | "redirect";
  asChild?: boolean;
}

const LoginBtn = ({ children, mode = "redirect"}: LoginBtnProps) => {
    const router = useRouter()

  const onClick = () => {
    router.push("/auth/login")
  };
  if (mode === "modal") {
    return <span>TODO: do this later</span>;
  }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginBtn;
