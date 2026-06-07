'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '../../schemas/authSchema' // اسکیمای متفاوت
import FormField from '../molecules/FormField'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>
  isPending: boolean
  serverError?: string | null
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isPending,
  serverError,
}) => {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  useEffect(() => {
    setFocus('name')
  }, [setFocus])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md p-6 rounded-lg shadow-xl"
    >
      <h2 className="text-2xl font-bold text-center text-slate-100 mb-4">
        Create Account
      </h2>

      {serverError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm text-center">
          {serverError}
        </div>
      )}

      <FormField label="Full Name" error={errors.name?.message}>
        <Input type="text" placeholder="John Doe" {...register('name')} />
      </FormField>

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

      <FormField
        label="Confirm Password"
        error={errors.confirmPassword?.message}
      >
        <Input
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
        />
      </FormField>

      <div className="pt-2">
        <Button type="submit" isLoading={isPending}>
          Get Started
        </Button>
      </div>
    </form>
  )
}
