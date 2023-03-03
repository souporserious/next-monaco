import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'
import { NextConfig } from 'next'
import { createPublicFiles } from './create-public-files'

export function createMonacoPlugin() {
  return function withMonaco(nextConfig: NextConfig = {}) {
    const getWebpackConfig = nextConfig.webpack

    nextConfig.webpack = (config, options) => {
      config.plugins.push(
        new MonacoWebpackPlugin({
          filename: 'static/[name].worker.js',
          languages: [],
        })
      )

      if (typeof getWebpackConfig === 'function') {
        return getWebpackConfig(config, options)
      }

      return config
    }

    return async () => {
      await createPublicFiles()

      if (nextConfig.env === undefined) {
        nextConfig.env = {}
      }

      return nextConfig
    }
  }
}
