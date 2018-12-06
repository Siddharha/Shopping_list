const electron = require('electron');
const url = require('url');
const path = require('path');

const {app,BrowserWindow, Menu, ipcMain} = electron;
let mainWindow, addWindow;

app.on('ready',function(){

    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname,'mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed',function(){
        app.quit();
    });
});

//catch stream item value
const lItem = ipcMain.on('item:list',function(e,item){
    mainWindow.webContents.send('item:list',item);
})

//create menu template
const menuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label:'Add Shopping List',
                accelerator: process.platform == 'darwin'? 'Command + Shift + A': 'Ctrl + Shift + A',
                click(){
                    openAddWindow();
                }
            },
            {
                label:'Exit',
                accelerator: process.platform == 'darwin'? 'Command + Q': 'Ctrl + Q',
                click(){
                    app.quit();
                }
            }
        ]
    },
    {
        label:'Settings',
        submenu:[
            {
                role:'reload'
            }
        ]
    }
];

function openAddWindow(){
    addWindow = new BrowserWindow({
        width:300,
        height:200,
        modal: true,
        parent: mainWindow,
        resizable: false
    });
    addWindow.loadURL(url.format({
        pathname:path.join(__dirname,'addWindow.html'),
        protocol:'file:',
        slashes: true
    }));

    addWindow.setMenu(null);
    addWindow.on('closed',function(){
        addWindow = null
    });
}

if(process.platform != 'darwin'){
    menuTemplate.unshift({});
}

if(process.release != 'Production'){
    menuTemplate.push({
        label:'Developer Tools',
        submenu:[
            {
                label:'Toggle Dev Tool',
                click(e,focusedWindow){
                    focusedWindow.webContents.toggleDevTools();
                }
            }
        ]
    });
}