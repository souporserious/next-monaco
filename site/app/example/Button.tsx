import * as React from 'react'

/** Buttons give users the ability to perform actions. */
export function Button({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
  return <button onClick={onClick}>{children}</button>
}
