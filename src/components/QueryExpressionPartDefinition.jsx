import { Fence } from '@/components/Fence'
import { Fragment } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import Prism from "prism-react-renderer/prism";
import clsx from 'clsx';

(typeof global !== "undefined" ? global : window).Prism = Prism;

require("prismjs/components/prism-csharp");
require("prismjs/components/prism-sql");

export function QueryExpressionPartDefinition() {
    return (
        <>
        <div className='relative grid grid-flow-row grid-cols-12 auto-rows-auto'>
            <div className='col-span-12 h-12'>
                <div className='xabsolute bottom-0'>Database Accessor</div>
            </div>
            <div className='flex'>
                <div className='border-b x-x-translate-1/2 border-r'>2
                </div>
            </div>
            <div className='col-span-12 h-24 place-items-middle -translate-y-8'>
                <Highlight {...defaultProps}
                    code="db.SelectMany&lt;Person&gt;().From(dbo.Person).Where(dbo.Person.BirthDate &gt;= DateTime.UtcNow.Date)"
                    language="csharp"
                    theme={undefined}>
                            {({ className, style, tokens, getTokenProps }) => (
                        <pre className={clsx(className, "")} style={style}>
                        <code className='border-hidden'>
                            {tokens.map((line, lineIndex) => (
                            <Fragment key={lineIndex}>
                                {line
                                .filter((token) => !token.empty)
                                .map((token, tokenIndex) => (
                                    <span key={tokenIndex} {...getTokenProps({ token })} />
                                ))}
                                {'\n'}
                            </Fragment>
                            ))}
                        </code>
                        </pre>
                    )}
                </Highlight>
            </div>
            <div className='col-span-12'>
                4
            </div>
            <div className='h-24 col-span-12'>
                5
            </div>
        </div>


        <div className="static bg-slate-800 border rounded-lg p-4 justify-center w-568">
            <div className='-mb-8 ml-4 grid grid-cols-12 xborder-2'>
                <div className='static'>
                    <div className='static mb-8'>
                        <div className='absolute align-self-center overflow-visible'>
                            <div><span className='text-sm'>Database Accessor</span></div>
                        </div>
                    </div>
                    <div className='static'>
                        <div className='border-r-2 w-4 h-12 -translate-x-1/2'></div>
                    </div>
                    <div className='static'>
                        <div className='border-b-2 w-4'></div>
                    </div>
                </div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div className='static'>
                <Highlight {...defaultProps}
                    code="db.SelectMany&lt;Person&gt;().From(dbo.Person).Where(dbo.Person.BirthDate &gt;= DateTime.UtcNow.Date)"
                    language="csharp"
                    theme={undefined}>
                            {({ className, style, tokens, getTokenProps }) => (
                        <pre className={clsx(className, "border-hidden")} style={style}>
                        <code className='border-hidden'>
                            {tokens.map((line, lineIndex) => (
                            <Fragment key={lineIndex}>
                                {line
                                .filter((token) => !token.empty)
                                .map((token, tokenIndex) => (
                                    <span key={tokenIndex} {...getTokenProps({ token })} />
                                ))}
                                {'\n'}
                            </Fragment>
                            ))}
                        </code>
                        </pre>
                    )}
                </Highlight>
            </div>
            <div className='-mt-8 ml-4 mb-8 grid grid-cols-12 xborder-2'>
                <div></div>
                <div className='static col-start-2'>
                    <div className='static ml-4 xborder-2 xborder-red-500'>
                        <div className='border-b-2 w-20 -translate-x-1/2'></div>
                    </div>
                    <div className='static'>
                        <div className='border-r-2 w-4 h-12 -translate-x-1/2'></div>
                    </div>
                    <div className='static -translate-x-1/2'>
                        <div className='absolute align-self-center overflow-visible w-24'>
                            <div><span className='text-sm'>Query Type</span></div>
                        </div>
                    </div>
                </div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            
        </div>
        <div className="flex grid-cols-[8rem] bg-slate-800 border rounded-lg p-4 justify-center">
            <div className="grid-rows-5 h-40 flex-initial">
                <div className="h-16 shrink overflow-visible"></div>
                <div className="h-8 grow align-self-center">db</div>
                <div className="border-t border-1"></div>
                <div className="h-7 border-r -translate-x-1/2"></div>
                <div className="h-8 w-4 justify-self-center">
                    <div className="whitespace-nowrap overflow-visible text-center text-sm">Database Accessor</div>
                </div>
            </div>
            <div className="grid-rows-7 h-40 flex-initial">
                <div className="h-8 shrink overflow-visible"></div>
                <div className="h-8"></div>
                <div className="h-8 grow align-middle">.</div>
                <div className="h-8"></div>
                <div className="h-8 "></div>
            </div>
            <div className="grid-rows-5 h-40 flex-initial">
                <div className="h-8 w-4 justify-self-center">
                    <div className="whitespace-nowrap overflow-visible text-center text-sm">Query Type</div>
                </div>
                <div className="h-7 border-r -translate-x-1/2"></div>
                <div className="border-b border-1"></div>
                <div className="h-8 grow align-self-center">SelectMany</div>
                <div className="h-16 shrink overflow-visible"></div>
            </div>
            <div className="grid-rows-5 h-40 flex-initial">
                <div className="h-8 shrink overflow-visible"></div>
                <div className="h-8"></div>
                <div className="h-8 grow border-b border-t border-t-slate-800 align-self-center before:content-['<'] after:content-['>']"><span className="token generic-method generic">Person</span></div>
                <div className="h-4 border-r -translate-x-1/2"></div>
                <div className="h-8 justify-self-center">
                    <div className="whitespace-nowrap overflow-visible text-center text-sm"><span>Entity</span></div>
                </div>
            </div>
            <div className="grid-rows-3 h-40 flex-initial">
                <div className="h-16"></div>
                <div className="h-8 align-self-center">.</div>
                <div className="h-16"></div>
            </div>
            <div className="grid-rows-3 flex-initial">
                <div className="h-16"></div>
                <div className="h-8 align-self-center">From</div>
                <div className="h-16"></div>
            </div>
            <div className="grid-rows-5 h-40 flex-initial">
                <div className="h-8 shrink overflow-visible"></div>
                <div className="h-8"></div>
                <div className="h-7 grow border-b border-t border-t-slate-800 before:content-['('] align-self-center">dbo</div>
                <div className="h-12 border-r -translate-x-1/2"></div>
                <div className="h-8 w-4 justify-self-center">
                    <div className="whitespace-nowrap overflow-visible text-center text-sm">Schema Accessor</div>
                </div>
            </div>
            <div className="grid-rows-3">
                <div></div>
                <div>.</div>
                <div></div>
            </div>
            <div className="grid-rows-3">
                <div></div>
                <div>Where</div>
                <div></div>
            </div>
            <div className="grid-rows-3">
                <div></div>
                <div className="before:content-['(']">dbo.Person</div>
                <div></div>
            </div>
            <div className="grid-rows-3">
                <div></div>
                <div>==</div>
                <div></div>
            </div>
            <div className="grid-rows-3">
                <div></div>
                <div className="after:content-[')']">3</div>
                <div></div>
            </div>
        </div>
        </>
    )
  }