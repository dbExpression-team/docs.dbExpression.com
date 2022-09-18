import Head from 'next/head'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import { Layout } from '@/components/Layout'
import Script from 'next/script'
import 'focus-visible'
import '@/styles/tailwind.css'
import '@/styles/app.css'

function getNodeText(node) {
  let text = ''
  for (let child of node.children ?? []) {
    if (typeof child === 'string') {
      text += child
    }
    text += getNodeText(child)
  }
  return text
}

function collectHeadings(nodes, slugify = slugifyWithCounter()) {
  let sections = []

  for (let node of nodes) {
    if (node.name === 'h2' || node.name === 'h3') {
      let title = getNodeText(node)
      if (title) {
        let id = slugify(title)
        node.attributes.id = id
        if (node.name === 'h3') {
          if (!sections[sections.length - 1]) {
            throw new Error(
              'Cannot add `h3` to table of contents without a preceding `h2`'
            )
          }
          sections[sections.length - 1].children.push({
            ...node.attributes,
            title,
          })
        } else {
          sections.push({ ...node.attributes, title, children: [] })
        }
      }
    }

    sections.push(...collectHeadings(node.children ?? [], slugify))
  }

  return sections
}

export default function App({ Component, pageProps }) {
  let title = pageProps.markdoc?.frontmatter.title

  let pageTitle =
    pageProps.markdoc?.frontmatter.pageTitle ||
    `${pageProps.markdoc?.frontmatter.title} - Docs`

  let description = pageProps.markdoc?.frontmatter.description

  let tableOfContents = pageProps.markdoc?.content
    ? collectHeadings(pageProps.markdoc.content)
    : []

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:image" content="/dbexpression-og-image.png" />
        <meta property="twitter:image" content="/dbexpression-twitter-image.png" />
      </Head>
      <Script key="ga-script" strategy='afterInteractive' src="https://www.googletagmanager.com/gtag/js?id=G-BND29F2QPK" />
      <Script id="ga-script-local" strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-BND29F2QPK');
        `}
      </Script>
      <Layout title={title} tableOfContents={tableOfContents} >
        <Component {...pageProps} />
      </Layout>
    </>
  )
}
