"use client";

import Image from "next/image";

import { Button } from "@/frontend/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function Auth() {
  const [loading, setLoading] = useState(false);
  const handleSignIn = async () => {
    setLoading(true);
    try {
      const sm = await signIn("google");
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div className="h-full w-full bg-muted/75 lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-4">
            <Button
              variant="default"
              className="w-full"
              loading={loading}
              onClick={handleSignIn}
            >
              Login with Google
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/banner.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
