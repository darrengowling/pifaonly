import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { useEffect } from 'react'

// Analytics initialization (add your analytics ID)
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize analytics
    if (typeof window !== 'undefined' && GA_TRACKING_ID) {
      // Google Analytics 4
      window.gtag('config', GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp