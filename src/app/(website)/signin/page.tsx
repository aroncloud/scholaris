import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "EPFPS",
  description: "School managementr system",
};

export default function SignIn() {
  return <SignInForm />;
}
