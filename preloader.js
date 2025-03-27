const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  saveConnectionString: (connectionString) => ipcRenderer.invoke('save-connection-string', connectionString),
  getConnectionString: () => ipcRenderer.invoke('get-connection-string'),
  connectServiceBus: (connectionString) => ipcRenderer.invoke('connect-service-bus', connectionString),
  listTopics: (connectionString) => ipcRenderer.invoke('list-topics', connectionString),
  listQueues: (connectionString) => ipcRenderer.invoke('list-queues', connectionString),
  peekMessage: (connectionString, queueName, count) => ipcRenderer.invoke('peek-message', connectionString, queueName, count),
  receiveDeleteMessage: (connectionString, queueName) => ipcRenderer.invoke('receive-delete-message', connectionString, queueName)
});