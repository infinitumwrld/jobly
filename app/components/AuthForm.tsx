"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image";
import { Button } from "@/app/components/ui/button"
import { Form } from "@/app/components/ui/form"
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/authaction";
import { useCallback, useState } from "react";

type FormType = "sing-in" | "sing-up";

const authFormSchema = (type : FormType) => {
  return z.object({
    name: type === "sing-up" ? z.string().min(4) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(7),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // Debounced submit handler with proper loading state
  const handleSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if(type === 'sing-up') {
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
        router.push('/dashboard')
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`)
    } finally {
      setIsSubmitting(false);
    }
  }, [type, router, isSubmitting]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    handleSubmit(values);
  };

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();

      if (!idToken) {
        toast.error('Google sign in failed');
        return;
      }

      // Always try to create/update the user in our database
      const result = await signUp({
        uid: userCredential.user.uid,
        name: userCredential.user.displayName || 'Google User',
        email: userCredential.user.email!,
        password: '' // Google users don't need password
      });

      // Even if user exists (result.success is false), proceed with sign in
      if (!result?.success && !result?.message?.includes('already exists')) {
        toast.error(result?.message || 'Failed to save user data');
        return;
      }

      // Sign in the user
      const signInResult = await signIn({
        email: userCredential.user.email!,
        idToken
      });

      if (!signInResult?.success) {
        toast.error(signInResult?.message || 'Failed to sign in');
        return;
      }

      toast.success('Signed in successfully with Google');
      router.push('/dashboard');
    } catch (error: Error | unknown) {
      console.error('Google sign in error:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign in with Google');
      } else {
        toast.error('Failed to sign in with Google');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignIn = type === 'sing-in';

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl p-8 max-w-md w-full mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <Image src="/logo.png" alt="logo" width={150} height={150} className="mb-2" />
          <h2 className="text-xl font-medium text-center">
            Get interview-ready with the smartest AI<br />
            built for landing tech jobs
          </h2>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 px-4 py-3 rounded-full font-medium transition-colors cursor-pointer"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
        >
          <Image src="/google.svg" alt="Google" width={20} height={20} />
          Continue with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-[#666] bg-[#0A0A0A]/80 backdrop-blur-xl">OR CONTINUE WITH EMAIL</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isSignIn && (
              <FormField 
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />  
            )}
            <FormField 
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />  
            <FormField 
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your Password"
              type="password"
            />  
            <Button 
              className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 rounded-full font-medium transition-colors cursor-pointer" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Processing..." 
                : isSignIn 
                  ? "Sign in" 
                  : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-[#666]">
          {isSignIn ? 'No account yet? ' : 'Have an account already? '}
          <Link 
            href={!isSignIn ? '/sing-in' : '/sing-up'} 
            className="text-white hover:text-[#8b5cf6] transition-colors cursor-pointer"
          > 
            {!isSignIn ? "Sign In" : "Sign Up"}                
          </Link>
        </p>        
      </div>
    </div>
  )
}

export default AuthForm