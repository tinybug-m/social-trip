'use client'

import { useState } from 'react'
import { LoginForm } from '@/src/components/organisms/LoginForm'
import { RegisterForm } from '@/src/components/organisms/RegisterForm'
import { useHandleForm } from '@/src/hooks/useHandleForm'
import { signIn, signUp } from '@/src/services/user/auth'

export default function AuthPage() {
  const [view, setView] = useState<'login' | 'register'>('login')

  const login = useHandleForm(signIn)
  const register = useHandleForm(signUp)

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
              onSubmit={login.submit}
              isPending={login.pending}
              serverError={login.error}
            />
          ) : (
            <RegisterForm
              onSubmit={register.submit}
              isPending={register.pending}
              serverError={register.error}
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
