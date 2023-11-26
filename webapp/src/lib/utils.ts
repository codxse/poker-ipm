import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { JoinAsEnum } from '@lib/hook/use-participant'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function roleAs(role: JoinAsEnum) {
  if (role === JoinAsEnum.OBSERVER) return "Story Owner"
  if (role === JoinAsEnum.OBSERVABLE) return "Voter" 
}