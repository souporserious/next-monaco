import { Editor } from 'next-monaco/editor'
import './app.css'

const defaultValue = `
/**
 * Say hello.
 *
 * @example
 * <Hello name="Penny" />
 */
function Hello({ name }: { name: string }) {
  return <div>Hello, {name}</div>
}
`.trim()

export default function Page() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '1fr auto',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '54ch',
            padding: '2rem',
            gap: '2rem',
          }}
        >
          <h1>Next Monaco</h1>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h2>
              The same powerful editor used in VS Code loaded on-demand in your
              browser
            </h2>
            <p>
              Next Monaco provides a familiar full-featured code editing
              experience without sacrificing time to first byte.{' '}
            </p>
          </div>
          <code>npm install next-monaco</code>
        </div>
        <Editor defaultValue={defaultValue} />
      </div>
      <div
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: 'minmax(0, 1fr)',
          padding: '4rem',
          textAlign: 'center',
        }}
      >
        <h3>Server Component Ready</h3>
        <h3>TextMate Highlighting</h3>
        <h3>Type Acquisition</h3>
        <h3>Marketplace Themes</h3>
      </div>
    </div>
  )
}

// <Editor>
//   <Model name="file.tsx" source={source} />
//   <Model name="app.css" source={source} active />
// </Editor>

// <Editor filename="index.tsx" contents="const a = 'b'" theme="dark" />

// <Editor name="index.tsx" source="const a = 'b'" />
