export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'

export const isClient = typeof document !== 'undefined'
export const isServer = !isClient

if (typeof process.env.NEXT_PUBLIC_SITE_URL !== 'string') {
  throw new Error(
    `Please set the NEXT_PUBLIC_SITE_URL environment variable to your site's URL.
    
1. Create .env file at the root of your project.
2. Add NEXT_PUBLIC_SITE_URL=http://localhost:3000
3. For other environments (like production), make sure you set the correct URL.
    `
  )
}

export const siteURL = new URL(process.env.NEXT_PUBLIC_SITE_URL)
export const siteOrigin = siteURL.origin

// we like putting this in the JavaScript console,
// as our signature.
// you can delete it if not needed.
export const style = 'font-family: Grotesque; color: white; font-size: 1rem;'
export const consoleLog = `        
TAL HAYUT

https://github.com/tool3
https://linkedin.com/in/talhayut
`

export const gaTrackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID
