import * as React from 'react'
import { getComponent } from '../utils'
import 'server-only'

type PreviewProps = {
  code: string
  dependencies?: Record<string, string>
}

export async function Preview({
  code,
  dependencies,
}: // @ts-expect-error remove when async component types are fixed
PreviewProps): JSX.Element {
  const { default: Component } = await getComponent(code, dependencies)

  return <Component />
}

// <iframe sandbox=”allow-scripts” srcdoc=”<h1>Hello World</h1>” />
