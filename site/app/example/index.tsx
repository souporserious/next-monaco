import * as React from 'react'
import { Button } from './Button'
import './index.css'

export default function Index() {
  return <Button onClick={() => alert('Hello')}>Say Hello</Button>
}
