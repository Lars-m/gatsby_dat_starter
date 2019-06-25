const config = require('./config.js');
module.exports = {
  siteMetadata: {...config},
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`
      }
    },
    `gatsby-plugin-emotion`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-prismjs`]
      }
    },
    //`gatsby-plugin-typography`,{
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`
      }
    },
    `gatsby-plugin-catch-links`,  //Allows navigation-links in md-files without the need for a page-refresh

    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-external-links",
            options: {
              target: "_blank"
              //rel: "nofollow"
            }
          },
          "gatsby-remark-copy-linked-files",
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 1000
            },
          },
          {
            resolve: "gatsby-remark-emoji",
            options: {
              size: 24
            }
          }
        ]
      }
    },
    
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "DAT 3. Semester Fall 2010",
        short_name: "DAT3-f2019",
        start_url: "/",
        background_color: "#6b37bf",
        theme_color: "#295683",
        // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
        // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
        display: "standalone",
        icon: "src/images/logo.png" // This path is relative to the root of the site.
      }
    },
    "gatsby-plugin-offline",
    "class-info",
    "learning-goals",
  ]
};
