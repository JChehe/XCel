'use strict'

// const _ = require("lodash")
const electron = require('electron')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

let mainWindow
let config = {}
var windowBounds = {}

if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 850,
    width: 1280,
    frame: false
  })
  windowBounds = mainWindow.getBounds()
  mainWindow.loadURL(config.url)

  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

    let installExtension = require('electron-devtools-installer')

    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then((name) => mainWindow.webContents.openDevTools())
      .catch((err) => console.log('An error occurred: ', err))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  console.log('mainWindow opened')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


ipcMain.on("sync-close", (event, arg) => {
  mainWindow.close()
  console.log("关闭")
})
ipcMain.on("sync-maximize", (event, arg) => {
  if(mainWindow.isMaximized()){
    mainWindow.setBounds(windowBounds)
  }else{
    windowBounds = mainWindow.getBounds()
    mainWindow.maximize()
  }
  event.sender.send("send-isMax", mainWindow.isMaximized())
})
ipcMain.on("sync-minimize", (event, arg) => {
  if(!mainWindow.isMinimized()){
    mainWindow.minimize()
    console.log("可以最小化")
  }else{
    console.log("不可最小化，因为已经最小化了")
  }
})

/* 添加最近文档貌似需要该软件能打开的文件，因此需要知道如何点击该列表时在软件内倒入到Excel
ipcMain.on('async-fileList', (event, arg) => {
  console.log(_.isArray(arg))
  console.log(arg)

  app.clearRecentDocuments()
  _.isArray(arg) && arg.forEach((file, index) => {
    console.log(index)
    app.addRecentDocument(file.path)
  })
})*/
