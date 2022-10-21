import { Fragment } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import Prism from "prism-react-renderer/prism";
import clsx from 'clsx';

(typeof global !== "undefined" ? global : window).Prism = Prism;

require("prismjs/components/prism-csharp");
require("prismjs/components/prism-sql");

export function InlineCode({ content, className, style }) {
  return (
    <code className="mx-0.5 px-1.5 py-1 dark:text-slate-300 rounded ring-1 ring-slate-200 bg-slate-50 dark:ring-slate-700 dark:bg-slate-800 before:content-[''] after:content-['']">{content}</code>
  )
}
