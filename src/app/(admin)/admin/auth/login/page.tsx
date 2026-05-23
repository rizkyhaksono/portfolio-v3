import { AdminLoginForm } from "./_components/login-form"
import Grainient from "@/components/grainient-lazy"

export default function AdminAuthLoginPage() {
  return (
    <div className="min-h-svh relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Grainient
          color1="#6366f1"
          color2="#4c1d95"
          color3="#a78bfa"
          timeSpeed={1.2}
          colorBalance={0}
          warpStrength={0.8}
          warpFrequency={4}
          warpSpeed={1.5}
          warpAmplitude={40}
          blendAngle={0}
          blendSoftness={0.08}
          rotationAmount={400}
          noiseScale={2}
          grainAmount={0.06}
          grainScale={2}
          grainAnimated={false}
          contrast={1.2}
          gamma={1}
          saturation={0.9}
          centerX={0}
          centerY={0}
          zoom={0.95}
        />
      </div>

      {/* Scrim — card stays readable */}
      <div
        className="absolute inset-0 z-[1] bg-background/40 dark:bg-background/60 backdrop-blur-[2px] pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-3xl">
        <AdminLoginForm />
      </div>
    </div>
  )
}
