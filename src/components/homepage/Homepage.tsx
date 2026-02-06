import { Logo } from "./Logo";
import { HeroSection } from "./HeroSection";
import { Divider } from "./Divider";
import { OptionsSection } from "./OptionsSection";
import { Footer } from "./Footer";
import copy from "@/copy/homepage.json";

export function Homepage() {
  return (
    <div className="min-h-screen bg-gray-50 sm:bg-gradient-to-br sm:from-blue-100 sm:via-purple-50 sm:to-pink-100 flex items-center justify-center sm:p-4">
      {/* Phone frame on desktop, full width on mobile */}
      <div className="w-full min-h-screen sm:min-h-0 sm:w-[393px] sm:h-[853px] sm:max-h-[calc(100vh-2rem)] bg-gray-50 sm:rounded-3xl sm:shadow-2xl overflow-auto">
        <div className="px-8 py-6 sm:py-6">
          <div className="mb-8">
            <Logo
              appName={copy.header.appName}
              className="justify-center mb-4"
            />
            <p className="text-center text-lg text-gray-600">
              {copy.header.tagline}
            </p>
          </div>

          <HeroSection
            title={copy.hero.title}
            placeholder={copy.hero.placeholder}
            submitButton={copy.hero.submitButton}
          />

          <Divider text={copy.divider.text} />

          <OptionsSection options={copy.options} />

          <Footer text={copy.footer.text} />
        </div>
      </div>
    </div>
  );
}
