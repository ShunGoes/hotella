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
    <main className="h-full flex flex-col items-center justify-center ">
      <div className="space-y-6 text-center mb-4">
        <h1
          className={cn(
            "text-6xl font-semibold text-black drop-shadow-md",
            font.className
          )}
        >
          My Nanny
        </h1>
        <p className="text-black text-lg">Connect to nannies in your locale</p>
      </div>
      <LoginBtn mode="redirect">
        <Button variant="secondary" size="lg">
          Sign in
        </Button>
      </LoginBtn>
    </main>
  );
}
