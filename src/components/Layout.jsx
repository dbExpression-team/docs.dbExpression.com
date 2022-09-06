import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { MobileNavigation } from '@/components/MobileNavigation'
import { Navigation } from '@/components/Navigation'
import { Prose } from '@/components/Prose'
import { Search } from '@/components/Search'
import { ThemeSelector } from '@/components/ThemeSelector'
import { DbExLogo } from '@/components/DbExLogo'
import { DbExMascot } from '@/components/DbExMascot'
import { GitHubIcon } from '@/components/GitHubIcon'
import { Footer }  from "@/components/Footer";

const navigation = [
	{ 
		'title': 'dbExpression',
		'links': [
			{ 'title':'Why dbExpression?', 'href': '/' }
		]
	},
	{ 
		'title': 'Getting Started', 
		'links': [
			{ 'title':'Up and Running in 10 Minutes', 'href': '/introduction/getting-started' },
			{ 'title':'Sync and Async Execution', 'href': '/introduction/sync-and-async' },
			{ 'title':'ASP.NET', 'href': '/introduction/aspnet' },
			{ 'title':'Dependency Injection', 'href': '/introduction/dependency-injection' },
      { 'title':'Supported Versions', 'href': '/mssql/versions' }
		]
	},
	{
		'title': 'Basic Queries', 
		'links': [
			{ 'title':'Select, Update, Insert, Delete', 'href': '/basic-query-topics/basic-query-expressions' },
			{ 'title':'Joins', 'href': '/basic-query-topics/joins' },
			{ 'title':'Order By', 'href': '/basic-query-topics/order-by' },
			{ 'title':'Group By', 'href': '/basic-query-topics/group-by' },
			{ 'title':'Having', 'href': '/basic-query-topics/having' },
			{ 'title':'In', 'href': '/basic-query-topics/in' },
			{ 'title':'Top', 'href': '/basic-query-topics/top' },
			{ 'title':'Offset and Limit (Pagination)', 'href': '/basic-query-topics/offset-and-limit' },
			{ 'title':'Union and Union All', 'href': '/basic-query-topics/union-and-union-all' }
		]
	},
	{
		'title': 'Advanced Queries', 
		'links': [
			{ 'title':'Arithmetic', 'href': '/advanced-query-topics/arithmetic' },
			{ 'title':'String Concatenation', 'href': '/advanced-query-topics/string-concatenation' },
			{ 'title':'Database Functions', 'href': '/advanced-query-topics/functions' },
			{ 'title':'Aggregate Database Functions', 'href': '/advanced-query-topics/aggregate-functions' },
			{ 'title':'Subqueries', 'href': '/advanced-query-topics/subqueries' },
			{ 'title':'Views', 'href': '/advanced-query-topics/views' },
			{ 'title':'Null Handling', 'href': '/advanced-query-topics/null-handling' },
			{ 'title':'Enums', 'href': '/advanced-query-topics/enums' },
			{ 'title':'Multiple Schemas', 'href': '/advanced-query-topics/multiple-schemas' },
			{ 'title':'Multiple Databases', 'href': '/advanced-query-topics/multiple-databases' }
		]
	},
	{
		'title': 'Aliasing', 
		'links': [
			{ 'title':'Column Aliasing', 'href': '/aliasing/column' },
			{ 'title':'Table Aliasing', 'href': '/aliasing/table' },
			{ 'title':'Subquery Aliasing', 'href': '/aliasing/subquery' },
			{ 'title':'Element Composition Aliasing', 'href': '/aliasing/composition' }
		]
	},
	{
		'title': 'Filter Expressions', 
		'links': [
			{ 'title':'Types of Filter Expressions', 'href': '/filters/supported-expressions' },
			{ 'title':'Comparison Expressions', 'href': '/filters/comparison-expressions' },
			{ 'title':'Logical Expressions', 'href': '/filters/logical-expressions' },
			{ 'title':'Filter Expressions', 'href': '/filters/filter-expressions' }
		]
	},
	{
		'title': 'Stored Procedures', 
		'links': [
			{ 'title':'Query Expressions', 'href': '/stored-procedures/stored-procedures' },
			{ 'title':'Execution', 'href': '/stored-procedures/executing' }
		]
	},
	{
		'title': 'Connections and Transactions', 
		'links': [
			{ 'title':'Connections', 'href': '/connections/connections' },
			{ 'title':'Transactions', 'href': '/connections/transactions' }
		]
	},
	{
		'title': 'Utilities', 
		'links': [
			{ 'title':'dbex', 'href': '/utilities/dbex' },
			{ 'title':'Logging', 'href': '/utilities/logging' }
		]
	},
	{
		'title': 'Scaffold Configuration', 
		'links': [
			{ 'title':'Scaffolding Configuration', 'href': '/advanced-scaffolding/scaffolding-configuration' },
			{ 'title':'Applying Overrides', 'href': '/advanced-scaffolding/applying-overrides' },
			{ 'title':'Enums', 'href': '/advanced-scaffolding/enums' }
		]
	},
	{
		'title': 'Runtime Configuration', 
		'links': [
			{ 'title':'Runtime Configuration', 'href': '/runtime-configuration/runtime-configuration' },
			{ 'title':'Factories and Services', 'href': '/runtime-configuration/factories' },
			{ 'title':'Assembly', 'href': '/runtime-configuration/assembly' },
			{ 'title':'Execution', 'href': '/runtime-configuration/execution' },
			{ 'title':'Events', 'href': '/runtime-configuration/events' },
			{ 'title':'Enums', 'href': '/runtime-configuration/enums' },
			{ 'title':'Dependency Injection', 'href': '/runtime-configuration/dependency-injection' },
			{ 'title':'Static use of dbExpression', 'href': '/runtime-configuration/static-database' }
		]
	},
	{
		'title': 'Query Execution Pipelines', 
		'links': [
			{ 'title':'Query Execution', 'href': '/query-execution-pipelines/query-execution-pipelines' },
			{ 'title':'Pipeline Events', 'href': '/query-execution-pipelines/events' },
			{ 'title':'Select Pipeline', 'href': '/query-execution-pipelines/select-execution-pipeline' },
			{ 'title':'Insert Pipeline', 'href': '/query-execution-pipelines/insert-execution-pipeline' },
			{ 'title':'Update Pipeline', 'href': '/query-execution-pipelines/update-execution-pipeline' },
			{ 'title':'Delete Pipeline', 'href': '/query-execution-pipelines/delete-execution-pipeline' },
			{ 'title':'Stored Procedure Pipeline', 'href': '/query-execution-pipelines/stored-procedure-execution-pipeline' }
		]
	}
]

function Header({ navigation }) {
  let [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll, { passive: true })
    }
  }, [])

 return (
    <header
      className={clsx(
        'sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8',
        isScrolled
          ? 'dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
          : 'dark:bg-transparent'
      )}
    >
      <div className="mr-6 flex lg:hidden">
        <MobileNavigation navigation={navigation} />
      </div>
      {/* <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
        <Search />
      </div> */}
      <div className="relative flex md:flex-grow items-center h-12 min-h-full">
        <div className="relative flex hidden md:visible md:block basis-0 justify-start gap-6 sm:gap-8 md:flex-grow">
          <Link href="/" className="group" aria-label="dbExpression">
            <DbExMascot className="h-6 w-6" />
            <DbExLogo className="h-6 w-6" />
          </Link>
        </div>
        <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow">
          <ThemeSelector className="relative z-10" />
          <Link href="https://github.com/HatTrickLabs/dbExpression" className="group" aria-label="GitHub">
            <GitHubIcon className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" />
          </Link>
        </div>
      </div>
    </header>
  )
}

function useTableOfContents(tableOfContents) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id)

  let getHeadings = useCallback((tableOfContents) => {
    return tableOfContents
      .flatMap((node) => [node.id, ...node.children.map((child) => child.id)])
      .map((id) => {
        let el = document.getElementById(id)
        if (!el) return

        let style = window.getComputedStyle(el)
        let scrollMt = parseFloat(style.scrollMarginTop)

        let top = window.scrollY + el.getBoundingClientRect().top - scrollMt
        return { id, top }
      })
  }, [])

  useEffect(() => {
    if (tableOfContents.length === 0) return
    let headings = getHeadings(tableOfContents)
    function onScroll() {
      let top = window.scrollY
      let current = headings[0].id
      for (let heading of headings) {
        if (top >= heading.top) {
          current = heading.id
        } else {
          break
        }
      }
      setCurrentSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll, { passive: true })
    }
  }, [getHeadings, tableOfContents])

  return currentSection
}

export function Layout({ children, title, tableOfContents }) {
  let router = useRouter()
  let allLinks = navigation.flatMap((section) => section.links)
  let linkIndex = allLinks.findIndex((link) => link.href === router.pathname)
  let previousPage = allLinks[linkIndex - 1]
  let nextPage = allLinks[linkIndex + 1]
  let section = navigation.find((section) =>
    section.links.find((link) => link.href === router.pathname)
  )
  let currentSection = useTableOfContents(tableOfContents)

  function isActive(section) {
    if (section.id === currentSection) {
      return true
    }
    if (!section.children) {
      return false
    }
    return section.children.findIndex(isActive) > -1
  }

  return (
    <>
      <Header navigation={navigation} />

      <div className="relative mx-auto flex max-w-8xl justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
          <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto pb-16 pt-4 pl-0.5 scrollbar">
            <div className="absolute top-16 bottom-0 right-0 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
            <div className="absolute top-28 bottom-0 right-0 hidden w-px bg-slate-800 dark:block" />
            <Navigation
              navigation={navigation}
              className="w-64 pr-8 xl:w-72 xl:pr-16"
            />
          </div>
        </div>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
          <article>
            {(title || section) && (
              <header className="mb-9 space-y-1">
                {section && (
                  <p className="font-display text-sm font-medium text-sky-500">
                    {section.title}
                  </p>
                )}
                {title && (
                  <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
                    {title}
                  </h1>
                )}
              </header>
            )}
            <Prose>{children}</Prose>
          </article>
          <dl className="mt-12 mb-12 flex pt-6">
            {previousPage && (
              <div>
                <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                  Previous
                </dt>
                <dd className="mt-1">
                  <Link
                    href={previousPage.href}
                    className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <span aria-hidden="true">&larr;</span> {previousPage.title}
                  </Link>
                </dd>
              </div>
            )}
            {nextPage && (
              <div className="ml-auto text-right">
                <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                  Next
                </dt>
                <dd className="mt-1">
                  <Link
                    href={nextPage.href}
                    className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    {nextPage.title} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </dd>
              </div>
            )}
          </dl>
          <div className="border-t border-slate-200 pt-12 dark:border-slate-800"></div>
          <Footer />        
        </div>

        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
          <nav aria-labelledby="on-this-page-title" className="w-56">
            {tableOfContents.length > 0 && (
              <>
                <h2
                  id="on-this-page-title"
                  className="font-display text-sm font-medium text-slate-900 dark:text-white"
                >
                  On this page
                </h2>
                <ol role="list" className="mt-4 space-y-3 text-sm">
                  {tableOfContents.map((section) => (
                    <li key={section.id}>
                      <h3>
                        <Link
                          href={`#${section.id}`}
                          className={clsx(
                            isActive(section)
                              ? 'text-sky-500'
                              : 'font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                          )}
                        >
                          {section.title}
                        </Link>
                      </h3>
                      {section.children.length > 0 && (
                        <ol
                          role="list"
                          className="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400"
                        >
                          {section.children.map((subSection) => (
                            <li key={subSection.id}>
                              <Link
                                href={`#${subSection.id}`}
                                className={
                                  isActive(subSection)
                                    ? 'text-sky-500'
                                    : 'hover:text-slate-600 dark:hover:text-slate-300'
                                }
                              >
                                {subSection.title}
                              </Link>
                            </li>
                          ))}
                        </ol>
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}
