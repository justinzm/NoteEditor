// 主菜单

var { Menu, shell, ipcMain, BrowserWindow, app } = require('electron');

var template = [{
        label: '文件',
        submenu: [
            {
                label: '新建',
                accelerator: 'Ctrl+N',
                click: function () {
                    // 主进程通知渲染进程操作文件
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'new');
                }
            },
            {
                label: '打开',
                accelerator: 'Ctrl+O',
                click: function () {
                    // 主进程通知渲染进程操作文件
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'open');
                }
            },
            {
                label: '保存',
                accelerator: 'Ctrl+S',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'save');
                }
            },
            {
                type: 'separator'
            },
            {
                label: '打印',
                accelerator: 'Ctrl+P',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.print();
                }
            },
            {
                label: '退出',
                accelerator: 'Ctrl+Q',
                click: function () {
                    BrowserWindow.getFocusedWindow().webContents.send('action', 'exit');
                }
            }
        ]
    },
    {
        label: '编辑',
        submenu: [
            {
                label: '撤销',
                role: 'undo'
            },
            {
                label: '恢复',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: '截切',
                role: 'cut'
            },
            {
                label: '复制',
                role: 'copy'
            },
            {
                label: '黏贴',
                role: 'paste'
            },
            {
                label: '删除',
                role: 'delete'
            },
            {
                label: '全选',
                role: 'selectall'
            }
        ]
    },
    {
        label: '视图',
        submenu: [
            {
                label: '加载',
                role: 'reload'
            },
            {
                label: '缩小',
                role: 'zoomout'
            },
            {
                label: '放大',
                role: 'zoomin'
            },
            {
                label: '重置缩放',
                role: 'resetzoom'
            },
            {
                type: 'separator'
            },
            {
                label: '全屏',
                role: 'togglefullscreen'
            }
        ]
    },
    {
        label: '帮助',
        submenu: [
            {
                label: '关于',
                click() {
                    shell.openExternal('http://www.gopup.cn');
                }
            }
        ]
    }
];

var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);


// 右键菜单

const contextMenuTemplate=[
    {
        label: '撤销',
        role: 'undo'
    },
    {
        label: '恢复',
        role: 'redo'
    },
    {
        type: 'separator'
    },
    {   label: '截切',
        role: 'cut'
    },
    {
        label: '复制',
        role: 'copy'
    },
    {
        label: '黏贴',
        role: 'paste'
    },
    { type: 'separator' },  //分隔线
    { label: '全选',
        role: 'selectall' 
    }
];

var contextMenu = Menu.buildFromTemplate(contextMenuTemplate);

// 监听右键事件
ipcMain.on("contextMenu", function(){
    contextMenu.popup(BrowserWindow.getFocusedWindow());
});

// 监听渲染进程通知
ipcMain.on("exit_app", function(){
    app.quit();
})
