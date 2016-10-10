'use strict'

// const _ = require("lodash")
const electron = require('electron')
const path = require('path')
const fs = require("fs")
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const dialog = electron.dialog
const xlsx = require("xlsx")
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
    // show: false
  })
  win.loadURL(`file://${__dirname}/dist/background/index.html`);
  console.log("backgroundWindow opened")

  return win
}

app.on('ready', () => {
  mainWindow = createMainWindow()
  backgroundWindow = createBackgroundWindow()
})

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


ipcMain.on("background-response", (event, arg) => {
  mainWindow.webContents.send("background-response", arg)
})

ipcMain.on("background-start", (event, arg) => {
  backgroundWindow.webContents.send("background-start", arg)
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
    console.log(event)
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


// ipcMain.on("sync-export-file", (event, arg) => {
//   console.log(arg)
//   var state = arg.state
//   exportFileByWB({
//     filteredData: state.filteredData, 
//     excelData: state.excelData,
//     sheetNameList: state.excelData.sheetNameList,
//     fileName: "过滤后的Excel.xlsx"
//   })
// })



// function exportFileByWB(args) {
//   var {filteredData, excelData, sheetNameList, fileName, writeOpts} = args
//   var finalWB = {
//     SheetNames: [],
//     Sheets: {}
//   }
//   sheetNameList.forEach((sheetName, i) => {
//     var wbTem = jsonToWBForOneSheet(filteredData[sheetName], excelData[sheetName + "_headers"], sheetName)
//     console.log(wbTem)
//     finalWB.SheetNames.push(wbTem.SheetNames[0])
//     Object.assign(finalWB.Sheets, {
//       [sheetName]: wbTem["Sheets"][sheetName]
//     })
//   })
//   console.log("finalWB", finalWB)
//   // var wbout = XLSX.write(finalWB, {bookType:'xlsx', bookSST:false, type: 'binary'});
//   XLSX.writeFile(finalWB, fileName);
// }

// function jsonToWBForOneSheet(json, colkeys, sheetName) {
//   var _headers = colkeys // 获取表头
//   var headers = _headers
//     .map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
//     .reduce((prev, next) => Object.assign({}, prev, {
//       [next.position]: { v: next.v }
//     }), {})

//   var data = json
//     .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
//     .reduce((prev, next) => prev.concat(next))
//     .reduce((prev, next) => Object.assign({}, prev, {
//       [next.position]: { v: next.v }
//     }), {});

//   var output = Object.assign({}, headers, data)
//   var outputPos = Object.keys(output)

//   var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1]
//   var wb = {
//     SheetNames: [sheetName],
//     Sheets: {
//       [sheetName]: Object.assign({}, output, { '!ref': ref })
//     }
//   }
//   return wb
// }
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
