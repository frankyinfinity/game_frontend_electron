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

  mainWindow.loadFile('index.html');
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
  if (loginData && loginData.player && loginData.player.id) {
    global.playerId = loginData.player.id;
  }
  mainWindow.loadFile('game.html', {
    query: {
      player: JSON.stringify(loginData.player),
      session_id: loginData.session_id
    }
  });
});

ipcMain.on('logout', (event) => {
  global.playerId = null;
  mainWindow.loadFile('login.html');
});

app.on('will-quit', async (e) => {
  if (global.playerId) {
    e.preventDefault(); // Previeni la chiusura immediata
    const axios = require('axios');
    try {
      await axios.post(`${config.BACKEND_URL}/api/players/close`, {
        player_id: global.playerId
      });
      console.log('Player close request sent successfully');
    } catch (error) {
      console.error('Error sending player close request:', error.message);
    } finally {
      global.playerId = null; // Evita loop infinito
      app.quit(); // Procedi con la chiusura
    }
  }
});