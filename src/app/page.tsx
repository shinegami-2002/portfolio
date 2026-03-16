import { SceneContainer } from '@/components/three/SceneContainer';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  return (
    <>
      <SceneContainer />
      <Navbar />
      <main id="main-content" className="min-h-screen flex items-center justify-center">
        <h1 className="font-heading text-4xl text-cyan-accent">
          Portfolio Loading...
        </h1>
      </main>
    </>
  );
}
