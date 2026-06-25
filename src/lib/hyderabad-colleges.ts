/** Hyderabad colleges & universities — used for sponsorship / brand sections */

export type HyderabadCollege = {
  name: string;
  slug: string;
  website: string;
  /** Local path under /assets/img/colleges/ */
  logo: string;
  tier?: "PLATINUM" | "GOLD" | "SILVER" | "BRONZE";
};

export const hyderabadColleges: HyderabadCollege[] = [
  {
    name: "IIT Hyderabad",
    slug: "iit-hyderabad",
    website: "https://www.iith.ac.in",
    logo: "/assets/img/colleges/iit-hyderabad.svg",
    tier: "PLATINUM",
  },
  {
    name: "IIIT Hyderabad",
    slug: "iiit-hyderabad",
    website: "https://www.iiit.ac.in",
    logo: "/assets/img/colleges/iiit-hyderabad.svg",
    tier: "PLATINUM",
  },
  {
    name: "University of Hyderabad",
    slug: "university-of-hyderabad",
    website: "https://www.uohyd.ac.in",
    logo: "/assets/img/colleges/uoh.svg",
    tier: "GOLD",
  },
  {
    name: "Osmania University",
    slug: "osmania-university",
    website: "https://www.osmania.ac.in",
    logo: "/assets/img/colleges/osmania.svg",
    tier: "GOLD",
  },
  {
    name: "BITS Pilani Hyderabad",
    slug: "bits-hyderabad",
    website: "https://www.bits-pilani.ac.in/hyderabad",
    logo: "/assets/img/colleges/bits-pilani.svg",
    tier: "GOLD",
  },
  {
    name: "JNTUH",
    slug: "jntuh",
    website: "https://jntuh.ac.in",
    logo: "/assets/img/colleges/jntuh.svg",
    tier: "SILVER",
  },
  {
    name: "NALSAR University of Law",
    slug: "nalsar",
    website: "https://www.nalsar.ac.in",
    logo: "/assets/img/colleges/nalsar.svg",
    tier: "SILVER",
  },
  {
    name: "CBIT",
    slug: "cbit",
    website: "https://www.cbit.ac.in",
    logo: "/assets/img/colleges/cbit.svg",
    tier: "BRONZE",
  },
];

export const hyderabadCollegeLogos = hyderabadColleges.map((c) => c.logo);
