module.exports = {
  siteMetadata: {
    title: 'Baltazar Parra',
    description: 'A blog about frontend developement, focus on user experience.',
    author: '@baltazarparra',
    siteUrl: 'https://baltazarparra.github.io'
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-prefetch-google-fonts',
      options: {
        fonts: [
          {
            family: 'Sedgwick Ave Display',
            variants: ['400', '700']
          },
          {
            family: 'Open Sans',
            variants: ['300', '400', '800']
          }
        ]
      }
    },
    'gatsby-plugin-styled-components',
    'gatsby-plugin-transition-link',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/posts`
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: []
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'baltazar parra',
        short_name: 'baltazarparra',
        start_url: '/',
        background_color: '#0D2834',
        theme_color: '#0D2834',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png' // This path is relative to the root of the site.
      }
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: 'UA-168126024-1',
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Avoids sending pageview hits from custom paths
        exclude: ['/preview/**', '/do-not-track/me/too/'],
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,
        // Defers execution of google analytics script after page load
        defer: false,
        // Any additional optional fields
        sampleRate: 5,
        siteSpeedSampleRate: 10
      }
    }
  ]
}
