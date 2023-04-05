import { createMonacoPlugin } from 'next-monaco/plugin'

const withMonaco = createMonacoPlugin({
  theme: 'theme.json',
  types: ['next', 'next-monaco', 'next-monaco/plugin'],
})

export default withMonaco({
  experimental: {
    appDir: true,
  },
})
