import { createMonacoPlugin } from 'next-monaco'

const withMonaco = createMonacoPlugin({
  theme: 'theme.json',
})

/** @type {import('next').NextConfig} */
export default withMonaco({
  experimental: {
    appDir: true,
  },
})
