// ** React Import
import { Children } from 'react'

// ** Next Import
import Document, { Html, Head, Main, NextScript } from 'next/document'

// ** Emotion Imports
import createEmotionServer from '@emotion/server/create-instance'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

class CustomDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
          />
          <link rel='shortcut icon' href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/favicon.png`} />
          <link
            rel='apple-touch-icon'
            sizes='57x57'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/apple-icon-57x57.png`}
          />
          <link
            rel='apple-touch-icon'
            sizes='60x60'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/apple-icon-60x60.png`}
          />
          <link
            rel='apple-touch-icon'
            sizes='72x72'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/apple-icon-72x72.png`}
          />
          <link
            rel='apple-touch-icon'
            sizes='76x76'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/apple-icon-76x76.png`}
          />
          <link
            rel='apple-touch-icon'
            sizes='114x114'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/apple-icon-114x114.png`}
          />
          <link
            rel='apple-touch-icon'
            sizes='120x120'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/apple-icon-120x120.png`}
          />
          <link
            rel='apple-touch-icon'
            sizes='144x144'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/apple-icon-144x144.png`}
          />
          <link
            rel='apple-touch-icon'
            sizes='152x152'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/apple-icon-152x152.png`}
          />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/apple-icon-180x180.png`}
          />
          <link
            rel='icon'
            type='image.png'
            sizes='192x192'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/android-icon-192x192.png`}
          />
          <link
            rel='icon'
            type='image.png'
            sizes='32x32'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/favicon-32x32.png`}
          />
          <link
            rel='icon'
            type='image.png'
            sizes='96x96'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/favicon-96x96.png`}
          />
          <link
            rel='icon'
            type='image.png'
            sizes='16x16'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/favicon-16x16.png`}
          />
          <link
            rel='manifest'
            href={`${process.env.NODE_ENV === 'production' ? '' : ''}/images/manifest.json' />
          <meta name='msapplication-TileColor' content='#ffffff' />
          <meta name='msapplication-TileImage' content='/ms-icon-144x144.png`}
          />
          <meta name='theme-color' content='#ffffff'></meta>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

CustomDocument.getInitialProps = async ctx => {
  const originalRenderPage = ctx.renderPage
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props =>
        (
          <App
            {...props} // @ts-ignore
            emotionCache={cache}
          />
        )
    })

  const initialProps = await Document.getInitialProps(ctx)
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map(style => {
    return (
      <style
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
      />
    )
  })

  return {
    ...initialProps,
    styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags]
  }
}

export default CustomDocument
