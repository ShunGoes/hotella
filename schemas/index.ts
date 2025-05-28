import * as z from 'zod';


export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(1, {
    message: "Password is required"
  })
})

export const RegisterSChema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(6, {
    message: "Minimum of 6 characters is required"
  }),
  name: z.string().min(1, {
    message: "Name is required"
  })
})