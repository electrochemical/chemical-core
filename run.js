var electron = require('electron'),
    BrowserWindow = electron.BrowserWindow,
    app = electron.app,
    ipc = electron.ipcMain,
    Menu = electron.Menu,
    fs = require('fs'),
    path = require('path'),
    os = require('os'),
    argv = require('minimist')(process.argv.slice(process.argv[0].split('/').slice(-1)[0] === 'electron' ? 2 : 1)),
    main,
    windows = [],
    LOCAL_CONFIG = require('./config'),
    CONFIG,
    app_path,
    package,
    menus = {file: 0, view: 1, help: 2}//TODO: js locs in app, use('chemical_core').<package> e.g. jquery to avoid bloat
    //TODO: splice (also, add to wiki)
    //TODO: security
function modifyMenu(menu) {
    if(argv.dev) {
        menu[menus.view].submenu.push({type: 'separator'})
        menu[menus.view].submenu.push({
            label: 'Toggle Devtools',
            accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
            click: (item, focusedWindow) => { if (focusedWindow) focusedWindow.toggleDevTools() }
        })
    }
    return menu
}
module.exports = {
    $: require('jquery')
}
for(var i in LOCAL_CONFIG.locations) {
    app_path = path.resolve(LOCAL_CONFIG.locations[i], argv._[0])
    try {
        fs.accessSync(path.resolve(app_path, 'global_config.js'))
    }
    catch(e) {
        continue
    }
    if(CONFIG = require(path.resolve(app_path, 'global_config.js'))) {
        package = JSON.parse(fs.readFileSync(path.resolve(app_path, 'package.json')))
        Menu.setApplicationMenu(Menu.buildFromTemplate(modifyMenu(require('./menu.js')(package))))
        break
    }
}
function clone(obj, copy) {
    copy = copy || {}
    if(null === obj || 'object' !== typeof obj) return copy
    if(obj instanceof Array) return copy.concat(obj) //TODO: prepend
    if(obj instanceof Object) {
        for (var attr in obj) if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr], copy[attr])
        return copy
    }
}
//TODO: on closed remove window
function createWindow() {
    var window = new BrowserWindow({title: package.name})
    window.loadURL('file://' + (CONFIG.ui ? path.resolve(__dirname, 'ui.html') : path.resolve(app_path, CONFIG.base_html)), CONFIG.main_window_options || {})
    window.on('closed', () => {
        window = null
        var index = windows.indexOf(null)
        windows = windows.splice(index, 1) //TODO
        if(!windows.length) app.quit()
    })
    windows.push(window)
}
ipc.on('first_load', e => {
    if(CONFIG.ui) e.sender.send('app_path', path.resolve(app_path, CONFIG.base_html || 'ui.html'))
})
ipc.on('new_window', createWindow)
app.on('ready', function() {
    if(CONFIG.main) {
        main = new BrowserWindow({title: package.name})
        main.loadURL('file://' + (CONFIG.ui ? path.resolve(__dirname, 'ui.html') : path.resolve(app_path, CONFIG.base_html)), CONFIG.main_window_options || {})
        main.on('closed', app.quit)
    } else createWindow()
})
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function() {
    if (mainWindow === null) initialiseMain()
})
/*if(argv.express) { //TODO: how to use fs?
    var express = require('express'),
        app = express()
    app.listen(CONFIG.port || 8080)
}*/
