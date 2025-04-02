
import SignInForm from "@/components/temp/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn Page",
  description: "This is Next.js ",
};

export default function SignIn() {
  return <SignInForm />;
}
