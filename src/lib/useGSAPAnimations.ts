import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { 
  initMultiLayerParallax, 
  initMouseParallax, 
  initScrollVelocityParallax, 
  initParallaxSections,
  init3DCardParallax,
  initClipReveal,
  initStaggerGridReveal,
  initTextMaskReveal,
  initBackgroundShift 
} from "./gsap";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function useGSAPAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const revealEls = gsap.utils.toArray<HTMLElement>("[data-gsap-reveal]");
      revealEls.forEach((el) => {
        const stagger = parseFloat(el.getAttribute("data-stagger") || "0.08");
        const delay = parseFloat(el.getAttribute("data-delay") || "0");
        const y = parseFloat(el.getAttribute("data-y") || "60");

        gsap.from(el, {
          opacity: 0,
          y,
          ease: "expo.out",
          duration: 1.2,
          delay,
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      const splitEls = gsap.utils.toArray<HTMLElement>("[data-gsap-split]");
      splitEls.forEach((el) => {
        const type = el.getAttribute("data-split-type") || "lines,words,chars";
        const split = SplitText.create(el, { type, linesClass: "split-line" });
        const stagger = parseFloat(el.getAttribute("data-stagger") || "0.03");

        gsap.from(split.chars, {
          opacity: 0,
          y: 100,
          rotateX: -90,
          transformOrigin: "50% 100%",
          ease: "expo.out",
          duration: 1.2,
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      const parallaxEls = gsap.utils.toArray<HTMLElement>("[data-gsap-parallax]");
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-speed") || "0.2");
        gsap.to(el, {
          yPercent: -100 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      const magneticEls = gsap.utils.toArray<HTMLElement>("[data-gsap-magnetic]");
      magneticEls.forEach((el) => {
        const strength = parseFloat(el.getAttribute("data-strength") || "0.35");
        const bounds = el.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        const handleMove = (e: MouseEvent) => {
          const dx = (e.clientX - centerX) * strength;
          const dy = (e.clientY - centerY) * strength;
          gsap.to(el, { x: dx, y: dy, duration: 0.6, ease: "expo.out" });
        };
        const handleLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" });
        };
        el.addEventListener("mousemove", handleMove);
        el.addEventListener("mouseleave", handleLeave);
      });
    });

    // Initialize advanced parallax systems
    initMultiLayerParallax();
    initMouseParallax("[data-mouse-parallax]");
    initScrollVelocityParallax("[data-velocity-parallax]");
    initParallaxSections();
    init3DCardParallax("[data-3d-card]");
    initClipReveal("[data-clip-reveal]");
    initStaggerGridReveal("[data-stagger-grid]", "[data-stagger-item]");
    initTextMaskReveal("[data-text-mask]");
    initBackgroundShift("[data-bg-shift]");

    return () => ctx.revert();
  }, []);
}