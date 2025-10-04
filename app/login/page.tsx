import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-tx-primary to-tx-secondary">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-white">
            <img className="h-20 w-auto mb-8" src="/transactx.svg" alt="TransactX Logo" />
            <h1 className="text-4xl font-bold mb-4 text-center">
              TransactX Admin
            </h1>
            <p className="text-xl text-center opacity-90 max-w-md">
              Monitor bank account transactions in real time, manage payments, and oversee financial operations
            </p>
            <div className="mt-8 flex items-center space-x-4 text-sm opacity-75">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Real-time Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Secure Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img className="h-12 w-auto mx-auto mb-4" src="/transactx.svg" alt="TransactX Logo" />
            <h1 className="text-2xl font-bold tx-text-primary">TransactX Admin</h1>
          </div>
          
          <LoginForm />
          
          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2024 TransactX. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
