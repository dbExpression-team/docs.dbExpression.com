const withMarkdoc = require('@markdoc/next.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'md'],
  async redirects() {
    return [
      {
        source: '/MsSql/Versions',
        destination: '/mssql/versions',
        permanent: true
      },
      {
        source: '/rtd/reference/mssql/:path*',
        destination: '/reference/mssql/:path*',
        permanent: false
      }
    ]
  }
}

module.exports = withMarkdoc({mode: 'static'})(nextConfig)