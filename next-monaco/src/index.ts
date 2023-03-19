import { NextConfig } from 'next'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

/** Creates a Next.js plugin that configures Monaco Editor. */
export function createMonacoPlugin({ theme }: { theme: string }) {
  return function withMonaco(nextConfig: NextConfig = {}) {
    const getWebpackConfig = nextConfig.webpack

    nextConfig.webpack = (config, options) => {
      config.module.rules.push(
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
        },
        {
          test: /\.wasm$/,
          type: 'asset/resource',
        }
      )

      if (typeof getWebpackConfig === 'function') {
        return getWebpackConfig(config, options)
      }

      return config
    }

    return async () => {
      if (nextConfig.env === undefined) {
        nextConfig.env = {}
      }

      nextConfig.env.MONACO_THEME = (
        await readFile(resolve(process.cwd(), theme), 'utf-8')
      )
        // replace single line comments with empty string
        .replace(/\/\/.*/g, '')

      return nextConfig
    }
  }
}
