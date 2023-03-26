import * as React from 'react'
import { highlightWithScopes } from '@code-hike/lighter'
import { Editor as ClientEditor } from '../client'
import 'server-only'
import './editor.css'

export async function Editor({ defaultValue }: { defaultValue: string }) {
  const { lines } = await highlightWithScopes(
    defaultValue,
    'tsx',
    JSON.parse(process.env.MONACO_THEME)
  )

  return (
    <div style={{ display: 'grid' }}>
      <ClientEditor defaultValue={defaultValue}>
        <pre style={{ gridArea: '1 / 1', margin: 0 }}>
          {lines.map((line, index) => (
            <div key={index} style={{ lineHeight: '21px' }}>
              {line.map((token, index) => (
                <span key={index} style={token.style}>
                  {token.content}
                </span>
              ))}
            </div>
          ))}
        </pre>
      </ClientEditor>
    </div>
  )
}
