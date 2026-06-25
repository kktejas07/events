/** Theme asset paths */

export const themeAssets = {
  hero: {
    background: "/assets/img/home-3/hero/hero-bg.jpg",
    shape: "/assets/img/home-3/hero/shape.png",
  },
  about: {
    image: "/assets/img/home-3/about/about-1.png",
    shape1: "/assets/img/home-3/about/shape-1.png",
    shape2: "/assets/img/home-3/about/shape-2.png",
    blur: "/assets/img/home-3/about/blur-shape.png",
    circle: "/assets/img/home-3/about/circle.png",
  },
  intro: {
    shape: "/assets/img/home-3/shape.png",
    text: "/assets/img/home-3/text.png",
  },
  schedule: {
    shape: "/assets/img/home-3/event/shape.png",
    group: "/assets/img/home-3/event/group.png",
    events: [
      "/assets/img/home-3/event/event-1.jpg",
      "/assets/img/home-3/event/event-2.jpg",
      "/assets/img/home-3/event/event-3.jpg",
      "/assets/img/home-3/event/event-4.jpg",
    ],
  },
  speakers: {
    bg: "/assets/img/home-3/speaker/bg.png",
    dark: "/assets/img/home-3/speaker/dark.png",
    photos: [
      "/assets/img/home-3/speaker/speaker-1.jpg",
      "/assets/img/home-3/speaker/speaker-2.jpg",
      "/assets/img/home-3/speaker/speaker-3.jpg",
      "/assets/img/home-3/speaker/speaker-4.jpg",
      "/assets/img/home-3/speaker/speaker-5.jpg",
    ],
  },
  services: {
    man: "/assets/img/services/man.png",
    circle: "/assets/img/services/circle.png",
    dark: "/assets/img/services/dark.png",
    shape2: "/assets/img/services/shape-2.png",
    bgShape: "/assets/img/services/bg-shape.png",
    faq2: "/assets/img/services/faq-2.jpg",
    faq3: "/assets/img/services/faq-3.jpg",
    rightShape: "/assets/img/services/right-shape.png",
  },
  news: {
    shape: "/assets/img/home-3/news/shape.png",
    items: [
      "/assets/img/home-3/news/news-1.jpg",
      "/assets/img/home-3/news/news-2.jpg",
      "/assets/img/home-3/news/news-3.jpg",
    ],
  },
  sponsors: {
    bg: "/assets/img/sponsors/sponsor-bg.jpg",
    shape: "/assets/img/sponsors/shape.png",
    qr: "/assets/img/sponsors/qr-image.png",
    dark: "/assets/img/events/dark.png",
  },
  footer: {
    background: "/assets/img/home-3/footer-bg.jpg",
  },
  sideber: "/assets/img/header/sideber.jpg",
} as const;

export function eventScheduleListImage(index: number) {
  const images = [
    "/assets/img/home-1/event/event-1.png",
    "/assets/img/home-1/event/event-2.png",
    "/assets/img/home-1/event/event-3.png",
  ];
  return images[index % images.length];
}

export function scheduleImage(index: number) {
  return themeAssets.schedule.events[index % themeAssets.schedule.events.length];
}

export function speakerImage(index: number, fallback?: string | null) {
  if (fallback) return fallback;
  return themeAssets.speakers.photos[index % themeAssets.speakers.photos.length];
}

export function newsImage(index: number, fallback?: string | null) {
  if (fallback) return fallback;
  return themeAssets.news.items[index % themeAssets.news.items.length];
}
