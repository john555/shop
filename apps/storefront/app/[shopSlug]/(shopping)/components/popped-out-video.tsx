'use client'

import React, { useRef, useEffect } from 'react'

interface PoppedOutVideoProps {
  videoSrc: string
  isPlaying: boolean
  isMuted: boolean
  onClose: () => void
  onTogglePlay: () => void
  onToggleMute: () => void
}

export function PoppedOutVideo({
  videoSrc,
  isPlaying,
  isMuted,
  onClose,
  onTogglePlay,
  onToggleMute
}: PoppedOutVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(error => console.error('Error playing video:', error))
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener('leavepictureinpicture', onClose)
      return () => {
        video.removeEventListener('leavepictureinpicture', onClose)
      }
    }
  }, [onClose])

  return (
    <video
      ref={videoRef}
      src={videoSrc}
      className="w-full h-full object-cover"
      loop
      playsInline
    />
  )
}

