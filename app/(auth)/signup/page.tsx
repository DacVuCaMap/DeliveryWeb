import SignUpForm from "@/components/temp/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp Page",
  description: "This is Next.js",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
