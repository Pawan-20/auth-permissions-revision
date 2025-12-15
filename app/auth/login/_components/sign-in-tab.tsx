"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Zod schema
const signUpSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must contain atleast 6 characters"),
});

// Infer TypeScript type from schema
type SignUpForm = z.infer<typeof signUpSchema>;

function SignInTab() {
  const router = useRouter();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;
  async function handleSignIn(data: SignUpForm) {
    // we can handle this either via a server action or you can do this on the client as well.
    // Better auth provides both ways of doing it.

    const res = await authClient.signIn.email(
      { ...data, callbackURL: "/" }, // callbackURL is where you want to redirect the user
      {
        onError: (error) => {
          console.log(error, "error");
          toast.error(error.error.message || "Failed to sign In");
        },
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  }
  useEffect(() => {
    console.log("form object:", form);
  }, [form]);
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your email"></Input>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          )}
        ></FormField>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password </FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="Your password"
                ></PasswordInput>
              </FormControl>
              <FormMessage></FormMessage>
            </FormItem>
          )}
        ></FormField>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          <LoadingSwap isLoading={isSubmitting}>Sign In</LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}

export default SignInTab;
