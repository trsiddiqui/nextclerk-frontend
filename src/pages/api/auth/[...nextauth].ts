import NextAuth from 'next-auth'
import { Account, AuthOptions } from 'next-auth/core/types'
import { JWT } from 'next-auth/jwt'
import KeycloakProvider from 'next-auth/providers/keycloak'

// import GitHubProvider from 'next-auth/providers/github'

const clientId = 'nextclerk'
const clientSecret = 'uvmAPUcHKYG9ZZXsymO9QP3rFAPPmLhF'
const host = 'http://localhost' // process.env.NODE_ENV === 'production' ? 'http://test.nextclerk.com' : 'http://localhost'
console.log('using', host)
console.log(process.env.NEXTAUTH_URL)
async function refreshAccessToken(token: JWT & Account) {
  try {
    // console.log('REFRESHING', token)
    const url = `${host}:8086/realms/${clientId}/protocol/openid-connect/token`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token!
      })
    })

    const refreshedTokens = await response.json()

    console.log('REFRESHED', refreshedTokens)
    console.log(Math.trunc(new Date().getTime() / 1000) + refreshedTokens.expires_in)
    if (!response.ok) {
      throw refreshedTokens
    }

    const returnObject = {
      ...token,
      access_token: refreshedTokens.access_token,
      expires_at: Math.trunc(new Date().getTime() / 1000) + refreshedTokens.expires_in,
      refresh_token: refreshedTokens.refresh_token ?? token.refreshToken // Fall back to old refresh token
    }
    console.log('RETURN', returnObject)

    return returnObject
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    KeycloakProvider({
      clientId: clientId,
      clientSecret: clientSecret,
      issuer: `${process.env.NEXTAUTH_URL}:8086/realms/${clientId}`
    })

    // GitHubProvider({
    //   clientId: '49c824b1db9fc7ccaf00',
    //   clientSecret: '0797c08596ae65085af5dfcd0a866089c2e8992b'
    // })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        // token = Object.assign({}, token, { account, user, profile, session })
        return {
          ...token,
          ...account
        }
      }

      // console.log('JWT', { token, account, user, profile, session })
      console.log(new Date(), new Date((token?.expires_at as number) * 1000))

      // // Return previous token if the access token has not expired yet
      if (new Date() < new Date((token?.expires_at as number) * 1000)) {
        return {
          ...token,
          ...account
        }
      }

      let arg: JWT & Account = {
        providerAccountId: '',
        provider: 'keycloak',
        type: 'oauth',
        ...token
      }
      if (account) {
        arg = {
          ...arg,
          ...token
        }
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(arg)
    },
    async session({ session, token, user }) {
      if (session) {
        session = Object.assign({}, session, { token, user })
      }

      return session
    }
  }
}
export default NextAuth(authOptions)
