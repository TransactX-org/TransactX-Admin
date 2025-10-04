import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <img className="h-12 w-auto mx-auto mb-4" src="/transactx.svg" alt="TransactX Logo" />
          <h1 className="text-3xl font-bold tx-text-primary mb-2">TransactX</h1>
          <p className="text-muted-foreground">Admin Dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
