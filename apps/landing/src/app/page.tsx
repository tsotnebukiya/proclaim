import FeatureDivider from "@/components/ui/FeatureDivider"
import Features from "@/components/ui/Features"
import { Hero } from "@/components/ui/Hero"
import { SmartContracts } from "@/components/ui/SmartContracts"
import VideoPlayer from "@/components/ui/VideoPlayer"

export default function Home() {
  return (
    <main className="relative mx-auto flex flex-col">
      <div className="pt-56">
        <Hero />
      </div>
      <div className="mt-32 px-4 xl:px-0">
        <Features />
      </div>
      <FeatureDivider className="my-16 max-w-6xl" />
      <div className="px-4 xl:px-0">
        <VideoPlayer />
      </div>
      <FeatureDivider className="my-16 max-w-6xl" />
      <div className="mb-16 px-4 xl:px-0">
        <SmartContracts />
      </div>
    </main>
  )
}
