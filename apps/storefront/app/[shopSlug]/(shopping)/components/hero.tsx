'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { createStoreFrontUrl } from '@/common/url';

const PoppedOutVideo = dynamic(
  () => import('./popped-out-video').then((mod) => mod.PoppedOutVideo),
  { ssr: false }
);

export function Hero() {
  const { shopSlug } = useParams();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSrc =
    'https://videos.pexels.com/video-files/8128402/8128402-uhd_2732_1440_25fps.mp4';

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current
          .play()
          .catch((error) => console.error('Error playing video:', error));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const togglePopOut = async () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (error) {
        console.error('Failed to enter/exit picture-in-picture mode:', error);
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 overflow-hidden">
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Eco-Friendly Tech
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover sustainable gadgets for a greener future
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link
                href={createStoreFrontUrl(shopSlug as string, 'products')}
                className="inline-block text-lg px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground font-semibold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Shop Now
              </Link>
            </motion.div>
          </div>
          <div className="w-full md:w-1/2 relative aspect-video">
            {isClient && (
              <>
                <video
                  ref={videoRef}
                  src={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-full rounded-lg shadow-lg"
                >
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute bottom-2 right-2 z-20 flex items-center space-x-1">
                  <button
                    onClick={togglePlay}
                    className="p-1 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-1 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="h-3 w-3" />
                    ) : (
                      <Volume2 className="h-3 w-3" />
                    )}
                  </button>
                  <button
                    onClick={togglePopOut}
                    className="p-1 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                  >
                    <Maximize className="h-3 w-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
