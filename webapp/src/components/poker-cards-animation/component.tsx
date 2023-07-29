'use client'

import Lottie from 'lottie-react'
import pokerCardsAnimation from './animation.json'

export default function Roulette(props: { className?: string }) {
  return (
    <Lottie
      className={props.className}
      animationData={pokerCardsAnimation}
      loop={true}
    />
  )
}
