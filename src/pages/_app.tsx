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
    'Mgo+DSMBaFt/QHRqVVhkVFpAaV5EQmFJfFBmRGJTel56d1JWESFaRnZdQV1gSHlSdEZrWHpcdHNW;Mgo+DSMBPh8sVXJ0S0J+XE9AflRGQmJPYVF2R2BJfl96cVVMY1tBNQtUQF1hSn5Qd0JiW3xWcXFXQGJf;ORg4AjUWIQA/Gnt2VVhkQlFacldJWXxIeEx0RWFab19xflBGal9WVAciSV9jS31TdURkWH1deHVQRGdbUg==;MTM2MDQzNUAzMjMwMmUzNDJlMzBLbm54WTdkTlVCMXJZRXZlU1N2S1Y3SU9MNHJaY0V1WWMwOXd0NzNjUVYwPQ==;MTM2MDQzNkAzMjMwMmUzNDJlMzBFcnVpdGtOMURqaVJ3TkREaVg4NkhUL0RqZFV1UmpRV2RCRUY0aVNJNXc0PQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFtKVmdWf1VpR2NbfE5xdV9DYFZSQ2YuP1ZhSXxQdkZiXn5cc3xUQ2NbUEM=;MTM2MDQzOEAzMjMwMmUzNDJlMzBGWGNrWkNrbzcyaDgwd05Hazd2cVZaZU42K3krdktLdmVBZmNVaGNLTEVFPQ==;MTM2MDQzOUAzMjMwMmUzNDJlMzBRRVJENFV3M0gvK21yVEVSKzBCZ2VzL2czbDZmbURRWjhJc0xRSDZkdHN3PQ==;Mgo+DSMBMAY9C3t2VVhkQlFacldJWXxIeEx0RWFab19xflBGal9WVAciSV9jS31TdURkWH1deHVQQmNcWQ==;MTM2MDQ0MUAzMjMwMmUzNDJlMzBCMTQwZVcwQzJ5d1FOcnMzMWN5MExvUkxkMG9XS01lSjdzY2F5a2FNKzNJPQ==;MTM2MDQ0MkAzMjMwMmUzNDJlMzBUcUhLbWpRYUJ3YjBUUVVBUW13YnBWT2J3M0xvRlVHZ1E5K2VOZmIzVllBPQ==;MTM2MDQ0M0AzMjMwMmUzNDJlMzBGWGNrWkNrbzcyaDgwd05Hazd2cVZaZU42K3krdktLdmVBZmNVaGNLTEVFPQ=='
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
