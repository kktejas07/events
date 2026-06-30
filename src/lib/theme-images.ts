import { resolveThemeImage } from "./resolve-theme-image";

/** Theme asset paths — local theme assets only */
export const themeAssets = {
  breadcrumb: {
    bg: "/assets/img/inner-page/breadcrumb/bg.png",
    shape: "/assets/img/inner-page/breadcrumb/bg-shape.png",
    line: "/assets/img/inner-page/breadcrumb/line-shape.png",
    arrow: "/assets/img/inner-page/breadcrumb/arrow.png",
  },
  hero: {
    background: "/assets/img/home-3/hero/hero-bg.jpg",
    shape: "/assets/img/home-3/hero/shape.png",
  },
  about: {
    image: "/assets/img/home-3/about/about-1.png",
    imageAlt: "/assets/img/about/about-1.png",
    shape1: "/assets/img/home-3/about/shape-1.png",
    shape2: "/assets/img/home-3/about/shape-2.png",
    blur: "/assets/img/home-3/about/blur-shape.png",
    circle: "/assets/img/home-3/about/circle.png",
  },
  intro: {
    shape: "/assets/img/home-3/shape.png",
    text: "/assets/img/home-3/text.png",
  },
  marquee: {
    icon: "/assets/img/home-1/marque/01.png",
  },
  schedule: {
    shape: "/assets/img/home-3/event/shape.png",
    group: "/assets/img/home-3/event/group.png",
    client: "/assets/img/home-1/event/client.png",
    listImages: [
      "/assets/img/home-1/event/event-1.png",
      "/assets/img/home-1/event/event-2.png",
      "/assets/img/home-1/event/event-3.png",
    ],
    events: [
      "/assets/img/home-3/event/event-1.jpg",
      "/assets/img/home-3/event/event-2.jpg",
      "/assets/img/home-3/event/event-3.jpg",
      "/assets/img/home-3/event/event-4.jpg",
    ],
  },
  eventCovers: [
    "/assets/img/home-1/event/event-1.png",
    "/assets/img/home-1/event/event-2.png",
    "/assets/img/home-1/event/event-3.png",
    "/assets/img/events/event-1.jpg",
    "/assets/img/events/event-2.jpg",
    "/assets/img/events/event-3.jpg",
    "/assets/img/events/event-4.jpg",
    "/assets/img/events/event-5.jpg",
  ],
  eventDetails: {
    hero: "/assets/img/inner-page/event-details/details-1.jpg",
    topic1: "/assets/img/inner-page/event-details/details-2.jpg",
    topic2: "/assets/img/inner-page/event-details/details-3.jpg",
    client: "/assets/img/inner-page/event-details/client.png",
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
      "/assets/img/speakers/speaker-1.jpg",
      "/assets/img/speakers/speaker-2.jpg",
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
  video: "/assets/img/home-3/event/business.mp4",
  brand: {
    default: "/assets/img/home-3/brand/brand-1.png",
  },
  ticket: {
    darkShape: "/assets/img/home-1/event/dark.png",
  },
  news: {
    shape: "/assets/img/home-3/news/shape.png",
    innerPage: [
      "/assets/img/home-1/news/news-1.jpg",
      "/assets/img/home-1/news/news-2.jpg",
      "/assets/img/home-1/news/news-3.jpg",
      "/assets/img/home-1/news/news-4.jpg",
      "/assets/img/home-1/news/news-5.jpg",
      "/assets/img/home-1/news/news-6.jpg",
    ],
    items: [
      "/assets/img/home-3/news/news-1.jpg",
      "/assets/img/home-3/news/news-2.jpg",
      "/assets/img/home-3/news/news-3.jpg",
      "/assets/img/news/news-1.jpg",
      "/assets/img/news/news-2.jpg",
      "/assets/img/news/news-3.jpg",
      "/assets/img/news/news-4.jpg",
      "/assets/img/news/news-5.jpg",
      "/assets/img/news/news-6.jpg",
    ],
  },
  sponsors: {
    bg: "/assets/img/sponsors/sponsor-bg.jpg",
    shape: "/assets/img/sponsors/shape.png",
    qr: "/assets/img/sponsors/qr-image.png",
    dark: "/assets/img/home-1/event/dark.png",
  },
  footer: {
    background: "/assets/img/home-3/footer-bg.jpg",
  },
  sideber: "/assets/img/header/sideber.jpg",
  comingSoon: "/assets/img/home-3/hero/hero-bg.jpg",
  testimonial: "/assets/img/testimonials/testimonial-1.jpg",
  error404: "/assets/img/home-3/about/about-1.png",
  collegeLogo: "/assets/img/home-3/brand/brand-1.png",
  speakersGroup: "/assets/img/home-1/event/client.png",
  ticketBlur: "/assets/img/home-1/event/blur-shape.png",
  decorations: {
    box1: "/assets/img/home-1/event/box-shape-1.png",
    box2: "/assets/img/home-1/event/box-shape-2.png",
    blur2: "/assets/img/home-1/event/blur-shape-2.png",
    circle3: "/assets/img/home-1/event/circle-shape-3.png",
  },
  scheduleDot: "/assets/img/home-1/event/line-shape-2.png",
} as const;

export function eventScheduleListImage(index: number) {
  return themeAssets.schedule.listImages[index % themeAssets.schedule.listImages.length];
}

export function innerPageNewsImage(index: number, fallback?: string | null) {
  return resolveThemeImage(fallback, themeAssets.news.innerPage[index % themeAssets.news.innerPage.length]);
}

export function scheduleImage(index: number) {
  return themeAssets.schedule.events[index % themeAssets.schedule.events.length];
}

export function speakerImage(index: number, fallback?: string | null) {
  return resolveThemeImage(fallback, themeAssets.speakers.photos[index % themeAssets.speakers.photos.length]);
}

export function newsImage(index: number, fallback?: string | null) {
  return resolveThemeImage(fallback, themeAssets.news.items[index % themeAssets.news.items.length]);
}

export function eventCoverImage(index: number, fallback?: string | null) {
  return resolveThemeImage(fallback, themeAssets.eventCovers[index % themeAssets.eventCovers.length]);
}

export function aboutImage(fallback?: string | null) {
  return resolveThemeImage(fallback, themeAssets.about.image);
}
