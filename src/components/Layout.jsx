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

const current_language = 'mssql'

const navigation = [
	{ 
		'title': 'Getting Started',
    'icon': 'terminal',
		'links': [
      { 'title':'Why dbExpression?', 'href': '/' },
			{ 'title':'Up and Running in 10 Minutes', 'href': '/getting-started' },
			{ 'title':'Sync and Async Execution', 'href': '/getting-started/sync-and-async' },
			{ 'title':'ASP.NET', 'href': '/getting-started/aspnet' },
			{ 'title':'Dependency Injection', 'href': '/getting-started/dependency-injection' },
      { 'title':'Supported Versions', 'href': '/reference/mssql/versions' }
		]
	},
	{
		'title': 'Core Concepts',
    'icon': 'box',
		'links': [
			{
        'title': 'Basic Queries', 
        'href': '/core-concepts/basics' , 
        'behaviour':'expandable', 
        'links': [
          { 'title':'Select Statements', 'href': '/core-concepts/basics/select-statement' },
          { 'title':'Insert Statements', 'href': '/core-concepts/basics/insert-statement' },
          { 'title':'Update Statements', 'href': '/core-concepts/basics/update-statement' },
          { 'title':'Delete Statements', 'href': '/core-concepts/basics/delete-statement' },
          { 'title':'Joins', 'href': '/core-concepts/basics/join' },
          { 'title':'Order By', 'href': '/core-concepts/basics/order-by' },
          { 'title':'Group By', 'href': '/core-concepts/basics/group-by' },
          { 'title':'Having', 'href': '/core-concepts/basics/having' },
          { 'title':'In', 'href': '/core-concepts/basics/in' },
          { 'title':'Top', 'href': '/core-concepts/basics/top' },
          { 'title':'Like', 'href': '/core-concepts/basics/like' },
          { 'title':'Offset and Limit (Pagination)', 'href': '/core-concepts/basics/offset-and-limit' },
          { 'title':'Union and Union All', 'href': '/core-concepts/basics/union-and-union-all' }
        ]
      },
      {
        'title': 'Advanced Queries', 
        'href': '/core-concepts/advanced' , 
        'behaviour':'expandable', 
        'links': [
          { 'title':'Database Functions', 'href': '/core-concepts/advanced/functions' },
          { 'title':'Arithmetic', 'href': '/core-concepts/advanced/arithmetic' },
          { 'title':'Subqueries', 'href': '/core-concepts/advanced/subqueries' },
          { 'title':'Views', 'href': '/core-concepts/advanced/views' },
          { 'title':'Null Handling', 'href': '/core-concepts/advanced/null-handling' },
          { 'title':'Enums', 'href': '/core-concepts/advanced/enums' },
          { 'title':'Multiple Schemas', 'href': '/core-concepts/advanced/multiple-schemas' },
          { 'title':'Multiple Databases', 'href': '/core-concepts/advanced/multiple-databases' }
        ]
      },
      {
        'title': 'Aliasing', 
        'href': '/core-concepts/aliasing' , 
        'behaviour':'expandable', 
        'links': [
          { 'title':'Column Aliasing', 'href': '/core-concepts/aliasing/column' },
          { 'title':'Table Aliasing', 'href': '/core-concepts/aliasing/table' },
          { 'title':'Subquery Aliasing', 'href': '/core-concepts/aliasing/subquery' },
          { 'title':'Element Composition Aliasing', 'href': '/core-concepts/aliasing/composition' }
        ]
      },
      {
        'title': 'Filter Expressions', 
        'href': '/core-concepts/filters' , 
        'behaviour':'expandable', 
        'links': [
          { 'title':'Comparison Expressions', 'href': '/core-concepts/filters/comparison-expressions' },
          { 'title':'Logical Expressions', 'href': '/core-concepts/filters/logical-expressions' },
          { 'title':'Filter Expressions', 'href': '/core-concepts/filters/filter-expressions' }
        ]
      },
      {
        'title': 'Stored Procedures', 
        'href': '/core-concepts/stored-procedures' , 
        'behaviour':'expandable', 
        'links': [
          { 'title':'Parameters', 'href': '/core-concepts/stored-procedures/parameters' },
          { 'title':'Execution', 'href': '/core-concepts/stored-procedures/execution' }
        ]
      },
      {
        'title': 'Utilities', 
        'behaviour':'expandable', 
        'links': [
          { 'title':'dbex', 'href': '/core-concepts/utilities/dbex' },
          { 'title':'Logging', 'href': '/core-concepts/utilities/logging' }
        ]
      },
      {
        'title': 'Configuration',
        'href': '/core-concepts/configuration',
        'behaviour':'expandable',
        'links': [
          { 'title':'Scaffolding', 'href': '/core-concepts/configuration/scaffolding' },
          { 'title':'Runtime', 'href': '/core-concepts/configuration/runtime' },
          { 'title':'Enums', 'href': '/core-concepts/configuration/enums' }
        ]
      },
      {
        'title': 'Query Execution', 
        'href': '/core-concepts/execution' , 
        'behaviour':'expandable', 
        'links': [
          { 'title':'Factories and Services', 'href': '/core-concepts/execution/factories' },
          { 'title':'Execution Pipelines', 'href': '/core-concepts/execution/pipelines' },
          { 'title':'Execute a Query', 'href': '/core-concepts/execution/execute-sync-async' },
          { 'title':'Connections', 'href': '/core-concepts/execution/connections' },
          { 'title':'Transactions', 'href': '/core-concepts/execution/transactions' },
          { 'title':'Pipeline Events', 'href': '/core-concepts/execution/events' }
        ]
      },
		]
	},
	{
		'title': 'Reference',
    'icon': 'book',
		'links': [
			{ 'title': 'Syntax Conventions', 'href': '/reference/syntax-conventions' },
      { 'title': 'Elements', 'href': '/reference/elements' },
      { 'title': 'Execute', 'href': '/reference/execute' },
      { 'title': 'ExecuteAsync', 'href': '/reference/execute-async' },
      { 
        'title': 'Configuration', 
        'href': '/reference/configuration',
        'links': [
            { 
              'title': 'Scaffolding', 
              'behaviour':'expandable', 
              'links': [
                  { 'title': 'General Options', 'href': '/reference/configuration/scaffolding/general-options' },
                  { 'title': 'Object Overrides', 'href': '/reference/configuration/scaffolding/object-overrides' },
                  { 'title': 'Enums', 'href': '/reference/configuration/scaffolding/enums' },
                  { 'title': 'Language Features', 'href': '/reference/configuration/scaffolding/language-features' }
              ]
            },
            { 
              'title': 'Runtime', 
              'behaviour':'expandable', 
              'links': [
                  { 'title': 'Query Expressions', 'href': '/reference/configuration/runtime/query-expressions' },
                  { 'title': 'Statement Builders', 'href': '/reference/configuration/runtime/statement-builders' },
                  { 'title': 'Element Appenders', 'href': '/reference/configuration/runtime/element-appenders' },
                  { 'title': 'Value Converters', 'href': '/reference/configuration/runtime/value-converters' },
                  { 'title': 'Entity Factories', 'href': '/reference/configuration/runtime/entity-factories' },
                  { 'title': 'Entity Mapping', 'href': '/reference/configuration/runtime/entity-mapping' },
                  { 'title': 'Parameter Builders', 'href': '/reference/configuration/runtime/parameter-builders' },
                  { 'title': 'Output Options', 'href': '/reference/configuration/runtime/output-options' },
                  { 'title': 'Connection Strings', 'href': '/reference/configuration/runtime/connection-strings' },
                  { 'title': 'Statement Executor', 'href': '/reference/configuration/runtime/statement-executor' },
                  { 'title': 'Database Connections', 'href': '/reference/configuration/runtime/database-connections' },
                  { 'title': 'Exection Pipelines', 'href': '/reference/configuration/runtime/execution-pipelines' },
                  { 'title': 'Select Pipeline Events', 'href': '/reference/configuration/runtime/select-pipeline-events' },
                  { 'title': 'Insert Pipeline Events', 'href': '/reference/configuration/runtime/insert-pipeline-events' },
                  { 'title': 'Update Pipeline Events', 'href': '/reference/configuration/runtime/update-pipeline-events' },
                  { 'title': 'Delete Pipeline Events', 'href': '/reference/configuration/runtime/delete-pipeline-events' },
                  { 'title': 'Stored Procedure Pipeline Events', 'href': '/reference/configuration/runtime/stored-procedure-pipeline-events' },
                  { 'title': 'Logging', 'href': '/reference/configuration/runtime/logging' }
              ]
            }
        ]
      },
      { 
        'title': 'Utilities', 
        'href': '/reference/utilities',
        'links': [
            { 
              'title': 'dbex', 
              'href': '/reference/utilities/dbex', 
              'behaviour':'expandable', 
              'links': [
                  { 'title': 'dbex.Null', 'href': '/reference/utilities/dbex/dbex-null' },
                  { 'title': 'dbex.Coerce', 'href': '/reference/utilities/dbex/dbex-coerce' },
                  { 'title': 'dbex.Alias', 'href': '/reference/utilities/dbex/dbex-alias' },
                  { 'title': 'dbex.GetDefaultMappingFor', 'href': '/reference/utilities/dbex/dbex-get-default-mapping-for' },
                  { 'title': 'dbex.SelectAllFor', 'href': '/reference/utilities/dbex/dbex-select-all-for' },
                  { 'title': 'dbex.BuildAssignmentsFor', 'href': '/reference/utilities/dbex/dbex-build-assignments-for' }
                ]
            }
        ]
      },
      { 
        'title': 'Functions', 
        'href': '/reference/{current_language}/functions', 
        'links': [
            { 
              'title': 'Mathematical', 
              'href': '/reference/{current_language}/functions/mathematical', 
              'behaviour':'expandable', 
              'links': [
                  { 'title': 'Abs', 'href': '/reference/{current_language}/functions/mathematical/abs' },
                  { 'title': 'ACos', 'href': '/reference/{current_language}/functions/mathematical/acos' },
                  { 'title': 'ASin', 'href': '/reference/{current_language}/functions/mathematical/asin' },
                  { 'title': 'ATan', 'href': '/reference/{current_language}/functions/mathematical/atan' },
                  { 'title': 'Ceiling', 'href': '/reference/{current_language}/functions/mathematical/ceiling' },
                  { 'title': 'Cos', 'href': '/reference/{current_language}/functions/mathematical/cos' },
                  { 'title': 'Cot', 'href': '/reference/{current_language}/functions/mathematical/cot' },
                  { 'title': 'Exp', 'href': '/reference/{current_language}/functions/mathematical/exp' },
                  { 'title': 'Floor', 'href': '/reference/{current_language}/functions/mathematical/floor' },
                  { 'title': 'Log', 'href': '/reference/{current_language}/functions/mathematical/log' },
                  { 'title': 'Rand', 'href': '/reference/{current_language}/functions/mathematical/rand' },
                  { 'title': 'Round', 'href': '/reference/{current_language}/functions/mathematical/round' },
                  { 'title': 'Sin', 'href': '/reference/{current_language}/functions/mathematical/sin' },
                  { 'title': 'Sqrt', 'href': '/reference/{current_language}/functions/mathematical/sqrt' },
                  { 'title': 'Square', 'href': '/reference/{current_language}/functions/mathematical/square' },
                  { 'title': 'Tan', 'href': '/reference/{current_language}/functions/mathematical/tan' },
                ]
            },
            { 
              'title': 'Aggregate', 
              'href': '/reference/{current_language}/functions/aggregate', 
              'behaviour':'expandable', 
              'links': [
                  { 'title': 'Avg', 'href': '/reference/{current_language}/functions/aggregate/avg' },
                  { 'title': 'Count', 'href': '/reference/{current_language}/functions/aggregate/count' },
                  { 'title': 'Max', 'href': '/reference/{current_language}/functions/aggregate/max' },
                  { 'title': 'Min', 'href': '/reference/{current_language}/functions/aggregate/min' },
                  { 'title': 'StDev', 'href': '/reference/{current_language}/functions/aggregate/stdev' },
                  { 'title': 'StDevP', 'href': '/reference/{current_language}/functions/aggregate/stdevp' },
                  { 'title': 'Sum', 'href': '/reference/{current_language}/functions/aggregate/sum' },
                  { 'title': 'Var', 'href': '/reference/{current_language}/functions/aggregate/var' },,
                  { 'title': 'VarP', 'href': '/reference/{current_language}/functions/aggregate/varp' }
                ]
            },
            { 
              'title': 'Conversion', 
              'href': '/reference/{current_language}/functions/conversion', 
              'behaviour':'expandable', 
              'links': [
                  { 'title': 'Cast', 'href': '/reference/{current_language}/functions/conversion/cast' }
                ]
            },
            { 
              'title': 'Date and Time', 
              'href': '/reference/{current_language}/functions/date-and-time', 
              'behaviour':'expandable', 
              'links': [
                  { 'title': 'Current_Timestamp', 'href': '/reference/{current_language}/functions/date-and-time/current-timestamp' },
                  { 'title': 'DateAdd', 'href': '/reference/{current_language}/functions/date-and-time/dateadd' },
                  { 'title': 'DateDiff', 'href': '/reference/{current_language}/functions/date-and-time/datediff' },
                  { 'title': 'DatePart', 'href': '/reference/{current_language}/functions/date-and-time/datepart' },
                  { 'title': 'GetDate', 'href': '/reference/{current_language}/functions/date-and-time/getdate' },
                  { 'title': 'GetUtcDate', 'href': '/reference/{current_language}/functions/date-and-time/getutcdate' },
                  { 'title': 'SysDateTime', 'href': '/reference/{current_language}/functions/date-and-time/sysdatetime' },
                  { 'title': 'SysDateTimeOffset', 'href': '/reference/{current_language}/functions/date-and-time/sysdatetimeoffset' },
                  { 'title': 'SysUtcDateTime', 'href': '/reference/{current_language}/functions/date-and-time/sysutcdatetime' }
                ]
            },
            { 
              'title': 'String', 
              'href': '/reference/{current_language}/functions/string', 
              'behaviour':'expandable', 
              'links': [
                  { 'title': 'CharIndex', 'href': '/reference/{current_language}/functions/string/charindex' },
                  { 'title': 'Concat', 'href': '/reference/{current_language}/functions/string/concat' },
                  { 'title': 'Left', 'href': '/reference/{current_language}/functions/string/left' },
                  { 'title': 'Len', 'href': '/reference/{current_language}/functions/string/length' },
                  { 'title': 'LTrim', 'href': '/reference/{current_language}/functions/string/ltrim' },
                  { 'title': 'PatIndex', 'href': '/reference/{current_language}/functions/string/patindex' },
                  { 'title': 'Replace', 'href': '/reference/{current_language}/functions/string/replace' },
                  { 'title': 'Right', 'href': '/reference/{current_language}/functions/string/right' },
                  { 'title': 'RTrim', 'href': '/reference/{current_language}/functions/string/rtrim' },
                  { 'title': 'Substring', 'href': '/reference/{current_language}/functions/string/substring' },
                  { 'title': 'Trim', 'href': '/reference/{current_language}/functions/string/trim' }
                ]
            },
            { 
              'title': 'Expressions', 
              'href': '/reference/{current_language}/functions/expressions', 
              'behaviour':'expandable', 
              'links': [
                  { 'title': 'Coalesce', 'href': '/reference/{current_language}/functions/expressions/coalesce' },
                  { 'title': 'IsNull', 'href': '/reference/{current_language}/functions/expressions/isnull' }
                ]
            },
            { 
              'title': 'System', 
              'href': '/reference/{current_language}/functions/system', 
              'behaviour':'expandable', 
              'links': [
                  { 'title': 'NewId', 'href': '/reference/{current_language}/functions/system/newid' }
                ]
            }
        ]
      },
      // { 
      //   'title': 'Statements', 
      //   'href': '/reference/statements',
      //   'links': [
      //     { 
      //       'title': 'Clauses',
      //       'href': '/reference/statements/clauses',
      //       'behaviour': 'expandable',
      //       'links': [
      //           { 'title': 'Top', 'href': '/reference/statements/clauses/top' },
      //           { 'title': 'Distinct', 'href': '/reference/statements/clauses/distinct' },
      //           { 'title': 'Offset and Limit', 'href': '/reference/statements/clauses/offset-and-limit' },
      //           { 'title': 'Union', 'href': '/reference/statements/clauses/union' },
      //           { 'title': 'Union All', 'href': '/reference/statements/clauses/union-all' }
      //       ]
      //     },
      //     { 
      //       'title': 'Select', 
      //       'href': '/reference/statements/select',
      //       'behaviour': 'indent-1'
      //     },
      //     { 
      //       'title': 'Stored Procedures', 
      //       'href': '/reference/statements/stored-procedures',
      //       'behaviour': 'indent-1'
      //     },
      // ]
      // },
      { 
        'title': 'Operators', 
        'href': '/reference/operators',
        'links': [
            { 
              'title': 'Logical',
              'href': '/reference/operators/logical',
              'behaviour': 'expandable',
              'links': [
                  { 'title': 'In', 'href': '/reference/operators/logical/in' },
                  { 'title': 'Like', 'href': '/reference/operators/logical/like' }
              ]
            },
        ]
      },
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
        'sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 pt-4 pb-1 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8',
        isScrolled
          ? 'dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
          : 'dark:bg-transparent'
      )}
    >
      <div className="mr-6 flex lg:hidden">
        <MobileNavigation navigation={getSections()} />
      </div>
      {/* <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
        <Search />
      </div> */}
      <div className="relative flex md:flex-grow items-center min-h-full">
        <div className="relative flex hidden md:visible md:block basis-0 justify-start gap-6 sm:gap-8 md:flex-grow">
          <Link href="https://dbexpression.com" className="group" aria-label="dbExpression">
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

function useOnPageContents(tableOfContents) {
  let [onPageContents, setOnPageContents] = useState(tableOfContents[0]?.id)

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
        if (!heading) {
          continue
        }
        if (top >= heading.top) {
          current = heading.id
        } else {
          break
        }
      }
      setOnPageContents(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll, { passive: true })
    }
  }, [getHeadings, tableOfContents])

  return onPageContents
}

function getSections() {
  let all = []
  for (let i = 0; i < navigation.length; i++) {
    let section = []
    getSection(navigation[i], null, section)
    for (let i = 0; i < section.length; i++) {
      section[i].breadcrumb = getBreadcrumb({ value: '' }, section[i]).value
      if (section[i].href) {
        section[i].href = section[i].href.replace('{current_language}', current_language)
      }
    }
    section.map(x => all.push(x))
  }
  return all
}

function getSection(current, parent, currentSection) {
  if (current == null) {
    return
  }
  currentSection.push(current)
  if (current.links) {
    for (let i = 0; i < current.links.length; i++) {
      getSection(current.links[i], current, currentSection)
    }
  } else {
    for (let i = 0; i < currentSection.length; i++) {
      currentSection[i].section = currentSection[0]
    }    
  }
  if (parent) {
    current.parent = parent
  }  
}

function findPreviousPage(links, linkIndex) {
  if (!links || links.length == 0 || linkIndex <= 0) {
    return
  }
  let previousPage = links[linkIndex]
  if (previousPage && previousPage.href) {
    return previousPage
  }
  return findPreviousPage(links, linkIndex - 1)
}

function findNextPage(links, linkIndex) {
  if (!links || links.length == 0 || linkIndex >= links.length) {
    return
  }
  let nextPage = links[linkIndex]
  if (nextPage && nextPage.href) {
    return nextPage
  }
  return findNextPage(links, linkIndex + 1)
}

function getBreadcrumb(breadcrumb, link) {
  if (link.links) {
    breadcrumb.value = link.title + (breadcrumb.value == '' ? breadcrumb.value : (' > ' + breadcrumb.value))
  }
  if (link.parent) {
    getBreadcrumb(breadcrumb, link.parent)
  }
  return breadcrumb
}

export function Layout({ children, title, tableOfContents }) {
  let router = useRouter()
  
  let allLinks = getSections()

  let linkIndex = allLinks.findIndex((link) => link?.href === router.pathname)
  let currentPage = allLinks[linkIndex]
  let previousPage = findPreviousPage(allLinks, linkIndex - 1)
  let nextPage = findNextPage(allLinks, linkIndex + 1)
  let onPageContents = useOnPageContents(tableOfContents)

  function isActive(section) {
    if (section.id === onPageContents) {
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

      <div className="relative mx-auto flex max-w-8xl justify-center sm:px-2">
        <div className="hidden lg:relative lg:block lg:flex-none lg:py-12 ">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
          <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto pb-16 pt-4 pl-0.5 scrollbar">
            <div className="absolute top-16 bottom-0 right-0 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
            <div className="absolute top-28 bottom-0 right-0 hidden w-px bg-slate-800 dark:block" />
            <Navigation
              navigation={allLinks}
              className="w-64 pr-8 xl:w-72 xl:pr-16"
            />
          </div>
        </div>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-4 lg:py-8 xl:py-16 lg:max-w-none lg:pr-0 lg:pl-12 xl:px-16">
          <article>
            {(title || currentPage?.breadcrumb) && (
              <header className="mb-9 space-y-1">
                {currentPage?.breadcrumb && (
                  <p className="font-display text-sm font-medium text-sky-500">
                    {currentPage.breadcrumb}
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
            {previousPage && previousPage.href && (
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
            {nextPage && nextPage.href && (
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
