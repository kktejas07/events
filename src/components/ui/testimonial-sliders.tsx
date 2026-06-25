"use client";

import { useEffect, useMemo } from "react";

type TestimonialItem = { quote: string; name: string; role: string };

const FALLBACK: TestimonialItem[] = [
  {
    quote:
      "Attending this design conference was a game-changer. The speakers were not only knowledgeable but also made complex concepts easy to understand.",
    name: "Mark D.",
    role: "Tech Entrepreneur",
  },
  {
    quote:
      "The networking opportunities alone were worth the ticket price. I connected with designers from around the world.",
    name: "Lisa M.",
    role: "Creative Director",
  },
  {
    quote: "From Figma workshops to UX panels, every session delivered real value.",
    name: "Alex K.",
    role: "Product Designer",
  },
];

const swiperOpts = {
  slidesPerView: "auto" as const,
  spaceBetween: 20,
  freeMode: true,
  centeredSlides: true,
  loop: true,
  loopAdditionalSlides: 6,
  speed: 6000,
  allowTouchMove: false,
  autoplay: {
    delay: 1,
    disableOnInteraction: false,
    pauseOnMouseEnter: false,
  },
};

function SlideCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="swiper-slide brand-slide-element">
      <div className="gt-testimonial-box-item">
        <h3>Next-level experience!</h3>
        <p>&ldquo;{item.quote}&rdquo;</p>
        <h6>
          {item.name}, <span>{item.role}</span>
        </h6>
      </div>
    </div>
  );
}

export function TestimonialSliders({
  items,
}: {
  items: { quote?: string; name?: string; role?: string }[];
}) {
  const slides = useMemo(() => {
    const base =
      items.length > 0
        ? items.map((t) => ({
            quote: t.quote || "",
            name: t.name || "",
            role: t.role || "",
          }))
        : FALLBACK;
    return [...base, ...base, ...base];
  }, [items]);

  useEffect(() => {
    type SwiperInstance = { destroy: (a?: boolean, b?: boolean) => void };
    const instances: SwiperInstance[] = [];

    function init() {
      const Swiper = window.Swiper;
      if (!Swiper) return false;

      document.querySelectorAll(".gt-testimonial-box-slider, .gt-testimonial-box-slider-2").forEach((el) => {
        const node = el as HTMLElement & { swiper?: SwiperInstance };
        if (node.swiper?.destroy) {
          node.swiper.destroy(true, true);
        }
        el.classList.remove("swiper-initialized");
        el.setAttribute("data-react-swiper", "true");
        instances.push(new Swiper(el, swiperOpts));
      });
      return instances.length > 0;
    }

    let attempts = 0;
    const tryInit = () => {
      if (init() || attempts > 20) return;
      attempts += 1;
      timer = window.setTimeout(tryInit, 200);
    };

    let timer = window.setTimeout(tryInit, 300);

    return () => {
      window.clearTimeout(timer);
      instances.forEach((s) => s.destroy(true, true));
    };
  }, [slides]);

  return (
    <section className="gt-testimonial-section-3 fix section-padding pb-0">
      <div className="gt-testimonial-box-wrapper gt-style-1">
        <div className="swiper gt-testimonial-box-slider" data-react-swiper="pending">
          <div className="swiper-wrapper slide-transtion">
            {slides.map((item, i) => (
              <SlideCard key={`left-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
      <div className="gt-testimonial-box-wrapper">
        <div dir="rtl" className="swiper gt-testimonial-box-slider-2" data-react-swiper="pending">
          <div className="swiper-wrapper slide-transtion">
            {slides.map((item, i) => (
              <SlideCard key={`right-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
