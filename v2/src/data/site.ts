export const site = {
  canonicalUrl: "https://baltz.dev/",
  fullName: "Baltazar Parra",
  shortName: "Baltz",
  title: "Baltz | AI-native engineer, game maker and musician",
  description:
    "Baltz designs software with code agents, writes about engineering, makes games and records music.",
  navigation: [
    { label: "Work", href: "#work" },
    { label: "Caipora", href: "#caipora" },
    { label: "Elsewhere", href: "#elsewhere" },
  ],
  hero: {
    eyebrow: "AI-native engineer",
    name: "baltz.",
    statement: "Software, systems and small worlds.",
    support:
      "I design software with code agents, then write, make games and record music.",
  },
  about: {
    heading: "I design software with code agents as architectural components.",
    body: "The rest is a decade of shipping difficult things with teams.",
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
    coverUrl:
      "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e022e3ffa46097b7171b02c7176",
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
