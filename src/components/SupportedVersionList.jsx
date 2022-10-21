import clsx from 'clsx'

export function SupportedVersionList({ versions, initial_version, listAll = true, className }) {

  const allVersions = [2005, 2008, 2012, 2014, 2016, 2017, 2019, 2022]
  let supportedVersions = allVersions.filter(version => {
    if (initial_version && version >= initial_version) {
      return version
    }
    if (versions?.length > 0 && versions.includes(version)) {
      return version 
    }
    if (versions && versions.includes(version)) {
      return version
    }
    if (!versions && !initial_version){ //neither parameter provided, so it is "in"
      return version
    }
  })
  let unSupportedVersions = allVersions.filter(version => {
    if (!supportedVersions.includes(version)) {
      return version 
    }
  })

  return (
    <>
    <ul className={clsx("hidden 2xl:inline-flex pl-0 pb-8 list-inside", className)}>
      {allVersions.map(version => (
        supportedVersions.includes(version) ?
        <li key={version} className="flex mr-3 xpy-1 items-center ring-1 rounded ring-slate-200 bg-slate-50 dark:ring-slate-700 dark:bg-slate-800">
            <svg className="w-5 h-5 mr-1.5 text-green-600 dark:text-green-500 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span className="text-xs font-semibold pr-2 text-slate-900 dark:text-slate-300">{version}</span>
        </li>
        :
        listAll && <li key={version} className="flex mr-3 xpy-1 items-center ring-1 rounded ring-slate-200 bg-slate-50 dark:ring-slate-700 dark:bg-slate-800">
          <svg className="w-5 h-5 mr-1.5 opacity-90 dark:opacity-50 text-red-300 dark:text-rose-800 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
          </svg>
          <span className="text-xs xfont-semibold pr-2 text-slate-400 dark:text-slate-500">{version}</span>
        </li>        
        ))}
    </ul>
    <ul className={clsx("inline-flex 2xl:hidden pl-0 pb-8 list-inside", className)}>
      {listAll && unSupportedVersions.length > 0 &&
        <li className="flex mr-3 xpy-1 items-center ring-1 rounded ring-slate-200 bg-slate-50 dark:ring-slate-700 dark:bg-slate-800">
          <svg className="w-5 h-5 mr-1.5 opacity-90 dark:opacity-50 text-red-300 dark:text-rose-800 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
          </svg>
          <span className="text-xs xfont-semibold pr-2 text-slate-400 dark:text-slate-500">{unSupportedVersions.join(", ")}</span>
        </li>
      }
      {supportedVersions.length > 0 && 
        <li className="flex mr-3 xpy-1 items-center ring-1 rounded ring-slate-200 bg-slate-50 dark:ring-slate-700 dark:bg-slate-800">
            <svg className="w-5 h-5 mr-1.5 text-green-600 dark:text-green-500 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
          <span className="text-xs font-semibold pr-2 text-slate-900 dark:text-slate-300">{supportedVersions.join(", ")}</span>
        </li>        
      }
    </ul>
    </>
  )
}




