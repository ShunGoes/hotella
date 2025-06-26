"use client";
import { useForm } from "react-hook-form";
import { startTransition, useState, useTransition } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/zod-schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../form-error";
import FormSuccess from "../form-success";
// import { loginAction } from "@/actions/login";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransaction] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with another provider" : ""

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const data = await loginAction(values);
      setError(data.error);
      setSuccess(data.success);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="johndoe@example.com"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="xxxxxx"
                    type="password"
                  />
                </FormControl>
                <Button size="sm" variant="link" asChild className="px-0  font-normal">
                  <Link className=" " href="/auth/reset">
                  Forgot Password
                  </Link>
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error || orlError} />
        <FormSuccess message={success} />
        <Button className="w-full" type="submit">
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
