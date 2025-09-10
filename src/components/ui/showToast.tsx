'use client'

import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export type ToastVariant =
  | 'success'
  | 'success-solid'
  | 'error'
  | 'error-solid'
  | 'info'
  | 'info-solid'
  | 'warning'
  | 'warning-solid'
  | 'default'
  | 'default-solid'

export interface GenericToastOptions {
  variant?: ToastVariant
  message: string | React.ReactNode
  description?: string
  avatar?: { src: string; fallback?: string; alt?: string }
  closeButton?: boolean
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  promise?: () => Promise<unknown>
  style?: React.CSSProperties
}

const toastStyles: Record<ToastVariant, React.CSSProperties> = {
  'success': {
    background: 'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
    color: 'light-dark(var(--color-green-600), var(--color-green-400))',
    border: '1px solid light-dark(var(--color-green-600), var(--color-green-400))',
  },
  'success-solid': {
    background: 'light-dark(var(--color-green-600), var(--color-green-400))',
    color: 'var(--color-white)',
    border: '1px solid light-dark(var(--color-green-600), var(--color-green-400))',
  },
  'error': {
    background: 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
    color: 'var(--destructive)',
    border: '1px solid var(--destructive)',
  },
  'error-solid': {
    background: 'light-dark(var(--destructive), color-mix(in oklab, var(--destructive) 60%, var(--background)))',
    color: 'var(--color-white)',
    border: 'transparent',
  },
  'info': {
    background: 'color-mix(in oklab, light-dark(var(--color-sky-600), var(--color-sky-400)) 10%, var(--background))',
    color: 'light-dark(var(--color-sky-600), var(--color-sky-400))',
    border: '1px solid light-dark(var(--color-sky-600), var(--color-sky-400))',
  },
  'info-solid': {
    background: 'light-dark(var(--color-sky-600), var(--color-sky-400))',
    color: 'var(--color-white)',
    border: '1px solid light-dark(var(--color-sky-600), var(--color-sky-400))',
  },
  'warning': {
    background: 'color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))',
    color: 'light-dark(var(--color-amber-600), var(--color-amber-400))',
    border: '1px solid light-dark(var(--color-amber-600), var(--color-amber-400))',
  },
  'warning-solid': {
    background: 'light-dark(var(--color-amber-600), var(--color-amber-400))',
    color: 'var(--color-white)',
    border: '1px solid light-dark(var(--color-amber-600), var(--color-amber-400))',
  },
  'default': {
    background: 'var(--background)',
    color: 'var(--foreground)',
    border: '1px solid var(--border)',
  },
  'default-solid': {
    background: 'var(--foreground)',
    color: 'var(--background)',
    border: '1px solid var(--foreground)',
  },
}

export const showToast = ({
  variant = 'default',
  message,
  description,
  avatar,
  closeButton = false,
  position = 'top-center',
  promise,
  style,
}: GenericToastOptions) => {
  const content = avatar ? (
    <div className='flex items-center gap-2'>
      <Avatar>
        {avatar.src && <AvatarImage src={avatar.src} alt={avatar.alt || 'Avatar'} />}
        <AvatarFallback className='text-sm'>{avatar.fallback || 'NA'}</AvatarFallback>
      </Avatar>
      <div>
        {message}
        {description && <div className='opacity-80'>{description}</div>}
      </div>
    </div>
  ) : description ? (
    <div>
      {message}
      <div className='opacity-80'>{description}</div>
    </div>
  ) : (
    message
  )

  const appliedStyle = { ...toastStyles[variant], ...style } as React.CSSProperties

  if (promise) {
    return toast.promise(promise, {
      loading: typeof message === 'string' ? message : 'Loading...',
      success: typeof message === 'string' ? message : 'Success!',
      error: 'Oops, there was an error.',
      style: appliedStyle,
      position,
    })
  }

  // Détecte le type de toast pour Sonner selon le nom du variant
  const baseType = variant.split('-')[0]

  switch (baseType) {
    case 'success':
      return toast.success(content, { closeButton, style: appliedStyle, position })
    case 'error':
      return toast.error(content, { closeButton, style: appliedStyle, position })
    case 'info':
      return toast.info(content, { closeButton, style: appliedStyle, position })
    case 'warning':
      return toast.warning(content, { closeButton, style: appliedStyle, position })
    default:
      return toast(content, { closeButton, style: appliedStyle, position })
  }
}
