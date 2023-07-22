import { useEffect, useState } from 'react'
import { SignInResponse, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export interface AuthResponse extends SignInResponse {
  state: 'IDLE' | 'LOADING' | 'COMPLETE'
}

const initialResponse: AuthResponse = {
  error: '',
  status: -1,
  ok: false,
  url: null,
  state: 'IDLE',
}

export default function useAuth(params: { accessToken?: string | null }) {
  const router = useRouter()
  const [authResponse, setAuthResponse] =
    useState<AuthResponse>(initialResponse)

  useEffect(() => {
    if (!params.accessToken) return

    setAuthResponse((prev) => ({
      ...prev,
      state: 'LOADING',
    }))

    signIn(
      'credentials',
      { redirect: false },
      {
        accessToken: params.accessToken,
      },
    ).then((response) => {
      setAuthResponse((prev) => ({
        ...prev,
        ...response,
        state: 'COMPLETE',
      }))

      if (!response?.error) {
        router.replace(`/rooms`)
      }
    })

    return () => {
      setAuthResponse(initialResponse)
    }
  }, [params.accessToken])

  return authResponse
}
