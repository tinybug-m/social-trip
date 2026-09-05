'use client'

import { useState } from 'react'
import { LoginForm } from '@/src/components/organisms/LoginForm'
import { RegisterForm } from '@/src/components/organisms/RegisterForm'
import GoogleSignInButton from '@/src/components/atoms/GoogleSignInButton'
import { useHandleForm } from '@/src/hooks/useHandleForm'
import { signIn, signUp, signInWithGoogle } from '@/src/services/user/auth'

export default function AuthPage() {
  const [view, setView] = useState<'login' | 'register'>('login')
  const [googlePending, setGooglePending] = useState(false)
  const [googleError, setGoogleError] = useState<string | null>(null)

  const login = useHandleForm(signIn)
  const register = useHandleForm(signUp)

  const handleGoogleSignIn = async () => {
    setGoogleError(null)
    setGooglePending(true)
    try {
      await signInWithGoogle()
    } catch (e) {
      setGoogleError(
        e instanceof Error ? e.message : 'Could not connect to Google',
      )
      setGooglePending(false)
    }
  }

  return (
    <main className="min-h-dvh w-full bg-white flex flex-col justify-center items-center px-8 select-none">
      <div className="w-full max-w-sm text-center mb-6">
        <h1
          className="text-4xl italic text-[#262626] tracking-tight"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Mehrvila
        </h1>
      </div>

      <div className="w-full max-w-sm border border-[#dbdbdb] rounded-sm p-6">
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

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-[#dbdbdb]" />
          <span className="text-xs font-semibold text-neutral-400">OR</span>
          <div className="flex-1 h-px bg-[#dbdbdb]" />
        </div>

        {googleError && (
          <p className="text-sm text-red-500 text-center mb-3">{googleError}</p>
        )}

        <GoogleSignInButton
          onClick={handleGoogleSignIn}
          isLoading={googlePending}
        />
      </div>

      <div className="w-full max-w-sm border border-[#dbdbdb] rounded-sm mt-3 p-5 text-center">
        {view === 'login' ? (
          <p className="text-sm text-[#262626]">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setView('register')}
              className="text-blue-500 font-semibold hover:text-blue-600 focus:outline-none"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-sm text-[#262626]">
            Already have an account?{' '}
            <button
              onClick={() => setView('login')}
              className="text-blue-500 font-semibold hover:text-blue-600 focus:outline-none"
            >
              Log in
            </button>
          </p>
        )}
      </div>
    </main>
  )
}
