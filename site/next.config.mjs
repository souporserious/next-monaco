import { createMonacoPlugin } from 'next-monaco/plugin'

const withMonaco = createMonacoPlugin({
  theme: 'theme.json',
  types: ['next-monaco', 'next-monaco/plugin'],
})

/** @type {import('next').NextConfig} */
export default withMonaco({
  experimental: {
    appDir: true,
  },
})
