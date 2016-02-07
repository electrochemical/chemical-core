var BrowserWindow = require('electron').BrowserWindow,
    ipc = require('electron').ipcRenderer
module.exports = function(package) {
package = package || {}
name = package.name
return [{ //TODO: OS X roles
    label: 'File',
    role: 'window',
    submenu: [{
        label: 'New Window',
        accelerator: 'CmdOrCtrl+N',
        click: () => ipc.send('new_window')
    }, {
        label: 'New Tab',
        accelerator: 'CmdOrCtrl+T'
    }, {
        label: 'Close Tab',
        accelerator: 'CmdOrCtrl+W'
    }, {
        label: 'Close Window',
        accelerator: process.platform == 'darwin' ? 'Ctrl+Command+Q' : 'Alt+F4',//TODO: find darwin shortcuts
        role: 'close'
    }]
}, {
    label: 'Edit',
    submenu: [{
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        click: null //TODO: how???
    }, {
        label: 'Clear Selection',
        accelerator: 'Esc',
        click: null
    }]
}, {
    label: 'View',
    submenu: [{
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => { if (focusedWindow) focusedWindow.reload() }
    }]
}, {
    label: 'Help',
    role: 'help',
    submenu: [{
        label: 'Help',
        accelerator: process.platform === 'darwin' ? 'Ctrl+Command+H' : 'F1'
    }, {
        type: 'separator'
    }, {
        label: `About ${name}`,
        accelerator: process.platform === 'darwin' ? 'Ctrl+Command+A' : 'Shift+F1',
        role: 'about',
        click: () =>  new BrowserWindow({height: 240, width: 320, title: `About ${name}`}).loadURL('file://' + require('path').resolve(__dirname, 'about.html') + `?name=${name};lic=${package.license};ver=${package.version};desc=${package.description}`)
    }]
}]}
