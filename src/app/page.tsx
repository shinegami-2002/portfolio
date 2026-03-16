import { SceneContainer } from '@/components/three/SceneContainer';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Projects } from '@/components/sections/Projects';
import { SkillsConstellation } from '@/components/sections/SkillsConstellation';
import { Publications } from '@/components/sections/Publications';
import { Education } from '@/components/sections/Education';
import { LeadershipAchievements } from '@/components/sections/LeadershipAchievements';
import { BeyondTheCode } from '@/components/sections/BeyondTheCode';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <SceneContainer />
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <SkillsConstellation />
        <Publications />
        <Education />
        <LeadershipAchievements />
        <BeyondTheCode />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
