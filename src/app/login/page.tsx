'use client'

import { useState } from 'react'
import { LoginForm } from '@/src/components/organisms/LoginForm'
import { RegisterForm } from '@/src/components/organisms/RegisterForm'
import { useRouter } from 'next/navigation'
import { LoginFormData, RegisterFormData } from '@/src/schemas/authSchema'
import { useFormSubmit } from '@/src/lib/useFormHandler'
import { signIn, signUp } from '@/src/services/user/auth'

export default function AuthPage() {
  const router = useRouter()
  const [view, setView] = useState<'login' | 'register'>('login')

  const [serverError, setServerError] = useState<string | null>(null)

  const { createSubmitHandler, isSubmitting } = useFormSubmit({
    onSuccess: () => {
      router.push('/')
      router.refresh()
    },
    onError: (error) => {
      alert(error)
      setServerError(error.message)
    },
  })

  const handleLoginSubmit = createSubmitHandler(async (data: LoginFormData) => {
    setServerError(null)
    return await signIn(data)
  })

  const handleRegisterSubmit = createSubmitHandler(
    async (data: RegisterFormData) => {
      setServerError(null)
      return await signUp(data)
    },
  )

  return (
    <main className="min-h-screen w-full bg-slate-900 flex flex-col justify-center items-center px-4 select-none">
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          TinySocial
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          {view === 'login'
            ? 'Welcome back, traveler!'
            : 'Start your journey with us'}
        </p>
      </div>

      <div className="w-full max-w-md bg-slate-800/40 border border-slate-700/60 rounded-2xl shadow-2xl backdrop-blur-md p-6">
        <div className="transition-all duration-200">
          {view === 'login' ? (
            <LoginForm
              onSubmit={handleLoginSubmit}
              isPending={isSubmitting}
              serverError={serverError}
            />
          ) : (
            <RegisterForm
              onSubmit={handleRegisterSubmit}
              isPending={isSubmitting}
              serverError={serverError}
            />
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
          {view === 'login' ? (
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setView('register')
                  setServerError(null)
                }}
                className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors focus:outline-none"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setView('login')
                  setServerError(null)
                }}
                className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors focus:outline-none"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
