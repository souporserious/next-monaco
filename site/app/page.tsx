import { Editor } from 'next-monaco'
import './app.css'

const defaultValue = `
import { Editor } from 'next-monaco'

export default function App() {
  return (
    <Editor
      name="index.tsx"
      value={\`import { React } from 'react'\`}
    />
  )
}
`.trim()

export default function Page() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto 0.25fr',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          fontWeight: 600,
          padding: '1rem',
          backgroundColor: '#d39e5a',
          color: '#1c1309',
          textAlign: 'center',
        }}
      >
        This package is still a work in progress. The APIs are not stable and
        may change.
      </div>
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
              Next.js application.
            </h2>
            <p>
              Next Monaco provides a familiar full-featured code editing
              experience without sacrificing time to first byte.
            </p>
          </div>
          <code>npm install next-monaco</code>
        </div>
        <Editor name="index.tsx" value={defaultValue} />
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
