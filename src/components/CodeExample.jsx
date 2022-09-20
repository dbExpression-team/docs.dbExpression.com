import { Fragment } from 'react'
import { Tab } from '@headlessui/react'

export function CodeExample({children}) {

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  let labels = []
  if (Array.isArray(children)) {
    children.filter(p => p.type.name == 'Fence').map(t => labels.push(t.props.language == 'csharp' ? 'C#' : 'SQL'))
  } else if (children.type.name == 'Fence') {
    labels.push(children.props.language == 'csharp' ? 'C#' : 'SQL')
  }

  let content = []
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      let child = children[i]
      if (child.type.name == 'Fence' || i == 0) {
        content.push([ child ])
      }
      else {
        content[i - 1].push(child)
      }
    }
  } else {
    content.push([ children ])
  }

  return (
    <Tab.Group>
      <div className='shadow-sm dark:shadow-none dark:border-slate-800/75 border rounded-xl mb-8'>
      <Tab.List className='px-4'>
        {labels.map((label, idx) =>
          <Tab as={Fragment} key={idx}>{({ selected }) => (
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
      </Tab.List>
      <Tab.Panels>
        {content.map((c, idx) =>
          <Tab.Panel key={idx} className='-mt-6 -mb-6'>{c}</Tab.Panel>
        )}  
      </Tab.Panels>
      </div>
    </Tab.Group>
  )
}