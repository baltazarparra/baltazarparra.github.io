module.exports = {
  ci: {
    collect: {
      chromePath: process.env.CHROME_PATH || undefined,
      staticDistDir: "./dist",
      url: ["http://localhost/"],
      numberOfRuns: 3,
      settings: {
        chromeFlags:
          "--headless=new --no-sandbox --disable-dev-shm-usage --enable-unsafe-swiftshader",
        maxWaitForLoad: 10000,
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.8 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:best-practices": ["error", { minScore: 1 }],
        "categories:seo": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./.lighthouseci",
    },
  },
};
