import Link from 'next/link'
import clsx from 'clsx'

export function MicrosoftDocsUrl({ path, label, className, ...props }) {

  let url = 'https://learn.microsoft.com/en-us/sql/t-sql'
  if (!path.startsWith('\/')) {
    url += '\/'
  }
  url += path

  label = 'Microsoft SQL Server docs on ' + label

  return (
      <div className={clsx('flex flex-row my-4', className)}>
        <Link target='_blank' href={url}>
          <span className="text-sm">{label}</span>
        </Link>
      </div>
  )
}




