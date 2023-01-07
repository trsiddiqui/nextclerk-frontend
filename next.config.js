const path = require('path')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  basePath: '/nextclerk-frontend',
  assetPrefix: isProd ? '/nextclerk-frontend' : '',
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: false,
    jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
