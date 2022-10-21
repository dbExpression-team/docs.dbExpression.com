import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { useState } from 'react'
import { Switch } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export function NavigationSection({ section, sectionNodes }) {
  let router = useRouter()

  let isInSection = section.href == router.pathname || sectionNodes.some(x => x.href == router.pathname)
  const [isExpanded, setIsExpanded] = useState(isInSection)
  
  // using "isExpanded || isInSection()", but this doesn't allow user to close the node if they are in the section...
  
  return (
    <>
      <div className={clsx('flex', isInSection ? 'before:pointer-events-none before:absolute before:-left-1 before:top-[12px] before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full font-semibold text-sky-500 before:bg-sky-500' : '')}>
        <Switch.Group>
          <div className='flex'>                  
            <Switch 
              checked={isExpanded} 
              onChange={setIsExpanded}
              disabled = {isInSection}
              className='h-6 w-6 ml-6'
            >
              {isExpanded || isInSection ? <ChevronDownIcon className={clsx('h-6 w-6', section.href == router.pathname ? 'text-sky-500' : 'text-slate-500')}/> : <ChevronRightIcon className={clsx('h-6 w-6', section.href == router.pathname ? 'text-sky-500' : 'text-slate-500')}/>}
            </Switch>
            <Switch.Label className={clsx(
                    section.href === router.pathname
                      ? 'font-semibold text-sky-500 before:bg-sky-500'
                      : clsx('text-slate-500 before:hidden before:bg-slate-300 dark:text-slate-400 dark:before:bg-slate-700 ',
                        section.href ? 'hover:before:block hover:text-slate-600 dark:hover:text-slate-300' : '')
                )}>
                { section.href ? <Link href={section.href}>{section.title}</Link> : <span>{section.title}</span> }
            </Switch.Label>
          </div>                                
        </Switch.Group>
      </div>
      <ul>
        <li className={clsx(
              section.href === router.pathname
                ? 'font-semibold text-sky-500 before:bg-sky-500'
                : clsx('text-slate-500 before:hidden before:bg-slate-300 dark:text-slate-400 dark:before:bg-slate-700',
                  section.href ? 'hover:before:block hover:text-slate-600 dark:hover:text-slate-300' : '')
          )}>
          <ul role='list' className={clsx('pl-4 lg:pl-6 mt-2 space-y-2 lg:mt-4 lg:space-y-4', isExpanded || isInSection ? '' : 'hidden')}>
            {sectionNodes.map(link => 
              <li key={link.title} className={clsx(
                  'ml-8',
                  link.href === router.pathname
                    ? 'font-semibold text-sky-500 before:bg-sky-500'
                    : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
                )}>
                  <Link
                    href={link.href}
                    className={clsx(
                      'block w-full',
                      link.href === router.pathname
                        ? 'font-semibold text-sky-500 before:bg-sky-500'
                        : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
                    )}> 
                    {link.title}
                  </Link>
              </li>)}
          </ul>
        </li>
      </ul>
    </>
  )
}