import clsx from 'clsx';

function downArrow(className) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={clsx("w-12 h-12 text-gray-500 dark:text-gray-300", className)}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3" />
        </svg>
    )
}

function getSectionClassName(current, highlight) {
    let common = 'w-full mx-8 border-4 dark:border-2 rounded-md font-medium'
    if (current == highlight) {
        return clsx(common, 'border-slate-600 dark:border-sky-400 bg-sky-200 dark:bg-sky-700 text-gray-900 dark:text-white text-md')
    }
    return clsx(common, 'border-gray-500 dark:border-gray-300  bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-200 text-sm')
}

function getSubSectionClassName(current, highlight) {
    let common = 'w-3/4 border-4 dark:border-2 rounded-md font-medium'
    if (current == highlight) {
        return clsx(common, 'border-slate-600 dark:border-sky-400 bg-sky-200 dark:bg-sky-700 text-gray-900 dark:text-white text-md')
    }
    return clsx(common, 'border-gray-500 dark:border-gray-300  bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-200 text-sm')
}

export function QueryExecutionSequenceImage({highlight, children}) {
    return (
        <div className='relative bg-slate-100 dark:bg-slate-800 border rounded-lg min-w-min'>
            <div className='flex w-full h-12 mt-8 place-content-center'>
                <div className='w-5/6 border-4 dark:border-2 rounded-md font-medium border-gray-500 dark:border-gray-300  bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-200 text-sm'>
                    <div className='text-center pt-2'>Query Expression</div>
                </div>
            </div>
            <div className='flex w-full place-content-center'>
                <div>{downArrow()}</div>
            </div>

            <div className='w-full px-4'>
                <div className='border-2 border-dashed border-gray-500 dark:border-gray-300 dark:bg-slate-900 rounded-lg mb-10'>
                    <div className='w-full px-4 py-4 place-items-middle'>Execution Pipeline</div>                    
                    <div className='flex w-full h-12'>
                        <div className={getSectionClassName('Statement Builder', highlight)}>
                            <div className='text-center pt-2'>Statement Builder</div>
                        </div>
                    </div>
                    <div className='flex w-full place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>

                    <div className='flex w-full h-12 justify-content-center'>
                        <div className='w-1/6' />
                        <div className={getSubSectionClassName('Element Appender', highlight)}>
                            <div className='text-center pt-2'>Element Appender</div>
                        </div>
                        <div className='w-1/6' />                        
                    </div>
                    <div className='flex w-full place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>

                    <div className='flex w-full h-12 justify-content-center'>
                        <div className='w-1/6' />
                        <div className={getSubSectionClassName('Value Converter', highlight)}>
                            <div className='text-center pt-2'>Value Converter</div>
                        </div>
                        <div className='w-1/6' />                        
                    </div>
                    <div className='flex w-full place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>

                    <div className='flex w-full h-12 justify-content-center'>
                        <div className='w-1/6' />
                        <div className={getSubSectionClassName('Parameter Builder', highlight)}>
                            <div className='text-center pt-2'>Parameter Builder</div>
                        </div>
                        <div className='w-1/6' />                        
                    </div>
                    <div className='flex w-full place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>

                    <div className='flex w-full h-12'>
                        <div className={getSectionClassName('Statement Executor', highlight)}>
                            <div className='text-center pt-2'>Statement Executor</div>
                        </div>
                    </div>
                    <div className='flex w-full place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>

                    <div className='flex w-full h-12 justify-content-center'>
                        <div className='w-1/6' />
                        <div className={getSubSectionClassName('Connection', highlight)}>
                            <div className='text-center pt-2'>Connection</div>
                        </div>
                        <div className='w-1/6' />                        
                    </div>
                    <div className='flex w-full place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>
                    <div className='flex w-1/2 place-content-center'>
                        <div className="relative">
                            <div className='absolute h-60 border-l-2 -top-12 border-l-gray-500 dark:border-l-gray-400'></div>
                        </div>
                    </div>
                    
                    <div className='flex w-full h-12 justify-content-center'>
                        <div className='w-1/3' />
                        <div className={clsx('w-1/2', getSubSectionClassName('Entity Creation', highlight))}>
                            <div className='text-center pt-2'><em>Entity Creation</em></div>
                        </div>
                        <div className='w-1/6' />                                    
                    </div>
                    <div className='flex w-full place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>

                    <div className='flex w-full h-12 justify-content-center'>
                        <div className='w-1/3' />
                        <div className={clsx('w-1/2', getSubSectionClassName('Entity Mapping', highlight))}>
                            <div className='text-center pt-2'><em>Entity Mapping</em></div>
                        </div>
                        <div className='w-1/6' />                                    
                    </div>
                    <div className='flex w-full place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>

                    <div className='flex w-full h-12 mb-8'>
                        <div className='w-1/6' />
                        <div className={getSectionClassName('Value Converter', highlight)}>
                            <div className='text-center pt-2'>Value Converter</div>
                        </div>
                        <div className='w-1/6' />
                    </div>
                </div>
                
            </div>
        </div>
    )
  }