'use strict'

// const _ = require("lodash")
const electron = require('electron')
const path = require('path')
const fs = require("fs")
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain
const dialog = electron.dialog

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
