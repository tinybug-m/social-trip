'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '../../schemas/authSchema'
import FormField from '../molecules/FormField'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  isPending: boolean
  serverError?: string | null
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isPending,
  serverError,
}) => {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    setFocus('email')
  }, [setFocus])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-center text-white-800 mb-4">
        Welcome Back
      </h2>

      {serverError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm text-center">
          {serverError}
        </div>
      )}

      <FormField label="Email Address" error={errors.email?.message}>
        <Input
          type="email"
          placeholder="you@example.com"
          {...register('email')}
        />
      </FormField>

      <FormField label="Password" error={errors.password?.message}>
        <Input
          type="password"
          placeholder="••••••••"
          {...register('password')}
        />
      </FormField>

      <div className="pt-2">
        <Button type="submit" isLoading={isPending}>
          Sign In
        </Button>
      </div>
    </form>
  )
}
