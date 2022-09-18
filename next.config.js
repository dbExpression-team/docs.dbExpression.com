const withMarkdoc = require('@markdoc/next.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md'],
  experimental: {
    newNextLinkBehavior: true,
    scrollRestoration: true,
    images: {
      allowFutureImage: true,
    },
  },
  async redirects() {
    return [
      {
        source: '/MsSql/Versions',
        destination: '/mssql/versions',
        permanent: true
      },
      {
        source: '/rtd/:slug*',
        destination: '/:slug*',
        permanent: false
      }
    ]
  }
}

//module.exports = withMarkdoc()(nextConfig)
module.exports = withMarkdoc({mode: 'static'})(nextConfig)
