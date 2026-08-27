import { Hero } from "@/components/sections/Hero";
import { FeaturedSoftware } from "@/components/sections/FeaturedSoftware";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { HowIBuild } from "@/components/sections/HowIBuild";
import { DownloadSection } from "@/components/sections/DownloadSection";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ClosingWordmark } from "@/components/sections/ClosingWordmark";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedSoftware />
      <SelectedWork />
      <HowIBuild />
      <DownloadSection />
      <AboutPreview />
      <ClosingWordmark />
    </>
  );
}
