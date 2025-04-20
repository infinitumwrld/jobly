"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image";
import { Button } from "@/app/components/ui/button"
import { Form } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import Link from "next/link";
import { toast, Toaster } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/authaction";

const authFormSchema = (type : FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(4) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(7),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  
  const router = useRouter();
  const formSchema = authFormSchema(type);

    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        if(type === 'sign-up') {
          const {name, email, password} = values
          
          const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

          const result = await signUp({
            uid: userCredentials.user.uid,
            name: name!,
            email,
            password
          })

          if (!result?.success) {
            toast.error(result?.message);
            return;
          }

          toast.success('Account created successfully. Please sign in.'); 
          router.push('/sing-in')
        } else {

          const {email, password} = values;
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const idToken = await userCredential.user.getIdToken();

          if (!idToken) {
            toast.error('Sign in failed')
            return;
          }

          await signIn({
            email, idToken
          })

          toast.success('Sign in successfully.'); 
          router.push('/#pricing')
        }
    } catch (error) {
        console.log(error);
        toast.error(`There was an error: ${error}`)
    }
  }

  const isSignIn = type === 'sign-in';

  return (
    <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.png" alt="logo" height={200} width={200} />

                </div>
                <h3 className="text-center mx-auto">Get interview-ready with the smartest AI <br/> built for landing tech jobs</h3>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                    {!isSignIn && (
                      <FormField 
                        control={form.control}
                        name='name'
                        label= 'Name'
                        placeholder='Your Name'
                      />  
                    )}
                    <FormField 
                        control={form.control}
                        name='email'
                        label= 'Email'
                        placeholder='Your email address'
                        type='email'
                      />  
                    <FormField 
                        control={form.control}
                        name='password'
                        label= 'Password'
                        placeholder='Enter your Password'
                        type='password'
                      />  
                    <Button className="btn" type="submit">{isSignIn ? "Sign in" : "Create an Account"}</Button>
                </form>
            </Form>

            <p className="text-center">
                {isSignIn ? 'No account yet? ' : 'Have an account already? '}
                <Link href={!isSignIn ? '/sing-in' : '/sing-up'} className="font-bold text-user-primary ml-1"> 
                    {!isSignIn ? "Sign In" : "Sign Up"}                
                </Link>
            </p>        
        </div>
    </div>
  )
}

export default AuthForm