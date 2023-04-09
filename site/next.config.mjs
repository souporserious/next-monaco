import { createMonacoPlugin } from 'next-monaco/plugin'

const withMonaco = createMonacoPlugin({
  theme: 'theme.json',
  types: ['react', 'next', 'next-monaco', 'next-monaco/plugin'],
})

export default withMonaco({
  experimental: {
    appDir: true,
  },
})
