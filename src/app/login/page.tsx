import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Sign In</h1>
      <LoginForm />
    </div>
  );
}
