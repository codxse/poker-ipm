'use client'

import Lottie from 'lottie-react'
import alienAnimation from './animation.json'

export default function AlienAnimation(props: { className?: string }) {
  return (
    <Lottie
      className={props.className}
      animationData={alienAnimation}
      loop={true}
    />
  )
}
