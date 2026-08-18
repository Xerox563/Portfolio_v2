import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSmoothScroll } from "./lib/smoothScroll";
import { Cursor } from "./components/Cursor";
import { Preloader } from "./components/Preloader";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { About } from "./components/About";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Timeline } from "./components/Timeline";
import { Testimonials } from "./components/Testimonials";
import { BlogSection } from "./components/BlogSection";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Admin } from "./admin/Admin";

function getView(): "site" | "admin" {
  return window.location.hash.startsWith("#/admin") ? "admin" : "site";
}

export default function App() {
  const [view, setView] = useState<"site" | "admin">(getView);

  useEffect(() => {
    const onChange = () => {
      setView(getView());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  if (view === "admin") return <Admin />;

  return <Site />;
}

function Site() {
  const [loaded, setLoaded] = useState(false);
  useSmoothScroll();

  return (
    <>
      <div className="noise" aria-hidden />
      <Cursor />

      <AnimatePresence>
        {!loaded && <Preloader onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Navbar />
        <Hero />

        <Marquee
          items={["Design Engineering", "Motion-First", "Immersive Web", "Brand Systems"]}
          direction="rtl"
        />

        <About />
        <Skills />

        <Marquee
          items={["Selected Work", "2024 — 2026", "Award-Mentioned", "Case Studies"]}
          direction="ltr"
          speed={1.4}
        />

        <Projects />
        <Timeline />
        <Testimonials />
        <BlogSection />
        <Contact />
        <Footer />
      </motion.main>
    </>
  );
}