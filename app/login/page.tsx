import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-tx-primary/90 via-tx-secondary/80 to-tx-primary/90"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-12 text-white">
            <img className="h-20 w-auto mb-8" src="/transactx.svg" alt="TransactX Logo" />
            <p className="text-xl text-center opacity-90 max-w-md mb-8">
              Monitor bank account transactions in real time, manage payments, and oversee financial operations
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-sm">Real-time</h3>
                <p className="text-xs opacity-75">Live monitoring</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-sm">Secure</h3>
                <p className="text-xs opacity-75">Bank-grade security</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-sm">Analytics</h3>
                <p className="text-xs opacity-75">Smart insights</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-sm">24/7</h3>
                <p className="text-xs opacity-75">Always available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="w-full max-w-md lg:max-w-2xl mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6 sm:mb-8">
            <img className="h-10 sm:h-12 w-auto mx-auto mb-3 sm:mb-4" src="/transactx.svg" alt="TransactX Logo" />
          </div>
          
          <LoginForm />
          
          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
            <p>© 2025 TransactX. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
