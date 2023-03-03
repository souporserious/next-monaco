import { createMonacoPlugin } from 'next-monaco'

const withMonaco = createMonacoPlugin()

/** @type {import('next').NextConfig} */
export default {
  experimental: {
    appDir: true,
  },
}
