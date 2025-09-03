import React from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ 
  children, 
  title = "Friends of PIFA - IPL-Style Football Auctions",
  description = "IPL-style football auctions with exclusive player ownership for small friend groups. Build your dream team, bid on Champions League teams, and compete with friends!",
  canonical,
  image = "/images/og-image.jpg",
  type = "website"
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://friendsofpifa.com'
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl
  const fullImageUrl = `${siteUrl}${image}`

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="keywords" content="fantasy football, football auction, IPL auction, friends league, football draft, soccer auction, Champions League fantasy, Europa League, sports betting, football game" />
        <meta name="author" content="Friends of PIFA" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={fullUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullImageUrl} />
        <meta property="og:site_name" content="Friends of PIFA" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={fullUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullImageUrl} />
        <meta name="twitter:creator" content="@friendsofpifa" />
        
        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1d4ed8" />
        
        {/* Structured Data for Sports App */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Friends of PIFA",
              "url": siteUrl,
              "description": description,
              "applicationCategory": "SportsApplication",
              "operatingSystem": "Web Browser",
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "author": {
                "@type": "Organization",
                "name": "Friends of PIFA"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Layout