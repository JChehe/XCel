'use strict'

// const _ = require("lodash")
const electron = require('electron')
const path = require('path')
const xlsx = require("xlsx")

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const dialog = electron.dialog
// const Menu = electron.Menu
let mainWindow
let backgroundWindow
let config = {}
var windowBounds = {}

if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
}

/*
let template = [{
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        // on reload, start fresh and close any old
        // open secondary windows
        if (focusedWindow.id === 1) {
          BrowserWindow.getAllWindows().forEach(function (win) {
            if (win.id > 1) {
              win.close()
            }
          })
        }
        focusedWindow.reload()
      }
    }
  }, {
    label: 'Toggle Full Screen',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Ctrl+Command+F'
      } else {
        return 'F11'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: (function () {
      if (process.platform === 'darwin') {
        return 'Alt+Command+I'
      } else {
        return 'Ctrl+Shift+I'
      }
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools()
      }
    }
  }]
}]*/


  function createMainWindow () {
  /**
   * Initial window options
   */
  var win = new BrowserWindow({
    height: 850,
    width: 1280,
    frame: false
  })
  windowBounds = win.getBounds()
  win.loadURL(config.url)
  if (process.env.NODE_ENV === 'development') {
    BrowserWindow.addDevToolsExtension(path.join(__dirname, '../node_modules/devtron'))

    let installExtension = require('electron-devtools-installer')

    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then((name) => win.webContents.openDevTools())
      .catch((err) => console.log('An error occurred: ', err))
  }

  win.on('closed', () => {
    mainWindow = null
    backgroundWindow = null
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
  mainWindow = createMainWindow()
  backgroundWindow = createBackgroundWindow()
  // const menu = Menu.buildFromTemplate(template)
  // Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})


ipcMain.on("readFile-response", (event, arg) => {
  mainWindow.webContents.send("readFile-response", arg)
})
ipcMain.on("readFile-start", (event, arg) => {
  console.log("读取文件emit")
  backgroundWindow.webContents.send("readFile-start", arg)
})

ipcMain.on("filter-response", (event, arg) => {
  mainWindow.webContents.send("filter-response", arg)
})
ipcMain.on("filter-start", (event, arg) => {
  backgroundWindow.webContents.send("filter-start", arg)
})

ipcMain.on("exportFile-response", (event, arg) => {
  mainWindow.webContents.send("exportFile-response", arg)
})
ipcMain.on("exportFile-start", (event, arg) => {
  backgroundWindow.webContents.send("exportFile-start", arg)
})




ipcMain.on("sync-saveFile-dialog", (event, arg) => {
  dialog.showSaveDialog({
    title: "请选择保存路径",
    filters: [{
      name: "Excel",
      extensions: ["xlsx"]
    }]
  }, function(p) {
    if(p !== undefined) {
      xlsx.writeFile(arg.data, p)
    }
    // p 是用户输入的路径名
    console.log("p" , p);
  })
})


ipcMain.on("sync-confirm-dialog", (event, arg) => {
  dialog.showMessageBox({
    type: "question",
    buttons: ["确定", "取消"],  // Mac 中显示顺序相反
    defaultId: 0,
    title: arg.title || "xcel",
    message: arg.content || "",
    detail: arg.detail || "",
  }, function(index) {
    // 返回点击按钮的 index
    console.log("BtnIndex", index)
    event.sender.send("sync-confirm-dialog-reponse", {
      index,
      typeId: arg.typeId, // 用于区分 emit 者
      path: arg.path,
      fileIndex: arg.fileIndex
    })
  })
})


ipcMain.on("sync-alert-dialog", (event, arg) => {
  dialog.showMessageBox({
    type: "warning",
      buttons: ["确定"],
      defaultId: 0, // dialog 打开是默认选中哪个按钮
      title: arg.title || "xcel",
      message: arg.content || "",
      detail: arg.detail || ""
  })
})

// 接受窗口的最小化、最大化、关闭 事件
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
