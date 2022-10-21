import React, { useState, useEffect } from "react";
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { NavigationSection } from '@/components/NavigationSection'
import { BoxIcon } from '@/components/BoxIcon'
import { BookIcon } from '@/components/BookIcon'
import { TerminalIcon } from '@/components/TerminalIcon'

const icons = {
  box: BoxIcon(),
  book: BookIcon(),
  terminal: TerminalIcon()
}

export function Navigation({ navigation, className }) {

  let router = useRouter()

  let sections = navigation.map(item => item.section).filter((v, i, a) => a.indexOf(v) === i)

  function renderNavLink(link, currentPath){
    let padding = 'pl-6'
    let margin = ''
    if (link.behaviour?.startsWith('indent')) {
      padding = 'pl-4'
      let amount = link.behaviour.slice(-1);
      margin = `ml-${Number(amount) * 4}`
    }
    return (<Link
      href={link.href}
      className={clsx(
        'block w-full before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
        padding,
        margin,
        link.href === currentPath
          ? 'font-semibold text-sky-500 before:bg-sky-500'
          : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
      )}> 
      {link.title}
    </Link>)
  }

  return (
    <nav className={clsx('text-base lg:text-sm', className)}>
      <ul role='list' className='space-y-9'>
        {sections.map((section) => (
          <li key={section.title} className='pl-4'>
            <h2 className='font-display font-semibold text-slate-900 dark:text-white'>    
            {section.icon && 
              <div className='flex -ml-2.5'>
                <div className='text-slate-400 dark:text-sky-700'>{icons[section.icon]}</div>
                <span className='pl-4'>{section.title}</span>
              </div>
            }
            {!section.icon && section.title}
            </h2>
            <ul
              role='list'
              className='mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200'
            >
              {navigation.filter(nav => nav.section.title == section.title).map((link, idx) => 
                <li key={idx} className='relative'>
                    {link.behaviour == 'expandable'
                      ? <NavigationSection section={link} sectionNodes={navigation.filter(child => child.parent == link)}></NavigationSection>
                      : <></>
                    }                
                    {link.behaviour != 'expandable' && link.parent?.behaviour != 'expandable' && link.href && renderNavLink(link, router.pathname)}
                </li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
