const electron = require('electron')
const dialog = electron.dialog
const ipcMain = electron.ipcMain
const xlsx = require("xlsx")

module.exports = function(mainWindow, backgroundWindow) {

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


	ipcMain.on("sync-openFile-dialog", (event, arg) => {
		dialog.showOpenDialog({
			title: "请选择Excel文件",
			filters: [{name: 'Excel File', extensions: ['xls', "xlsx"]}],
			properties: ["openFile"]
		}, function(arr) {
	    if(arr !== undefined) {
				// arr 是一个文件路径 数组
				event.sender.send("open-file-response", arr[0]);
			}
		})
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
}