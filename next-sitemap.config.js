/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://docs.dbexpression.com',
    generateRobotsTxt: true,
    generateIndexSitemap: false
  }