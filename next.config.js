const path = require('path')

module.exports = {
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
  },
  rewrites: () => {
    return [
      {
        source: '/excel5',
        destination: 'https://www.fssu.ie/app/uploads/2022/02/VSS-Budget-Template-2022-2023-NON-DEIS-21.06.22.xlsx'
      }
    ]
  }
}
