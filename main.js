const { app, BrowserWindow } = require('electron');

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#ffffff'
  });

  win.loadURL(`file://${__dirname}/dist/index.html`);

  win.on('closed', ()=> {
    win = null
  })

}


app.on('ready', createWindow);

app.on('window-all-closed', function() {
    app.quit();
})

