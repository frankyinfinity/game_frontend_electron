const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const config = require('./config.js');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    title: "gioco",
    autoHideMenuBar: true,
  });

  // Apri gli strumenti di sviluppo (DevTools)
  if (config.DEBUG_MODE) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile('login.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('login-success', (event, loginData) => {
  mainWindow.loadFile('game.html', {
    query: {
      player: JSON.stringify(loginData.player),
      session_id: loginData.session_id
    }
  });
});
