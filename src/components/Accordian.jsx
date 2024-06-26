import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { BoxIcon } from '@/components/BoxIcon'

export function Accordian({ caption, children }) {
  
  return (
    <div className='relative'>
      <div className='static w-full pb-4 pt-4 place-content-start'>
        <div className='w-full border content-center border-slate-200 border-1 dark:border-sky-700 rounded-md bg-slate-50 dark:bg-slate-900 lg:mr-12'>      
          <Disclosure>
            {({ open }) => (
              <>
                <div className='w-full flex items-center'>
                  <Disclosure.Button className='bg-slate-50 dark:bg-slate-900 my-2 mx-2' >
                    { open ? 
                      <ChevronDownIcon className='h-5 w-5 text-gray-900 dark:text-slate-200 self-center'/>
                      :
                      <ChevronRightIcon className='h-5 w-5 text-gray-900 dark:text-slate-200 self-center'/>
                    }
                  </Disclosure.Button>
                  <div className='font-medium text-sm text-gray-900 dark:text-white pl-2 border-l border-slate-200 dark:border-sky-700'><span className='pl-2'>{caption}</span></div>
                </div>
                <Disclosure.Panel>
                  <div className="border-t bg-white dark:bg-slate-900 border-slate-200 dark:border-sky-700">
                  <div className='my-2 mx-3'>{children}</div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </div>
  )
}