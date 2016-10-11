'use strict'

const path = require('path')
const pkg = require('./app/package.json')

let config = {
  // Name of electron app
  // Will be used in production builds
  name: '用研数据清洗工具',

  // webpack-dev-server port
  port: 9080,

  // electron-packager options
  // Docs: https://simulatedgreg.gitbooks.io/electron-vue/content/docs/building_your_app.html
  building: {
    'app-version': pkg.version,
    arch: 'x64',
    asar: true,
    dir: path.join(__dirname, 'app'),
    icon: path.join(__dirname, 'app/icons/icon'),
    ignore: /src|main.ejs|icons/,
    out: path.join(__dirname, 'builds'),
    overwrite: true,
    platform: process.env.PLATFORM_TARGET || 'all'
  }
}

config.building.name = config.name

module.exports = config
