const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const store = new Store();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  // Uncomment for development
  // mainWindow.webContents.openDevTools();
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

// IPC Handlers
ipcMain.handle('save-connection-string', async (event, connectionString) => {
  store.set('connectionString', connectionString);
  return { success: true };
});

ipcMain.handle('get-connection-string', async () => {
  return store.get('connectionString', '');
});

ipcMain.handle('connect-service-bus', async (event, connectionString) => {
  try {
    const { ServiceBusClient } = require('@azure/service-bus');
    const client = new ServiceBusClient(connectionString);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('list-topics', async (event, connectionString) => {
  try {
    const { ServiceBusAdministrationClient } = require('@azure/service-bus');
    const adminClient = new ServiceBusAdministrationClient(connectionString);
    
    const topics = [];
    const iterator = adminClient.listTopics();
    let item = await iterator.next();
    
    while (!item.done) {
      topics.push(item.value);
      item = await iterator.next();
    }
    
    return { success: true, topics };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('list-queues', async (event, connectionString) => {
  try {
    const { ServiceBusAdministrationClient } = require('@azure/service-bus');
    const adminClient = new ServiceBusAdministrationClient(connectionString);
    
    const queues = [];
    const iterator = adminClient.listQueues();
    let item = await iterator.next();
    
    while (!item.done) {
      queues.push(item.value);
      item = await iterator.next();
    }
    
    return { success: true, queues };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('peek-message', async (event, connectionString, queueName, count = 1) => {
  try {
    const { ServiceBusClient } = require('@azure/service-bus');
    const client = new ServiceBusClient(connectionString);
    const receiver = client.createReceiver(queueName, { receiveMode: "peekLock" });
    
    const messages = await receiver.peekMessages(count);
    await receiver.close();
    await client.close();
    
    return { 
      success: true, 
      messages: messages.map(msg => ({
        messageId: msg.messageId,
        body: msg.body,
        contentType: msg.contentType,
        correlationId: msg.correlationId,
        enqueuedTimeUtc: msg.enqueuedTimeUtc,
        properties: msg.applicationProperties
      }))
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('receive-delete-message', async (event, connectionString, queueName) => {
  try {
    const { ServiceBusClient } = require('@azure/service-bus');
    const client = new ServiceBusClient(connectionString);
    const receiver = client.createReceiver(queueName, { receiveMode: "receiveAndDelete" });
    
    const messages = await receiver.receiveMessages(1);
    await receiver.close();
    await client.close();
    
    if (messages.length === 0) {
      return { success: true, message: null };
    }
    
    return { 
      success: true, 
      message: {
        messageId: messages[0].messageId,
        body: messages[0].body,
        contentType: messages[0].contentType,
        correlationId: messages[0].correlationId,
        enqueuedTimeUtc: messages[0].enqueuedTimeUtc,
        properties: messages[0].applicationProperties
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});