import * as React from 'react'
import type { MDXComponents } from 'mdx/types'
import { Code } from '../server/code'

const languages = {
  mjs: 'javascript',
}

function getLanguageFromClassName(className: string = '') {
  const language = className
    .split(' ')
    .find((name) => name.startsWith('language-'))
    ?.slice(9)

  return language ? languages[language] ?? language : null
}

let id = 0

export function useMDXComponents(): MDXComponents {
  return {
    code: ({ children, className }) => {
      const language = getLanguageFromClassName(className)

      return (
        <Code
          fileName={`code-${id++}.${language}`}
          value={children as string}
        />
      )
    },
  } satisfies MDXComponents
}
