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
  return <Editor defaultValue={defaultValue} />
}
