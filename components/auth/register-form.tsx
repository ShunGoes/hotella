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

import { RegisterSChema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import { registerAction } from "@/actions/register";

interface FormSTateProps {
  success: string;
  error: string;
}

const RegisterForm = () => {
  const [formState, setFormState] = useState<FormSTateProps>({
    success: "",
    error: "",
  });
  const [isPending, startTransaction] = useTransition();

  const form = useForm<z.infer<typeof RegisterSChema>>({
    resolver: zodResolver(RegisterSChema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSChema>) => {
    setFormState({
        success: "", error: ""
    })
    
    // console.log(values)
    startTransaction(async () => {
      const response = await registerAction(values);
      setFormState((prevState) => {
        return {
          ...prevState,
          success: response.success ?? "",
          error: response.error ?? "",
        };
      });
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder="John Doe"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          Create an account
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
