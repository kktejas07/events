"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    WOW?: new (options?: Record<string, unknown>) => { init: () => void };
    Swiper?: new (
      el: string | Element,
      options?: Record<string, unknown>
    ) => { destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void };
    jQuery?: JQueryStatic;
  }

  interface JQueryStatic {
    (selector: string | Element): JQuery;
    fn: {
      meanmenu?: (options: Record<string, unknown>) => void;
      magnificPopup?: (options: Record<string, unknown>) => void;
    };
  }

  interface JQuery {
    length: number;
    meanmenu: (options: Record<string, unknown>) => JQuery;
    magnificPopup: (options: Record<string, unknown>) => JQuery;
  }
}

function populateOffcanvasFallback() {
  const isHome = document.querySelector(".header-1.header-3");
  const sourceNav = document.querySelector(
    isHome ? "#mobile-menus ul" : "#mobile-menu ul"
  );
  const offcanvasTarget = document.querySelector(
    isHome ? ".offcanvas__content .mobile-menus" : ".offcanvas__content .mobile-menu"
  );
  if (!sourceNav || !offcanvasTarget || offcanvasTarget.children.length > 0) return;

  const clone = sourceNav.cloneNode(true) as HTMLElement;
  clone.classList.add("gt-offcanvas-nav");
  offcanvasTarget.appendChild(clone);
}

function initMeanMenu() {
  const $ = window.jQuery;
  if (!$?.fn?.meanmenu) {
    populateOffcanvasFallback();
    return;
  }

  const isHome = Boolean(document.querySelector(".header-1.header-3"));
  const mobileMenusTarget = document.querySelector(".offcanvas__content .mobile-menus");
  const mobileMenuTarget = document.querySelector(".offcanvas__content .mobile-menu");

  if (mobileMenusTarget) mobileMenusTarget.innerHTML = "";
  if (mobileMenuTarget) mobileMenuTarget.innerHTML = "";

  if (isHome) {
    const homeNav = document.querySelector("#mobile-menus");
    if (homeNav) {
      $("#mobile-menus").meanmenu({
        meanMenuContainer: ".offcanvas__content .mobile-menus",
        meanScreenWidth: "99999",
        meanExpand: ['<i class="far fa-plus"></i>'],
      });
    }
    return;
  }

  const innerNav = document.querySelector("#mobile-menu");
  if (innerNav) {
    $("#mobile-menu").meanmenu({
      meanMenuContainer: ".offcanvas__content .mobile-menu",
      meanScreenWidth: "991",
      meanExpand: ['<i class="far fa-plus"></i>'],
    });
  }
}

function destroySwipers(selector: string) {
  document.querySelectorAll(selector).forEach((el) => {
    const swiperEl = el as HTMLElement & {
      swiper?: { destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void };
    };
    if (swiperEl.swiper?.destroy) {
      swiperEl.swiper.destroy(true, true);
    }
    el.classList.remove("swiper-initialized");
  });
}

function initOffcanvasMenu() {
  initMeanMenu();
}

function initSwipers() {
  const Swiper = window.Swiper;
  if (!Swiper) return;

  destroySwipers(".gt-brand-slider");
  destroySwipers(".gt-testimonial-slider-2");
  destroySwipers(".gt-instagram-slider");

  /* Testimonial marquee sliders are initialized by TestimonialSliders React component */

  document.querySelectorAll(".gt-brand-slider").forEach((el) => {
    if (el.classList.contains("swiper-initialized")) return;
    new Swiper(el, {
      spaceBetween: 30,
      speed: 1300,
      loop: true,
      autoplay: { delay: 2000, disableOnInteraction: false },
      breakpoints: {
        0: { slidesPerView: 2 },
        576: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        992: { slidesPerView: 5 },
        1200: { slidesPerView: 6 },
      },
    });
  });

  document.querySelectorAll(".gt-testimonial-slider-2").forEach((el) => {
    if (el.classList.contains("swiper-initialized")) return;
    new Swiper(el, {
      spaceBetween: 30,
      speed: 1300,
      loop: true,
      navigation: {
        nextEl: ".array-next",
        prevEl: ".array-prev",
      },
    });
  });

  document.querySelectorAll(".gt-instagram-slider").forEach((el) => {
    if (el.classList.contains("swiper-initialized")) return;
    new Swiper(el, {
      slidesPerView: "auto",
      spaceBetween: 20,
      loop: true,
      autoplay: { delay: 2500, disableOnInteraction: false },
    });
  });
}

function initQtyButtons() {
  document.querySelectorAll(".qty").forEach((qtyEl) => {
    const minus = qtyEl.querySelector(".qtyminus");
    const plus = qtyEl.querySelector(".qtyplus");
    const input = qtyEl.querySelector('input[type="number"]') as HTMLInputElement | null;
    if (!minus || !plus || !input || minus.hasAttribute("data-bound")) return;
    minus.setAttribute("data-bound", "true");
    plus.setAttribute("data-bound", "true");

    minus.addEventListener("click", () => {
      const val = Math.max(1, parseInt(input.value, 10) - 1);
      input.value = String(val);
    });
    plus.addEventListener("click", () => {
      const max = parseInt(input.max, 10) || 10;
      const val = Math.min(max, parseInt(input.value, 10) + 1);
      input.value = String(val);
    });
  });
}

function initMagnificPopup() {
  const $ = window.jQuery;
  if (!$ || !$(".video-popup").length) return;
  $(".video-popup").magnificPopup({ type: "iframe", mainClass: "mfp-fade", removalDelay: 160 });
}

function dismissPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader || preloader.dataset.dismissed === "true") return;
  preloader.dataset.dismissed = "true";
  preloader.classList.add("loaded");
  window.setTimeout(() => {
    preloader.style.display = "none";
    preloader.style.pointerEvents = "none";
  }, 900);
}

export function ThemeInit() {
  const pathname = usePathname();

  useEffect(() => {
    dismissPreloader();

    const onLoad = () => dismissPreloader();
    if (document.readyState === "complete") {
      dismissPreloader();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }
    const fallback = window.setTimeout(dismissPreloader, 2500);

    const timer = window.setTimeout(() => {
      if (window.WOW) {
        new window.WOW({ live: false }).init();
      }
      initSwipers();
      initOffcanvasMenu();
      initQtyButtons();
      initMagnificPopup();
    }, 400);
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(fallback);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
