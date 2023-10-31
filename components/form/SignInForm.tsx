'use client'

import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"

import { Button } from "../ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast"

const FormSchema = z.object({
    email: z.string().min(1, "Email is required").email('Invalid email'),
    password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters")
  })

const SignInForm = () => {
    const router = useRouter();
    const {toast} = useToast();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
          },
      })

      const onSubmit = async (values: z.infer<typeof FormSchema>) => {

        try {
            const signInData = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password,
                callbackUrl: '/',
            })

            if (signInData?.error)
            {
              toast({
                title: "Алдаа гарлаа",
                description: signInData.error,
                variant: 'destructive',
              })
            }else{
              router.refresh();
              router.push('/admin')
            }

            
        } catch (error) {
          toast({
            title: "Алдаа гарлаа",
            description: `${error}`,
            variant: 'destructive',
          })
        }

        // if (signInData?.error){
        //     console.log(signInData.error)
        // }else{
        //     router.push('/admin');
        // }
      }
      
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="mail@example.com"  {...field} />
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
                <Input placeholder="Enter you password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        
        <Button className="w-full mt-6" type="submit">Sign In</Button>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or
      </div>
      <p className="text-center text-sm text-gray-600 mt-2">
        if you don&apos;t have an account, please .
        <Link className="text-blue-500 hover:underline" href='/sign-up'>Sign up</Link>
      </p>
    </Form>
  )
}

export default SignInForm