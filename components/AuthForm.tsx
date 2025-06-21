"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.actions";
import FormField from "./FormField";
import { useEffect, useState } from "react";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

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
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      if (type === "sign-up") {
        const { name, email, password } = data;

        // Create Firebase auth account
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        ).catch(error => {
          console.error("Firebase client auth error:", error);
          throw new Error(`Registration failed: ${error.message || error.code}`);
        });

        // Save user data to Firestore
        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        // Auto sign-in after registration
        const idToken = await userCredential.user.getIdToken(true);
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        const signInResult = await signIn({
          email,
          idToken,
        });
        
        if (!signInResult || !signInResult.success) {
          toast.success("Account created, but couldn't sign in automatically. Please sign in.");
          console.log("Redirecting to sign-in page after sign-up");
          router.push("/sign-in");
          return;
        }
        
        toast.success("Account created and signed in successfully!");
        console.log("Redirecting to home page after successful signup");
        // Use window.location.href for a full page refresh
        window.location.href = "/";
      } else {
        const { email, password } = data;

        // Sign in with Firebase auth
        console.log("Attempting to sign in with Firebase client auth. Project ID:", auth.app.options.projectId);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        ).catch(error => {
          console.error("Firebase client auth error:", error);
          throw new Error(`Sign in failed: ${error.message || error.code}`);
        });

        console.log("Firebase auth successful, getting ID token. User UID:", userCredential.user.uid);
        // Get fresh ID token with force refresh to ensure it's current
        const idToken = await userCredential.user.getIdToken(true);
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }
        
        console.log("ID token obtained successfully (first 10 chars):", idToken.substring(0, 10) + "...");

        // Set session cookie on server
        const result = await signIn({
          email,
          idToken,
        });
        
        if (!result || !result.success) {
          toast.error(result?.message || "Sign in Failed. Please try again.");
          return;
        }
        
        toast.success("Signed in successfully.");
        console.log("Redirecting to home page after sign-in");
        // Use window.location.href for a full page refresh
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(`Authentication failed: ${error.message || "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
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
              placeholder="Enter your password"
              type="password"
            />

            <Button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? `${isSignIn ? "Signing In" : "Creating Account"}...` 
                : isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;