import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface GSAPOptions {
  scrollTrigger?: ScrollTrigger.Vars;
  [key: string]: unknown;
}

export function initGSAP() {
  gsap.config({ nullTargetWarn: false });
}

export function splitTextReveal(selector: string, options: GSAPOptions = {}) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    const split = SplitText.create(el, { type: "lines,words,chars", linesClass: "split-line" });
    gsap.from(split.chars, {
      opacity: 0,
      y: 100,
      rotateX: -90,
      transformOrigin: "50% 100%",
      ease: "expo.out",
      duration: 1.2,
      stagger: 0.02,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
        ...options.scrollTrigger,
      },
      ...options,
    });
  });
}

export function revealLines(selector: string, options: GSAPOptions = {}) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    const split = SplitText.create(el, { type: "lines", linesClass: "reveal-line" });
    gsap.from(split.lines, {
      opacity: 0,
      y: 120,
      ease: "expo.out",
      duration: 1.4,
      stagger: 0.1,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none reverse",
        ...options.scrollTrigger,
      },
      ...options,
    });
  });
}

export function fadeInUp(selector: string, options: GSAPOptions = {}) {
  gsap.from(selector, {
    opacity: 0,
    y: 60,
    ease: "expo.out",
    duration: 1.2,
    stagger: 0.08,
    scrollTrigger: {
      trigger: selector,
      start: "top 85%",
      toggleActions: "play none none reverse",
      ...options.scrollTrigger,
    },
    ...options,
  });
}

export function parallaxImage(selector: string, speed = 0.3) {
  gsap.to(selector, {
    yPercent: -100 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: selector,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}

/* ===== ADVANCED PARALLAX SYSTEM ===== */

export function initMultiLayerParallax() {
  const layers = gsap.utils.toArray<HTMLElement>("[data-parallax-layer]");
  
  layers.forEach((layer) => {
    const speed = parseFloat(layer.getAttribute("data-parallax-speed") || "0.2");
    const direction = layer.getAttribute("data-parallax-direction") || "vertical";
    const scrub = parseFloat(layer.getAttribute("data-parallax-scrub") || "1");
    
    if (direction === "horizontal") {
      gsap.to(layer, {
        xPercent: -100 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: layer,
          start: "left right",
          end: "right left",
          scrub,
        },
      });
    } else if (direction === "rotate") {
      gsap.to(layer, {
        rotation: 360 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: layer,
          start: "top bottom",
          end: "bottom top",
          scrub,
        },
      });
    } else if (direction === "scale") {
      gsap.to(layer, {
        scale: 1 + speed,
        ease: "none",
        scrollTrigger: {
          trigger: layer,
          start: "top bottom",
          end: "bottom top",
          scrub,
        },
      });
    } else if (direction === "opacity") {
      gsap.to(layer, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: layer,
          start: "top center",
          end: "bottom center",
          scrub,
        },
      });
    } else {
      gsap.to(layer, {
        yPercent: -100 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: layer,
          start: "top bottom",
          end: "bottom top",
          scrub,
        },
      });
    }
  });
}

export function initMouseParallax(selector: string, _options = {}) {
  const elements = gsap.utils.toArray<HTMLElement>(selector);
  
  elements.forEach((el) => {
    const strengthX = parseFloat(el.getAttribute("data-mouse-strength-x") || "0.02");
    const strengthY = parseFloat(el.getAttribute("data-mouse-strength-y") || "0.02");
    const rotateStrength = parseFloat(el.getAttribute("data-mouse-rotate") || "0");
    const scaleStrength = parseFloat(el.getAttribute("data-mouse-scale") || "0");
    
    let bounds: DOMRect;
    const updateBounds = () => bounds = el.getBoundingClientRect();
    updateBounds();
    window.addEventListener("resize", updateBounds);
    
    const handleMove = (e: MouseEvent) => {
      if (!bounds) return;
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const dx = (e.clientX - centerX) * strengthX;
      const dy = (e.clientY - centerY) * strengthY;
      
      gsap.to(el, {
        x: dx,
        y: dy,
        rotationX: -dy * rotateStrength,
        rotationY: dx * rotateStrength,
        scale: 1 + Math.abs(dx * scaleStrength / 1000),
        duration: 0.8,
        ease: "expo.out",
        transformPerspective: 1000,
      });
    };
    
    const handleLeave = () => {
      gsap.to(el, {
        x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1,
        duration: 1.5, ease: "elastic.out(1, 0.4)"
      });
    };
    
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
  });
}

export function initScrollVelocityParallax(selector: string) {
  const elements = gsap.utils.toArray<HTMLElement>(selector);
  
  elements.forEach((el) => {
    const speed = parseFloat(el.getAttribute("data-velocity-speed") || "0.5");
    const maxOffset = parseFloat(el.getAttribute("data-velocity-max") || "100");
    
    let lastScrollY = window.scrollY;
    let velocity = 0;
    
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      velocity = (currentScrollY - lastScrollY) * speed;
      lastScrollY = currentScrollY;
      
      const offset = gsap.utils.clamp(-maxOffset, maxOffset, velocity * 10);
      
      gsap.to(el, {
        y: "+=" + offset,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
  });
}

export function initParallaxSections() {
  const sections = gsap.utils.toArray<HTMLElement>(".parallax-section");
  
  sections.forEach((section, i) => {
    const bg = section.querySelector<HTMLElement>(".parallax-bg");
    const fg = section.querySelector<HTMLElement>(".parallax-fg");
    const content = section.querySelector<HTMLElement>(".parallax-content");
    
    if (bg) {
      gsap.to(bg, {
        yPercent: -30 * (i % 2 === 0 ? 1 : -1),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }
    
    if (fg) {
      gsap.to(fg, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }
    
    if (content) {
      gsap.from(content, {
        opacity: 0,
        y: 100,
        ease: "expo.out",
        duration: 1.5,
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }
  });
}

export function magneticEnhanced(element: HTMLElement, strength = 0.4) {
  const bounds = element.getBoundingClientRect();
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;

  const handleMove = (e: MouseEvent) => {
    const dx = (e.clientX - centerX) * strength;
    const dy = (e.clientY - centerY) * strength;
    gsap.to(element, { x: dx, y: dy, duration: 0.6, ease: "expo.out" });
  };

  const handleLeave = () => {
    gsap.to(element, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" });
  };

  element.addEventListener("mousemove", handleMove);
  element.addEventListener("mouseleave", handleLeave);

  return () => {
    element.removeEventListener("mousemove", handleMove);
    element.removeEventListener("mouseleave", handleLeave);
  };
}

export function pageLoadSequence() {
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

  tl.from(".hero__role", { opacity: 0, y: 30, duration: 1, delay: 0.2 })
    .from(".hero__name .hero__char", { opacity: 0, y: "110%", rotateX: -90, duration: 1.4, stagger: 0.06 }, "-=0.4")
    .from(".hero__lede", { opacity: 0, y: 30, duration: 1 }, "-=0.8")
    .from(".hero__actions > *", { opacity: 0, y: 30, duration: 1, stagger: 0.1 }, "-=0.6")
    .from(".hero__scroll", { opacity: 0, y: 20, duration: 1 }, "-=0.4");

  return tl;
}

export function sectionReveal(selector: string) {
  gsap.utils.toArray<HTMLElement>(selector).forEach((section) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse" },
    });

    tl.from(section.querySelectorAll("[data-reveal]"), {
      opacity: 0,
      y: 60,
      duration: 1.2,
      stagger: 0.1,
      ease: "expo.out",
    });
  });
}

/* ===== 3D CARD PARALLAX ===== */
export function init3DCardParallax(selector: string) {
  const cards = gsap.utils.toArray<HTMLElement>(selector);
  
  cards.forEach((card) => {
    const strength = parseFloat(card.getAttribute("data-3d-strength") || "0.02");
    const perspective = parseFloat(card.getAttribute("data-3d-perspective") || "1000");
    
    let bounds: DOMRect;
    const updateBounds = () => bounds = card.getBoundingClientRect();
    updateBounds();
    window.addEventListener("resize", updateBounds);
    
    const handleMove = (e: MouseEvent) => {
      if (!bounds) return;
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const dx = (e.clientX - centerX) * strength;
      const dy = (e.clientY - centerY) * strength;
      
      gsap.to(card, {
        rotationY: dx,
        rotationX: -dy,
        transformPerspective: perspective,
        transformOrigin: "center center",
        duration: 0.4,
        ease: "power2.out",
      });
    };
    
    const handleLeave = () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)"
      });
    };
    
    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
  });
}

/* ===== REVEAL ON SCROLL WITH CLIP PATH ===== */
export function initClipReveal(selector: string) {
  const elements = gsap.utils.toArray<HTMLElement>(selector);
  
  elements.forEach((el) => {
    const direction = el.getAttribute("data-clip-direction") || "bottom";
    const delay = parseFloat(el.getAttribute("data-clip-delay") || "0");
    
    let clipStart, clipEnd;
    switch (direction) {
      case "top":
        clipStart = "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
        clipEnd = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
        break;
      case "left":
        clipStart = "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)";
        clipEnd = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
        break;
      case "right":
        clipStart = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";
        clipEnd = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
        break;
      default:
        clipStart = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)";
        clipEnd = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
    }
    
    gsap.fromTo(el, 
      { clipPath: clipStart },
      {
        clipPath: clipEnd,
        duration: 1.5,
        delay,
        ease: "expo.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
}

/* ===== STAGGERED GRID REVEAL ===== */
export function initStaggerGridReveal(containerSelector: string, itemSelector: string) {
  const containers = gsap.utils.toArray<HTMLElement>(containerSelector);
  
  containers.forEach((container) => {
    const items = container.querySelectorAll<HTMLElement>(itemSelector);
    if (!items.length) return;
    
    gsap.from(items, {
      opacity: 0,
      y: 80,
      scale: 0.9,
      rotateX: -15,
      duration: 1.2,
      stagger: {
        amount: 0.6,
        from: "center",
        grid: "auto",
        ease: "power2.out",
      },
      ease: "expo.out",
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

/* ===== TEXT MASK REVEAL ===== */
export function initTextMaskReveal(selector: string) {
  const elements = gsap.utils.toArray<HTMLElement>(selector);
  
  elements.forEach((el) => {
    const split = SplitText.create(el, { type: "chars", charsClass: "mask-char" });
    
    gsap.from(split.chars, {
      opacity: 0,
      y: 100,
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      duration: 1,
      stagger: 0.02,
      ease: "expo.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

/* ===== BACKGROUND SHIFT ON SCROLL ===== */
export function initBackgroundShift(selector: string) {
  const sections = gsap.utils.toArray<HTMLElement>(selector);
  
  sections.forEach((section, i) => {
    const bg = section.querySelector<HTMLElement>("[data-bg-layer]");
    if (!bg) return;
    
    const speed = parseFloat(bg.getAttribute("data-bg-speed") || "0.3");
    const direction = i % 2 === 0 ? 1 : -1;
    
    gsap.to(bg, {
      yPercent: -50 * speed * direction,
      scale: 1.1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  });
}