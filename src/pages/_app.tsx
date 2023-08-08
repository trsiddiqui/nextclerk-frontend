// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import { registerLicense } from '@syncfusion/ej2-base'
import { Session } from 'next-auth'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  session: Session
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  registerLicense(
    'Mgo+DSMBaFt+QHJqVk1hXk5Hd0BLVGpAblJ3T2ZQdVt5ZDU7a15RRnVfR11kS31QdUBlWnhXdw==;Mgo+DSMBPh8sVXJ1S0R+X1pFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF5jTH5UdEZgWnpYc31QQQ==;ORg4AjUWIQA/Gnt2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtTcUdgWnxbdnBURmc=;MTk2MDU5NUAzMjMxMmUzMjJlMzNKditTcVRNSEU4SWVpam5SbWJHZGVrRW5FRmdaWVpnZ2o1VDgrbzZZbUZvPQ==;MTk2MDU5NkAzMjMxMmUzMjJlMzNkbTFCdDRTdzU0dTltUjgvVG5Ud2JldkRNREltcFJRTVhZOGdFZXFHd1JNPQ==;NRAiBiAaIQQuGjN/V0d+Xk9HfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5WdkJhWnxddXJRTmhb;MTk2MDU5OEAzMjMxMmUzMjJlMzNPVWNORnZIc0xsWGljamRkMEdYbFhBUmdtY0cxZTJReXI2SEhoSXM5eTl3PQ==;MTk2MDU5OUAzMjMxMmUzMjJlMzNtTkJTZFErMW52bEw0Y2NVWDVZc2d0TzhUMXJQK3ZDTnJtNmFXdncvN1NNPQ==;Mgo+DSMBMAY9C3t2VFhiQlJPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtTcUdgWnxbdnFSRGk=;MTk2MDYwMUAzMjMxMmUzMjJlMzNGMTYzY2xTQUE3RjlvUlVxaDhtUVBqRnBEYVc2WUo3dG1sVGsrcjBRNnVZPQ==;MTk2MDYwMkAzMjMxMmUzMjJlMzNNNU90TElvSHRFQTdvTU1nNEo1eEE2N2JaWUd2QldZb3k5Wm5LMkJOOEV3PQ==;MTk2MDYwM0AzMjMxMmUzMjJlMzNPVWNORnZIc0xsWGljamRkMEdYbFhBUmdtY0cxZTJReXI2SEhoSXM5eTl3PQ=='
  )
  console.log('license registered')
  const { Component, emotionCache = clientSideEmotionCache, pageProps, session } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName}`}</title>
        <meta name='description' content={`${themeConfig.templateName}`} />
        <meta name='keywords' content='NextClerk' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <SessionProvider session={session}>
        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => {
              return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </SessionProvider>
    </CacheProvider>
  )
}

export default App
