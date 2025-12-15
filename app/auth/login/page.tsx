"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent, TabsList } from "@radix-ui/react-tabs";
import SignUpTab from "./_components/sign-up-tab";
import SignInTab from "./_components/sign-in-tab";
import { Separator } from "@/components/ui/separator";
import SocialAuthButtons from "./_components/social-auth-buttons";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/router";

export default function loginPage() {
  const router = useRouter();
  useEffect(() => {
    // this use effect is used to redirect the logged inuser to another page ,else the logged in user can still visit the sign in page
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/");
    });
  }, [router]);
  return (
    <Tabs defaultValue="signin" className="max-auto w-full my-6 px-4">
      <TabsList>
        <TabsTrigger value="signin">Sign In </TabsTrigger>
        <TabsTrigger value="signup">Sign Up </TabsTrigger>
      </TabsList>

      <TabsContent value="signin">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInTab></SignInTab>
          </CardContent>
          <Separator />
          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons></SocialAuthButtons>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpTab></SignUpTab>
          </CardContent>
          <Separator />
          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons></SocialAuthButtons>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
