"use client";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";
import { useUserStore } from "../state/user-state";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "@/firebase/auth";
import { FirebaseError } from "firebase/app";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          try {
            await signIn(data.email, data.password);
          } catch (err: any) {
            if (err.code == "auth/user-not-found") {
              form.setError("root", {
                type: "manual",
                message: "User not found, Please Sign Up",
              });
            } else if (err.code == "auth/wrong-password") {
              form.setError("root", {
                message: "Wrong password",
              });
            } else {
              form.setError("root", {
                message: err.message.replace("Firebase", ""),
              });
            }
          }
        })}
        className="space-y-3 mt-4 w-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} className="" />
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
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          // className="w-full rounded-md bg-clique border-black border-2 hover:bg-clique-dark py-6 px-4 text-base text-black text-left flex justify-between"
          className="w-full"
        >
          Sign In
        </Button>
        {/* <p className="text-sm font-medium text-destructive">

        </p> */}
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
      </form>
    </Form>
  );
}
