
import clsx from 'clsx';

function getSectionClassName(highlight) {
    let common = 'p-0 w-2/5 items-stretch border-4 dark:border-2 rounded-md font-medium text-sm'
    if (highlight) {
        return clsx(common, 'border-slate-600 dark:border-sky-400 bg-sky-200 dark:bg-sky-700 text-gray-900 dark:text-white')
    }
    return clsx(common, 'border-gray-500 dark:border-gray-300  bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-200')
}

function downArrow(className) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={clsx("w-12 h-12 text-gray-500 dark:text-gray-300", className)}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3" />
        </svg>
    )
}

export function ExecutionPipelineImage({type, children}) {
    let fixedType = type.replace(' ', '')
    return (
        <div className='relative bg-slate-100 dark:bg-slate-800 border rounded-lg min-w-min'>
            <div className='w-full p-4 pb-0 place-items-middle'>
                {children}
            </div>
            <div className='flex -mt-4 mb-2 w-full place-content-center'>
                <div>{downArrow('text-gray-400')}</div>
            </div>
            <div className='w-full px-4'>
                <div className='border-2 border-dashed border-gray-500 dark:border-gray-300 dark:bg-slate-900 rounded-lg mb-10'>
                    <div className='w-full px-4 pt-4 place-items-middle'>{type} Execution Pipeline</div>
                    <div className='w-full px-4 pt-4 place-items-middle'>
                        <div className='flex flex-row-reverse w-full items-center'>
                            <div className='w-1/4 ml-4 py-4 rounded-md border border-slate-600 dark:border-sky-400 bg-sky-200 dark:bg-sky-700 text-gray-900 dark:text-white text-xs text-center'>
                                <span>{type} events</span>
                            </div>
                            <div className='w-1/4 py-4 rounded-md border border-gray-500 dark:border-gray-300  bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-200 text-xs text-center'>
                                <span>Common events</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex px-4 w-full h-48 mt-8'>
                        <div className={getSectionClassName(false)}>
                            <p className='text-center pt-4 break-words'>OnBeforeStart</p>
                        </div>
                        <div className='pl-6 w-3/5 place-content-start border-none text-sm'>
                            <p className='-mt-1'>The first event published, published just <em>after</em> the {type} Execution Pipeline has been created.</p>
                        </div>
                    </div>
                    <div className='flex px-4 w-2/5 place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>
                    <div className='flex px-4 w-full h-48'>
                        <div className={getSectionClassName(true)}>
                            <p className='text-center pt-4 break-words'>OnBefore{fixedType}Start</p>
                        </div>
                        <div className='pl-6 w-3/5 place-content-start border-none text-sm'>
                            <p className='-mt-1'>The first {type}-specific event published, this event is published just <em>after</em> all OnBeforeStart subscribers
                            have received the OnBeforeStart event publication.</p>
                        </div>
                    </div>
                    <div className='flex px-4 w-2/5 place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>
                    <div className='flex px-4 w-full h-48'>
                        <div className={getSectionClassName(true)}>
                            <p className='text-center pt-4 break-words'>OnAfter{fixedType}Assembly</p>
                        </div>
                        <div className='pl-6 w-3/5 border-none text-sm'>
                            <p className='-mt-1'>Event published <em>after</em> a SQL statement has been created from the QueryExpression.</p>
                        </div>
                    </div>
                    <div className='flex px-4 w-2/5 place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>
                    <div className='flex px-4 w-full h-48'>
                        <div className={getSectionClassName(false)}>
                            <p className='text-center pt-4 break-words'>OnAfterAssembly</p>
                        </div>
                        <div className='pl-6 w-3/5 border-none text-sm'>
                            <p className='-mt-1'>Event published <em>after</em> the OnAfter{fixedType}Assembly event and <em>after</em> a SQL statement has been created from the QueryExpression.
                            This event is published after all OnAfter{fixedType}Assembly subscribers have received the OnAfter{fixedType}Assembly event publication.</p>
                        </div>
                    </div>
                    <div className='flex px-4 w-2/5 place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>
                    <div className='flex px-4 w-full h-48'>
                        <div className={getSectionClassName(false)}>
                            <p className='text-center pt-4 break-words'>OnBeforeCommand</p>
                        </div>
                        <div className='pl-6 w-3/5 border-none text-sm'>
                            <p className='-mt-1'>Event published <em>after</em> the SQL command has been created and parameters set.  Command properties can be set in this event, but will be overwritten by any command properties provided in the Execute or ExecuteAsync method.
                            Command text can be completely overwritten in this event, or the command text writer can have text appended.</p>
                        </div>
                    </div>
                    <div className='flex px-4 w-2/5 place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>
                    <div className='flex px-4 w-full h-48'>
                        <div className={getSectionClassName(true)}>
                            <p className='text-center pt-4 break-words'>OnBefore{fixedType}Command</p>
                        </div>
                        <div className='pl-6 w-3/5 border-none text-sm'>
                            <p className='-mt-1'>Event published just <em>after</em> the OnBeforeCommand event, and just <em>before</em> the SQL statement is executed against the database.
                            Command properties can be set in this event, but will be overwritten by any command properties provided in the Execute or ExecuteAsync method. Command text can be 
                            overwritten, or the command text writer can have text appended, but only if it was not overwritten in OnBeforeCommand event.</p>
                        </div>
                    </div>
                    <div className='flex px-4 w-2/5 place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>
                    <div className='flex px-4 w-full h-48'>
                        <div className={getSectionClassName(true)}>
                            <p className='text-center pt-4 break-words'>OnAfter{fixedType}Command</p>
                        </div>
                        <div className='pl-6 w-3/5 border-none text-sm'>
                            <p className='-mt-1'>Event published just <em>after</em> the SQL statement was executed against the database.  <strong><em>Subscribe to this event only if you need access to the command 
                            after execution of the SQL statement.</em></strong>  The command (and any data readers) are still open - be perfomance minded when using this event.</p>
                        </div>
                    </div>
                    <div className='flex px-4 w-2/5 place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>
                    <div className='flex px-4 w-full h-48'>
                        <div className={getSectionClassName(false)}>
                            <p className='text-center pt-4 break-words'>OnAfterCommand</p>
                        </div>
                        <div className='pl-6 w-3/5 border-none text-sm'>
                            <p className='-mt-1'>Event published <em>after</em> the OnAfter{fixedType}Command SQL statement has been executed.  <strong><em>Subscribe to this event only if you need access to the command 
                            after execution of the SQL statement.</em></strong>  The command (and any data readers) are still open - be perfomance minded when using this event.</p>
                        </div>
                    </div>
                    <div className='flex px-4 w-2/5 place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>
                    <div className='flex px-4 w-full h-48'>
                        <div className={getSectionClassName(true)}>
                            <p className='text-center pt-4 break-words'>OnAfter{fixedType}Complete</p>
                        </div>
                        <div className='pl-6 w-3/5 place-content-start border-none text-sm'>
                            <p className='-mt-1'>Event published after the command and reader have been closed, all data has been mapped, and the pipeline is at completion.</p>
                        </div>
                    </div>
                    <div className='flex px-4 w-2/5 place-content-center'>
                        <div className='place-self-center'>{downArrow()}</div>
                    </div>
                    <div className='flex px-4 w-full h-48 mb-8'>
                        <div className={getSectionClassName(false)}>
                            <p className='text-center pt-4 break-words'>OnAfterComplete</p>
                        </div>
                        <div className='pl-6 w-3/5 place-content-start border-none text-sm'>
                            <p className='-mt-1'>Event published <em>after</em> the OnAfter{fixedType}Query event, this is the last event published.  This event is published after all 
                            OnAfter{fixedType}Complete subscribers have received the OnAfter{fixedType}Complete event publication.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }