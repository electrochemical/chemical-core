var ipc = require('electron').ipcRenderer,
    dialog = require('electron').dialog,
    $ = require('jquery'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    //CONFIG = require('./config'), //TODO: local_config
    //render = require(''), //TODO
    selected_tab_indices = [],
    tabs = [] //name, content (if !dir), unsaved, pages (history), page_index, loaded
    //TODO: get local config
if(!this.loaded) ipc.send('first_load')
this.loaded = true
//can delete/can delete children, can move, can move between tab rows
ipc.on('app_path', function(e, path) {
    fs.readFile(path, 'utf8', (err, data) => {
        $('#tabs').append(`<li>${data}</li>`)
    })
})
$().on('create_tab', (e, content, indices) => {
    var before = $('#tabbar')
    for(var i in indices) {
        index = indices[i]
        before = before.children(`:eq(${i})`)
    }
    before.after(content)
})


//TODO: only show if tab has history (i.e. tab.pages)
this.changePage = function(path) {
    var first,
        last,
        page = tab.pages[tab.page_index],
        next = tab.pages[tab.page_index + 1]
    if(next && next !== path) tab.pages = tab.pages.splice(tab.page_index)
    tab.pages.push(path)
    tab.page_index++
    if(tab.page_index === 0) $('#back').addClass('disabled')
    if(!tab.pages[tab.page_index + 1]) $('#forward').addClass('disabled')
    render(path)
}
