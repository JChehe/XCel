'use strict'

const electron = require('electron')
const path = require('path')
const menuTemplate = require("./menuTemplate")
const ipcMainSets = require("./ipcMainSets")

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
let mainWindow
let backgroundWindow
var windowBounds = {}
let config = {}
if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.mainUrl = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.mainUrl = `file://${__dirname}/dist/index.html`
}
config.backUrl = `file://${__dirname}/dist/background/index.html`

function createMainWindow () {
  var win = new BrowserWindow({
    height: 850,
    width: 1280,
    backgroundColor: "#f5f5f5",
    frame: false
  })
  windowBounds = win.getBounds()
  win.loadURL(config.mainUrl)

  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

    let installExtension = require('electron-devtools-installer')

    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then((name) => win.webContents.openDevTools())
      .catch((err) => console.log('An error occurred: ', err))
  }

  win.on('closed', () => {
    console.log("触发 closed")
    mainWindow = null
    backgroundWindow = null
    // 在Mac中完全退出程序，而不会留在dock中
    app.quit()
  })

  console.log('mainWindow opened')
  return win
}

function createBackgroundWindow () {
  var win = new BrowserWindow({
    show: false
  })
  win.loadURL(config.backUrl)
  console.log("backgroundWindow opened")
  return win
}

app.on('ready', () => {
  console.log("ready")
  mainWindow = createMainWindow()
  backgroundWindow = createBackgroundWindow()
  ipcMainSets(mainWindow, backgroundWindow)
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
})



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 当应用被激活时触发，常用于点击应用的 dock 图标的时候。
// 现在取消保留在Dock中，完全退出
app.on('activate', () => {
  if (mainWindow.isDestroyed()) {
    mainWindow = createMainWindow()
    backgroundWindow = createBackgroundWindow()
  }
})
