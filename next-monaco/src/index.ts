import { NextConfig } from 'next'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'

/** Creates a Next.js plugin that configures Monaco Editor. */
export function createMonacoPlugin({ theme }: { theme: string }) {
  return function withMonaco(nextConfig: NextConfig = {}) {
    const getWebpackConfig = nextConfig.webpack

    nextConfig.webpack = (config, options) => {
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
      })

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

      return {
        transpilePackages: [
          'next-monaco/editor',
          ...(nextConfig.transpilePackages ?? []),
        ],
        ...nextConfig,
      }
    }
  }
}
