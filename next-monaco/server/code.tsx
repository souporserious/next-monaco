import * as React from 'react'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { highlight } from '@code-hike/lighter'
import 'server-only'

type CodeProps = {
  fileName: string
  workingDirectory?: string
  value?: string
}

/* Attempt to read the file from the file system. If it fails, return the value */
async function parseValue(
  workingDirectory: string,
  fileName: string,
  value: string
) {
  try {
    return readFile(resolve(workingDirectory, fileName), 'utf8')
  } catch {
    return value
  }
}

async function AsyncCode({
  workingDirectory,
  fileName,
  value,
  ...props
}: CodeProps) {
  const { lines } = await highlight(
    await parseValue(workingDirectory, fileName, value),
    fileName.split('.').pop(),
    JSON.parse(await readFile(process.env.MONACO_THEME_PATH, 'utf-8'))
  )

  return (
    <pre style={{ gridArea: '1 / 1', margin: 0 }} {...props}>
      {lines.map((line, index) => (
        <div key={index} style={{ height: 20, lineHeight: '20px' }}>
          {line.map((token, index) => (
            <span key={index} style={token.style}>
              {token.content}
            </span>
          ))}
        </div>
      ))}
    </pre>
  )
}

/** Renders a code block with syntax highlighting. */
export function Code(props: CodeProps) {
  // @ts-expect-error remove when async component types are fixed
  return <AsyncCode {...props} />
}
