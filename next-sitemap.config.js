/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://dbexpression.com',
    generateRobotsTxt: true,
    generateIndexSitemap: false
  }