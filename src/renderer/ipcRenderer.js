var { ipcRenderer, remote } = require('electron');
var fs = require('fs');

// 监听右键菜单
document.addEventListener('contextmenu', function(e){
    e.preventDefault;
    ipcRenderer.send('contextMenu');
});

//设置文档标题，影响窗口标题栏名称
document.title = "无标题"; 

// 获取文本框dom
var txtEditorDom = document.querySelector("#txtEditor");

// 判断文件是否保存
var isSave = true;

// 保存当前文件的路径
var currentFile = "";

// 内容变化时
txtEditorDom.oninput = function(){
    if(isSave){
        document.title += " *";
    }
    isSave = false;
}

//监听主进程的操作
ipcRenderer.on("action", function(event, action){
    switch(action){
        case "new":
            //判断文件是否保存;如果没有保存提示并保存
            askSaveDialog();
            // txtEditorDom.value = "";
            editor.setValue("");
            currentFile=""
            document.title = "无标题";
            break;

        case "open":
            askSaveDialog();
            // 通过dialog打开文件
            remote.dialog.showOpenDialog({
                properties: ['openFile']
            }).then(function(result){
                console.log(result.canceled);
                console.log(result.filePaths);
                //如果用户没有点击取消
                if (!result.canceled) {
                    // electron 5.x以后路径保存在result.filePaths里面
                    let fsData = fs.readFileSync(result.filePaths[0]);
                    // txtEditorDom.value = fsData;
                    editor.setValue(fsData);
                }
            }).catch(function(err){
                console.log(err)
            });
            break;

        case "save":
            saveCurrentDoc();
            break;
        
        case "exit":
            askSaveDialog();
            // 通知主进程退出应用
            ipcRenderer.send("exit_app")
            break;
    }
});


//判断文件师傅保存并执行保存功能
function askSaveDialog() {
    if (!isSave) {
        //同步弹窗
        var result = remote.dialog.showMessageBoxSync({ 
            type: "question",
            message: '是否要保存此文件?',
            buttons: ['Yes', 'No']
        })
        if(result==0){
            saveCurrentDoc();
        }else{
            //不保存的话 isSave等于true
            isSave=true;
        }
    }
}

// 封装执行保存方法
function saveCurrentDoc() {
    if (!currentFile) {  
       //改为同步方法
       var result=remote.dialog.showSaveDialogSync({
            defaultPath: '*.txt',
            filters: [
                { name: 'All Files', extensions: ['*'] }
            ]
        })        
        if (result) {
            currentFile = result;
            // fs.writeFileSync(currentFile, txtEditorDom.value);
            fs.writeFileSync(currentFile, editor.getValue());
            isSave = true;
            //改变软件的标题
            document.title = currentFile;
        }
    } else {
        fs.writeFileSync(currentFile, editor.getValue());
        isSave = true;
        //改变软件的标题
        document.title = currentFile;
    }
}

// remote.dialog.showSaveDialog({
//     defaultPath: "*.txt",
//     filters: [
//         { name: 'All Files', extensions: ['*'] }
//     ]
// }).then(function(result){
//     console.log(result.canceled)
//     console.log(result.filePath)
//     if (!result.canceled) {
//         fs.writeFile(result.filePath, txtEditorDom.value, function (err) {
//             if (!err) {
//                 console.log('成功');
//             }
//         });
//     }
// }).catch(function(err){
//     console.log(err)
// })