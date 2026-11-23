import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';
import { Image as ImageIcon } from 'lucide-react';

export const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_SUBTLE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Enables pointer-driven 3D tilt ONLY on desktop devices with fine hover pointers
 * and when the user has not requested reduced motion.
 */
export function useCanHover3D(): boolean {
  const prefersReduced = useReducedMotion();
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const desktopQuery = window.matchMedia('(min-width: 1024px)');

    const update = () => {
      setCanHover(hoverQuery.matches && desktopQuery.matches && !prefersReduced);
    };

    update();
    hoverQuery.addEventListener('change', update);
    desktopQuery.addEventListener('change', update);
    return () => {
      hoverQuery.removeEventListener('change', update);
      desktopQuery.removeEventListener('change', update);
    };
  }, [prefersReduced]);

  return canHover;
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  amount?: number;
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 18,
  duration = 0.62,
  amount = 0.15,
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE_EDITORIAL }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  elevationY?: number;
  glareOpacity?: number;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  ariaLabel?: string;
}

/**
 * Lightweight, GPU-composited 3D perspective card.
 * Uses MotionValues directly so pointer movement triggers ZERO React re-renders.
 * Automatically degrades to subtle tap feedback on touch/mobile and reduced-motion.
 */
export function Tilt3DCard({
  children,
  className = '',
  maxTilt = 4,
  elevationY = -4,
  glareOpacity = 0.08,
  onClick,
  role,
  tabIndex,
  onKeyDown,
  ariaLabel,
}: Tilt3DCardProps) {
  const canHover3D = useCanHover3D();
  const prefersReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareAlpha = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const rotateX = useSpring(rawRotateX, springConfig);
  const rotateY = useSpring(rawRotateY, springConfig);
  const smoothGlareAlpha = useSpring(glareAlpha, { stiffness: 200, damping: 26 });

  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, ${smoothGlareAlpha}), transparent 65%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover3D || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    rawRotateY.set((px - 0.5) * 2 * maxTilt);
    rawRotateX.set((0.5 - py) * 2 * maxTilt);
    glareX.set(px * 100);
    glareY.set(py * 100);
    glareAlpha.set(glareOpacity);
  };

  const handlePointerLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    glareAlpha.set(0);
  };

  return (
    <div className="perspective-1000 h-full">
      <motion.div
        ref={cardRef}
        onPointerMove={canHover3D ? handlePointerMove : undefined}
        onPointerLeave={canHover3D ? handlePointerLeave : undefined}
        whileHover={
          prefersReduced
            ? undefined
            : {
                y: canHover3D ? elevationY : -2,
                transition: { duration: 0.25, ease: EASE_EDITORIAL },
              }
        }
        whileTap={
          onClick && !prefersReduced
            ? { scale: 0.988, transition: { duration: 0.14 } }
            : undefined
        }
        style={
          canHover3D
            ? {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
            : undefined
        }
        onClick={onClick}
        role={role}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
        className={`relative h-full will-change-transform ${className}`}
      >
        {children}
        {canHover3D && (
          <motion.div
            aria-hidden="true"
            style={{ background: glareBg }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] z-10"
          />
        )}
      </motion.div>
    </div>
  );
}

/**
 * Subtle 2px terracotta reading progress indicator pinned seamlessly beneath the header.
 */
export function ScrollProgressBar() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-[68px] left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-[#143B2A] via-[#9A3B1E] to-[#C98A2E] z-50 pointer-events-none opacity-85"
    />
  );
}

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  style,
  loading = 'lazy',
  fallbackTitle,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#EEF4F0] to-[#F5F0E6] text-[#16402E] p-6 text-center ${className}`}
      >
        <ImageIcon className="w-7 h-7 opacity-60" />
        <span className="text-xs font-medium tracking-wide opacity-80">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
