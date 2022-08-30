import { Fragment } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import Prism from "prism-react-renderer/prism";
import clsx from 'clsx';

(typeof global !== "undefined" ? global : window).Prism = Prism;

require("prismjs/components/prism-csharp");
require("prismjs/components/prism-sql");

export function Fence({ children, language }) {
  return (
    <Highlight
      {...defaultProps}
      code={children.trimEnd()}
      language={language}
      theme={undefined}
    >
      {({ className, style, tokens, getTokenProps }) => (
        <pre className={clsx("scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 dark:scrollbar-thumb-slate-700 dark:scrollbar-track-slate-300 overlow-y-scroll", className)} style={style}>
          <code>
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
  )
}
