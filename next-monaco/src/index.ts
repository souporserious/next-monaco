import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'
import { NextConfig } from 'next'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createPublicFiles } from './create-public-files'

/** Creates a Next.js plugin that configures Monaco Editor. */
export function createMonacoPlugin({ theme }: { theme: string }) {
  return function withMonaco(nextConfig: NextConfig = {}) {
    const getWebpackConfig = nextConfig.webpack

    nextConfig.webpack = (config, options) => {
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
      })

      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: ['typescript'],
          filename: 'static/[name].worker.js',
        })
      )

      if (typeof getWebpackConfig === 'function') {
        return getWebpackConfig(config, options)
      }

      return config
    }

    return async () => {
      // await createPublicFiles()

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
