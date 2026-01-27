const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const config = require('./config.js');

let mainWindow;
global.playerId = null;

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

  mainWindow.loadFile('index.html');

  mainWindow.on('close', async (e) => {
    if (global.playerId) {
      e.preventDefault();
      const axios = require('axios');
      try {
        await axios.post(`${config.BACKEND_URL}/api/game/close`, {
          player_id: global.playerId
        });
      } catch (error) {
        console.error('Error sending close request:', error.message);
      } finally {
        global.playerId = null;
        mainWindow.destroy();
      }
    }
  });
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

ipcMain.on('update-player-id', (event, id) => {
  global.playerId = id;
  console.log('Main process playerId updated to:', global.playerId);
});

ipcMain.on('logout', (event) => {
  global.playerId = null;
  mainWindow.loadFile('index.html');
});