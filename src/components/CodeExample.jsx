import { Fragment } from 'react'
import { Tab } from '@headlessui/react'

export function CodeExample({labels, children}) {

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <Tab.Group>
      <div className='relative shadow-sm dark:shadow-none dark:border-slate-800/75 border rounded-xl my-8'>
        <Tab.List className='px-4'>
          {labels.map((label, idx) =>
            <Tab as={Fragment} key={idx}>{({selected}) => (
              <button
              className={classNames('whitespace-nowrap py-2 px-8 border-b-2 font-medium text-sm focus:outline-none',
                selected
                ? 'border-sky-500 text-sky-500'
                : 'border-transparent text-slate-500 hover:text-slate-400 dark:hover:text-slate-300 hover:border-slate-400 dark:hover:border-slate-300'
              )}
              >
                {label}
              </button>
            )}</Tab>
          )} 
          {/* <div className='absolute top-2 right-4'>permalink</div> */}
        </Tab.List>
        <Tab.Panels>
          {children.map((content, idx) =>
            <Tab.Panel key={idx} className='-mt-6 -mb-6'>{content}</Tab.Panel>
          )}  
        </Tab.Panels>
      </div>
    </Tab.Group>
  )
}