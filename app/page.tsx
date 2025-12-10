import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import WorshipTimes from '@/components/WorshipTimes';
import Location from '@/components/Location';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <WorshipTimes />
      <Location />
      <Gallery />
      <Footer />
    </main>
  );
}

