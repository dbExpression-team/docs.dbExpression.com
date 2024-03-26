import { Head, Html, Main, NextScript } from 'next/document'
import { useEffect, useState } from "react";

const themeScript = `
  let mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  function updateTheme(savedTheme) {
    let theme = 'system'
    try {
      if (!savedTheme) {
        savedTheme = window.localStorage.theme
      }
      if (savedTheme === 'dark') {
        theme = 'dark'
        document.documentElement.classList.add('dark')
      } else if (savedTheme === 'light') {
        theme = 'light'
        document.documentElement.classList.remove('dark')
      } else if (mediaQuery.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch {
      theme = 'light'
      document.documentElement.classList.remove('dark')
    }
    return theme
  }

  function updateThemeWithoutTransitions(savedTheme) {
    updateTheme(savedTheme)
    document.documentElement.classList.add('[&_*]:!transition-none')
    window.setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none')
    }, 0)
  }

  document.documentElement.setAttribute('data-theme', updateTheme())

  new MutationObserver(([{ oldValue }]) => {
    let newValue = document.documentElement.getAttribute('data-theme')
    if (newValue !== oldValue) {
      try {
        window.localStorage.setItem('theme', newValue)
      } catch {}
      updateThemeWithoutTransitions(newValue)
    }
  }).observe(document.documentElement, { attributeFilter: ['data-theme'], attributeOldValue: true })

  mediaQuery.addEventListener('change', updateThemeWithoutTransitions)
  window.addEventListener('storage', updateThemeWithoutTransitions)
`

const getFaviconPath = (isDarkMode = false) => {
  return `/logos/${isDarkMode ? "dark" : "light"}/`;
};

export default function Document() {
  const [faviconHref, setFaviconHref] = useState(`/logos/light/`);

  useEffect(() => {
    // Get current color scheme.
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    // Set favicon initially.
    setFaviconHref(getFaviconPath(matcher.matches));
    // Change favicon if the color scheme changes.
    matcher.onchange = () => setFaviconHref(getFaviconPath(matcher.matches));
  }, [faviconHref]);

  return (
    <Html className="antialiased [font-feature-settings:'ss01']" lang="en">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta property="og:image" content="/dbex-og.png" />
        <meta property="twitter:image" content="/dbex-twitter.png" />
        {/* <link rel="icon" type="image/png" sizes="16x16" href="/logos/light/favicon-16x16.png" /> */}
        <link rel="icon" type="image/png" sizes="16x16" href={faviconHref.concat("favicon-16x16.png")} />
        <link rel="icon" type="image/png" sizes="32x32" href={faviconHref.concat("favicon-32x32.png")} />
        {/* <link rel="icon" type="image/png"  sizes="48x48" href={faviconHref.concat("favicon-48x48.png")} />
        <link rel="apple-touch-icon" sizes="180x180" href={faviconHref.concat("apple-touch-icon.png")} /> */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Lexend:wght@400;500&display=swap"
        />
      </Head>
      <body className="bg-white dark:bg-slate-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
