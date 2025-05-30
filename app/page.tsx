import LoginBtn from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  weight: ["600"],
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className="h-full flex flex-col items-center justify-center bg-sky-500">
      <div className="space-y-2 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className
          )}
        >
          Auth
        </h1>
        <p className="text-white text-lg">A simple authentication service</p>
      </div>
      <LoginBtn mode="redirect">
        <Button variant="secondary" size="lg">
          Sign in
        </Button>
      </LoginBtn>
    </main>
  );
}
