import { useState, useCallback, useRef, useEffect } from 'react'

interface UseFormOptions {
  onSuccess?: () => void
  onError?: (error: { message: string }) => void
}

export const useFormSubmit = <TData = any>(options?: UseFormOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)
  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const createSubmitHandler = useCallback(
    (action: (data: TData) => Promise<unknown> | unknown) => {
      return async (data: TData) => {
        if (isSubmittingRef.current) return

        isSubmittingRef.current = true
        setIsSubmitting(true)

        try {
          await action(data)
          optionsRef.current?.onSuccess?.()
        } catch (error: any) {
          console.log(error)
          if (optionsRef.current?.onError) {
            optionsRef.current.onError(error)
          } else {
            console.error(error)
          }
        } finally {
          isSubmittingRef.current = false
          setIsSubmitting(false)
        }
      }
    },
    [],
  )

  return { createSubmitHandler, isSubmitting }
}
