'use client'

import React, { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

interface Props {
  children: ReactNode
}

export default function Provider(props: Props) {
  return <SessionProvider>{props.children}</SessionProvider>
}
