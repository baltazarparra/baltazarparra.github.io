export const site = {
  canonicalUrl: "https://baltz.dev/",
  fullName: "Baltazar Parra",
  shortName: "Baltz",
  title: "Baltz | Lead Engineer at Thoughtworks",
  description: "The personal site of Baltazar Parra, Lead Engineer at Thoughtworks, based in Brasil.",
  hero: {
    name: "baltz.",
    role: "Lead Engineer",
    employer: "Thoughtworks",
    employerUrl: "https://www.thoughtworks.com/",
    location: "Based in Brasil",
  },
  about: {
    heading: "Design software with code agents as architectural components.",
    credits:
      "Nike, Thoughtworks, XP Investimentos, Serasa, Dasa, MRV, CVC, GFT, CI&T",
  },
  writing: [
    {
      title: "Sharing skills with NPX",
      url: "https://dev.to/baltz/sharing-skills-with-npx-2nbc",
      publishedAt: "2026-05-04",
      publishedLabel: "May 4, 2026",
      readingTime: "3 min read",
    },
    {
      title: "What is 'Harness Design' and why does it matter",
      url: "https://dev.to/baltz/what-is-harness-design-and-why-does-it-matter-2dbj",
      publishedAt: "2026-03-30",
      publishedLabel: "March 30, 2026",
      readingTime: "4 min read",
    },
  ],
  projects: [
    {
      category: "Interactive learning",
      name: "AI-Native Engineering",
      description:
        "An interactive field guide to engineering software with AI at the center of the workflow.",
      url: "https://baltazarparra.github.io/ai-native-engineering",
    },
    {
      category: "Browser experiment",
      name: "Crypto Transfer DApp",
      description: "A focused experiment for transferring cryptocurrency.",
      url: "https://github.com/baltazarparra/crypto-transfer",
    },
    {
      category: "Tooling",
      name: "Subtitle Scraping",
      description:
        "A Puppeteer and Node.js utility for extracting subtitle data.",
      url: "https://github.com/baltazarparra/subtitle-scraping",
    },
  ],
  caipora: {
    name: "Caipora",
    description: "Brazilian folk horror, built one hard-earned hit at a time.",
    url: "https://baltazarparra.github.io/caipora/",
  },
  clouds: {
    name: "Clouds.",
    description: "An EP by Baltz.",
    url: "https://open.spotify.com/album/6BFeIsMZ4zcuGbs5cugxLM",
    coverUrl: "/clouds-cover.jpg",
    embedUrl:
      "https://open.spotify.com/embed/album/6BFeIsMZ4zcuGbs5cugxLM?utm_source=generator&theme=0",
  },
  profiles: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/baltazarparra/" },
    { label: "GitHub", url: "https://github.com/baltazarparra" },
    { label: "dev.to", url: "https://dev.to/baltz" },
    {
      label: "Spotify",
      url: "https://open.spotify.com/album/6BFeIsMZ4zcuGbs5cugxLM",
    },
    { label: "itch.io", url: "https://baltazarparra.itch.io/" },
  ],
} as const;
