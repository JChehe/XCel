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
let config = {}
var windowBounds = {}

if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.mainUrl = `http://localhost:${config.port}`
  config.backUrl = `http://localhost:${config.port}/background/index.html`
} else {
  config.devtron = false
  config.mainUrl = `file://${__dirname}/dist/index.html`
  config.backUrl = `file://${__dirname}/dist/background/index.html`
}


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
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  console.log('mainWindow opened')
  return win
}

function createBackgroundWindow () {
  var win = new BrowserWindow({
    show: false
  })

  win.loadURL(`file://${__dirname}/dist/background/index.html`);
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

  mainWindow.on('reload', () => {
    console.log("reload")
    console.log("mainWindow", mainWindow)
    console.log("backgroundWindow",  backgroundWindow)
    mainWindow = createMainWindow()
    backgroundWindow = createBackgroundWindow()
    ipcMainSets(mainWindow, backgroundWindow)
  })
})



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow()
    backgroundWindow = createBackgroundWindow()
  }
})
