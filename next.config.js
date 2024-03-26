const withMarkdoc = require('@markdoc/next.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/docs.dbExpression.com",
  reactStrictMode: true,
  images: { unoptimized: true },
}

//module.exports = withMarkdoc()(nextConfig)
module.exports = withMarkdoc({mode: 'static'})(nextConfig)
