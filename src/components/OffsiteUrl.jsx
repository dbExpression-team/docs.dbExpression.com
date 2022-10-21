import Link from 'next/link'
import clsx from 'clsx'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

export function OffsiteUrl({ url, label, className, ...props }) {
  return (
    <>
    {/* <Link target='_blank' href={url} className={clsx('text-underline', className)}>
      <div className='flex flex-nowrap'>
        <span className='align-top underline'>{label}</span>
        <span><ArrowTopRightOnSquareIcon className='h-3.5 w-3.5 ml-1 mt-1' /></span>
      </div>
    </Link> */}
    
      <Link target='_blank' href={url} className={clsx('text-underline', className)}>{label}</Link>
    </>
  )
}




