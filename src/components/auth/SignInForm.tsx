"use client";

import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import { Button } from "../ui/button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { ILoginForm } from "@/types/staffType";
import { login } from "@/actions/authAction";
import { showToast } from "../ui/showToast";
import { useRouter } from "@bprogress/next/app";
import { useUserStore } from "@/store/useAuthStore";
import Link from "next/link";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const setHydrated = useUserStore((state) => state.setHydrated);

  const { handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ILoginForm>({
    defaultValues: { username: "", password: "" },
  });

  useEffect(() => {
    // mark store as hydrated when loaded
    setHydrated(true);
  }, [setHydrated]);

  const handleLogin = async (data: ILoginForm) => {
    setLoginError(null);
    const result = await login(data);
    console.log('-->result', result)
    if(result.code === 'success') {
      const roles = result.data.body.roles as string [];
      setUser({
        accessToken: result.data.body.accessToken,
        refreshToken: result.data.body.refreshToken,
        roles: roles || ["STUDENT"],
        email: data.username,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
      });

      showToast({
        variant: "success-solid",
        message: 'Connexion réussie',
        description: `Bien venu dand votre espace Mr. ` + result.data.body.user.last_name,
        position: 'top-center',
      });

      if(roles.includes("STUDENT")) {
        router.push('/student');
      } else if(roles.includes("TEACHER")) {
        router.push('/teacher');
      } else {
        router.push('/admin');
      }
    } else {
      setLoginError(result.error);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">Sign In</h1>
        <p className="text-sm text-gray-500 mb-5">Enter your email and password to sign in!</p>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
          <div>
            <Label>Email <span className="text-error-500">*</span></Label>
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              }}
              render={({ field }) => (
                <Input {...field} placeholder="info@gmail.com" type="email" error={!!errors.username?.message} />
              )}
            />
          </div>

          <div>
            <Label>Password <span className="text-error-500">*</span></Label>
            <div className="relative">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                }}
                render={({ field }) => (
                  <Input {...field} type={showPassword ? "text" : "password"} placeholder="Enter your password" error={!!errors.password?.message} />
                )}
              />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                {showPassword ? <EyeIcon className="fill-gray-500" /> : <EyeCloseIcon className="fill-gray-500" />}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="text-theme-sm">Keep me logged in</span>
            </div>
            <Link href="/reset-password" className="text-brand-500 hover:text-brand-600 text-sm">Forgot password?</Link>
          </div>

          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

          <Button className="w-full" size="sm" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in"}</Button>
        </form>

        <p className="mt-5 text-sm text-center">
          Don&apos;t have an account? <Link href="/signup" className="text-brand-500 hover:text-brand-600">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
