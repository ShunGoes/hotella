"use client";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
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

import { LoginSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { loginAction } from "@/actions/login";
import { useRouter } from "next/navigation";

interface FormSTateProps {
  success: string;
  error: string;
}

const LoginForm = () => {
  const [formState, setFormState] = useState<FormSTateProps>({
    success: "",
    error: "",
  });
  const [isPending, startTransaction] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setFormState({
      success: "",
      error: "",
    });

    // console.log(values)
    startTransaction(async () => {
      const response = await loginAction(values);

      console.log(response);
      if (!response?.success) {
        setFormState((prevState) => {
          return {
            ...prevState,
            error: response?.error ?? "",
          };
        });
        return;
      }

      console.log("successfully logged in ");
      setFormState((prevState) => {
        return {
          ...prevState,
          success: response?.success ?? "",
        };
      });

      router.push("/settings");
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={formState.error} />
        <FormSuccess message={formState.success} />
        <Button className="w-full" type="submit">
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
