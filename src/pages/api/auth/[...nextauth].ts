import NextAuth from 'next-auth'
import { Account, AuthOptions } from 'next-auth/core/types'
import { JWT } from 'next-auth/jwt'
import KeycloakProvider from 'next-auth/providers/keycloak'
import { signOut } from 'next-auth/react'

// import GitHubProvider from 'next-auth/providers/github'

const clientId = 'nextclerk'
const clientSecret = 'uvmAPUcHKYG9ZZXsymO9QP3rFAPPmLhF'
const host = 'https://auth.nextclerk.com'
async function refreshAccessToken(token: JWT & Account) {
  try {
    const url = `${host}/realms/${clientId}/protocol/openid-connect/token`

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

    // console.log('REFRESHED', refreshedTokens)
    if (!response.ok) {
      throw refreshedTokens
    }

    const returnObject = {
      ...token,
      access_token: refreshedTokens.access_token,
      expires_at: Math.trunc(new Date().getTime() / 1000) + refreshedTokens.expires_in,
      refresh_token: refreshedTokens.refresh_token ?? token.refreshToken // Fall back to old refresh token
    }

    // console.log('RETURN', returnObject)

    return returnObject
  } catch (error) {
    console.error('TOKEN REFRESH ERROR', error)

    await signOut()

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

      // deepcode ignore HardcodedNonCryptoSecret: <please specify a reason of ignoring this>
      clientSecret: clientSecret,
      issuer: `${host}/realms/${clientId}`,
      authorization: `${host}/realms/${clientId}/protocol/openid-connect/auth`,
      accessTokenUrl: `${host}/realms/${clientId}/protocol/openid-connect/token`,
      profileUrl: `${host}/realms/${clientId}/protocol/openid-connect/userinfo`
    })
  ],
  debug: true,
  callbacks: {
    async jwt({ token, account, user, profile }) {
      if (account && user) {
        // token = Object.assign({}, token, { account, user, profile, session })
        return {
          ...token,
          ...account,
          ...profile
        }
      }

      // console.log(new Date(), new Date((token?.expires_at as number) * 1000))

      // // Return previous token if the access token has not expired yet
      if (new Date() < new Date((token?.expires_at as number) * 1000)) {
        return {
          ...token,
          ...account,
          ...profile
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

const nextAuth = NextAuth(authOptions)
export default nextAuth
