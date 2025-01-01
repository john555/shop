import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Media, MediaType } from '@/types/admin-api'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'

interface MediaRendererProps {
  media: Media
  alt: string
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

export function MediaRenderer({ media, alt }: MediaRendererProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (media.type === MediaType.Photo) {
    return (
      <div className="aspect-square relative overflow-hidden rounded-lg">
        <Image
          src={media.url}
          alt={alt}
          layout="fill"
          objectFit="cover"
        />
      </div>
    )
  }

  if (media.type === 'VIDEO') {
    return (
      <div className="aspect-square relative overflow-hidden rounded-lg">
        <video
          src={media.url}
          controls
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }

  if (media.type === 'MODEL_3D' && isClient) {
    return (
      <div className="aspect-square relative overflow-hidden rounded-lg">
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <Model url={media.url} />
          <OrbitControls />
          <Environment preset="studio" />
        </Canvas>
      </div>
    )
  }

  return null
}

