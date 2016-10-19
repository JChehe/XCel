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
  /**
   * Initial window options
   */
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
    // mainWindow = null
    // if(!backgroundWindow.isDestroyed()) {
    //   backgroundWindow.close()
    // }
    // backgroundWindow = null
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  console.log('mainWindow opened')
  return win
}

function createBackgroundWindow () {
  var win = new BrowserWindow({
    // show: false
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

app.on('activate', () => {
  // if (mainWindow.isDestroyed()) {
  if(mainWindow === null) {
    mainWindow = createMainWindow()
    backgroundWindow = createBackgroundWindow()
  }
    // ipcMainSets(mainWindow, backgroundWindow)
  // }
})
