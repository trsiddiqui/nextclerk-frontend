// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

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

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
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
  console.log('license registered')
  registerLicense(
    'Mgo+DSMBaFt+QHFqVkNrWE5FcEBAXWFKblJ3T2ZZdV13ZCQ7a15RRnVfQV9mS39Rc0VhWHtecQ==;Mgo+DSMBPh8sVXJ1S0d+X1RPckBDW3xLflF1VWJYdVtwflZBcC0sT3RfQF5jSnxWdERhXH9ccndWRw==;ORg4AjUWIQA/Gnt2VFhhQlJBfVtdXGVWfFN0RnNYflR1dF9FZ0wgOX1dQl9gSX1Rc0diW3pecnZRT2E=;MTQ2OTgzNkAzMjMxMmUzMTJlMzMzNWw5RlJGWC9mb25adC9DSXJrcCt5R1R6Y0xEdENnZU52Q1pNZ3ZSTU9wOUk9;MTQ2OTgzN0AzMjMxMmUzMTJlMzMzNVZxaWg1WWVNSDhnL0FwSEw0WC9zTFpyM3QwOUM1WHhkZTFhVDVGRU1nWDA9;NRAiBiAaIQQuGjN/V0d+XU9Hc1RGQmJPYVF2R2BJfl96cVVMY1tBNQtUQF1hSn5QdEBhWH1bcHZWR2dd;MTQ2OTgzOUAzMjMxMmUzMTJlMzMzNVpETGhZeFdjK056WlorR2QyQ1RJOVZ1YVorSzJ0NmIyRUN4cjVnNmVWSXM9;MTQ2OTg0MEAzMjMxMmUzMTJlMzMzNWk4RjFvTnhxL04vOVFIMGVjeTlJZGZka3RkL1hwVEFoUEFjS2ozd0ZFMUE9;Mgo+DSMBMAY9C3t2VFhhQlJBfVtdXGVWfFN0RnNYflR1dF9FZ0wgOX1dQl9gSX1Rc0diW3pecnFcQGE=;MTQ2OTg0MkAzMjMxMmUzMTJlMzMzNWRmeVhoY2wxZS9UOTF0ZG5FekhCOFhQRUpITS9ZcHhhOEVzbTdVOUpwNkk9;MTQ2OTg0M0AzMjMxMmUzMTJlMzMzNWQrazhIS3ExOHhQUzkrUGxDbVVWdENUOUxPaE1hZm5ST0ZOQWZ0SzNLV2s9;MTQ2OTg0NEAzMjMxMmUzMTJlMzMzNVpETGhZeFdjK056WlorR2QyQ1RJOVZ1YVorSzJ0NmIyRUN4cjVnNmVWSXM9'
  )
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

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

      <SettingsProvider>
        <SettingsConsumer>
          {({ settings }) => {
            return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
          }}
        </SettingsConsumer>
      </SettingsProvider>
    </CacheProvider>
  )
}

export default App
