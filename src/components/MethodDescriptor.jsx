import Highlight, { defaultProps } from 'prism-react-renderer'
import { Fragment } from 'react'
import clsx from 'clsx'
import Prism from "prism-react-renderer/prism";
import { useEffect, useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

(typeof global !== "undefined" ? global : window).Prism = Prism

require("prismjs/components/prism-csharp")
require("prismjs/components/prism-sql")

const primitives = [ 'int', 'short', 'byte', 'decimal', 'double', 'float']

function getCode(code) {
    return <Highlight {...defaultProps}
        code={code}
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
}

export function MethodDescriptor(children) {

    let attributes = JSON.parse(children.children.props.children.replace(/\n/g, " "))

    return (
        <div className='pb-8 pt-2'>
            <h3>Syntax</h3>
            <div className='pl-8 pb-2'>
                {getCode(attributes.syntax)}
            </div>
            {attributes.alternateSyntax && 
                <>
                    <h3>Alternate Syntax</h3>
                    <ul>
                    {attributes.alternateSyntax.map((alt, idx) => (
                        <li className='list-none last:pb-2' key={idx}>
                            {getCode(alt)}
                        </li>
                    ))}
                    </ul>
                </>
            }            
            <h3>Arguments</h3>
            <div>
                {attributes.arguments == null && <div className='pl-8 pb-2'>(none)</div>}


                <Disclosure defaultOpen='true'>
                    {({ open }) => (
                        attributes.arguments && attributes.arguments.map((arg, idx) =>
                            <div key={idx} className='w-full pl-4 pb-2 flex-rows'>
                                <div className='pb-6'>
                                    <dl>
                                        <dt>
                                            <div className='flex place-items-center'>
                                                <Disclosure.Button className='bg-white dark:bg-slate-900 xself-center' >
                                                    { open ? 
                                                    <ChevronDownIcon className='h-5 w-5 text-gray-600 dark:text-slate-400 xself-center'/>
                                                    :
                                                    <ChevronRightIcon className='h-5 w-5 text-gray-600 dark:text-slate-400 xself-center'/>
                                                    }
                                                </Disclosure.Button>
                                                <span className='text-lg font-medium text-gray-700 dark:text-slate-100 pl-2'>{arg.argumentName}</span>
                                            </div>
                                        </dt>
                                        <dd className='pl-12'>{arg.description && <span className='text-base text-gray-700 dark:text-slate-300'>&ndash; {arg.description}</span>}</dd>
                                    </dl>
                                </div>
                                <Disclosure.Panel>
                                <div className='text-base pl-12'>
                                    <table className='table-fixed text-base text-gray-800 dark:text-slate-300'>
                                        <tbody>
                                            <tr>
                                                <td className='w-1/3 md:w-1/6'>required</td>
                                                <td>{arg.hasOwnProperty('required') && <span>{typeof arg.required == "boolean" ? (arg.required ? "yes" : "no") : `conditional: ${arg.required}`}</span>}</td>
                                            </tr>
                                            <tr>
                                                <td className=''>valid types</td>
                                                <td>{arg.types &&                               
                                                    <div>
                                                        <dl className='pb-8'>
                                                            {arg.types.map((type, idx) => (
                                                                <>
                                                                <dt>
                                                                    {type.predicate && <div className='-translate-x-4 pt-4'>&bull; <em>{type.predicate}</em></div>}
                                                                    {getCode(type.typeName)}
                                                                </dt>
                                                                <dd className={clsx('-mt-4 pl-8 dark:border-slate-800', type.description || type.notes ? 'pb-4' : 'pb-.5')}>{type.description}
                                                                    {type.notes && 
                                                                    <ul>
                                                                        {type.notes.map((note, idx) =>
                                                                            <li key={idx}>{note}</li>
                                                                        )}
                                                                    </ul>
                                                                    }                                                
                                                                </dd>
                                                                </>
                                                            ))}
                                                        </dl>
                                                    </div>}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>                            
                                </div>
                                </Disclosure.Panel>
                            </div>
                        )                
                )}
                </Disclosure>
            </div>
            {attributes.returns && 
                <>
                <h3>Returns</h3>
                <div>
                    {attributes.returns.typeName && <div className='pl-8 pb-2'>
                        {getCode(attributes.returns.typeName)}
                    </div>}
                    {attributes.returns.description &&
                        <div className={clsx('-mt-2 pb-2', attributes.returns.typeName ? 'pl-20' : 'pl-8')}>
                            {attributes.returns.description}
                            {attributes.returns.notes && 
                                <ul>
                                {attributes.returns.notes.map((note, idx) =>
                                    <li key={idx}>{note}</li>
                                )}
                            </ul>}
                        </div>
                    }
                </div>
                </>
            }
        </div>
    )
}