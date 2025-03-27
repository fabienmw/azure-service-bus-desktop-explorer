document.addEventListener('DOMContentLoaded', async () => {
    const connectionStringInput = document.getElementById('connectionString');
    const connectBtn = document.getElementById('connectBtn');
    const connectionStatus = document.getElementById('connectionStatus');
    const refreshTopicsBtn = document.getElementById('refreshTopicsBtn');
    const refreshQueuesBtn = document.getElementById('refreshQueuesBtn');
    const topicsList = document.getElementById('topicsList');
    const queuesList = document.getElementById('queuesList');
    const selectedEntity = document.getElementById('selectedEntity');
    const peekBtn = document.getElementById('peekBtn');
    const receiveDeleteBtn = document.getElementById('receiveDeleteBtn');
    const messageContent = document.getElementById('messageContent');
  
    let currentConnectionString = '';
    let selectedQueue = null;
  
    // Load saved connection string
    const savedConnectionString = await window.api.getConnectionString();
    if (savedConnectionString) {
      connectionStringInput.value = savedConnectionString;
    }
  
    // Connect to Service Bus
    connectBtn.addEventListener('click', async () => {
      const connectionString = connectionStringInput.value.trim();
      
      if (!connectionString) {
        connectionStatus.textContent = 'Please enter a connection string';
        connectionStatus.className = 'error';
        return;
      }
  
      connectionStatus.textContent = 'Connecting...';
      connectionStatus.className = '';
  
      try {
        const result = await window.api.connectServiceBus(connectionString);
        
        if (result.success) {
          connectionStatus.textContent = 'Connected successfully!';
          connectionStatus.className = 'success';
          currentConnectionString = connectionString;
          await window.api.saveConnectionString(connectionString);
          
          // Enable buttons
          refreshTopicsBtn.disabled = false;
          refreshQueuesBtn.disabled = false;
          
          // Load topics and queues
          await loadTopics();
          await loadQueues();
        } else {
          connectionStatus.textContent = `Connection failed: ${result.error}`;
          connectionStatus.className = 'error';
        }
      } catch (error) {
        connectionStatus.textContent = `Error: ${error.message}`;
        connectionStatus.className = 'error';
      }
    });
  
    // Load topics
    async function loadTopics() {
      if (!currentConnectionString) return;
      
      topicsList.innerHTML = '<li>Loading topics...</li>';
      
      try {
        const result = await window.api.listTopics(currentConnectionString);
        
        if (result.success) {
          topicsList.innerHTML = '';
          
          if (result.topics.length === 0) {
            topicsList.innerHTML = '<li>No topics found</li>';
          } else {
            result.topics.forEach(topic => {
              const li = document.createElement('li');
              li.textContent = topic.name;
              topicsList.appendChild(li);
            });
          }
        } else {
          topicsList.innerHTML = `<li class="error">Error: ${result.error}</li>`;
        }
      } catch (error) {
        topicsList.innerHTML = `<li class="error">Error: ${error.message}</li>`;
      }
    }
  
    // Load queues
    async function loadQueues() {
      if (!currentConnectionString) return;
      
      queuesList.innerHTML = '<li>Loading queues...</li>';
      
      try {
        const result = await window.api.listQueues(currentConnectionString);
        
        if (result.success) {
          queuesList.innerHTML = '';
          
          if (result.queues.length === 0) {
            queuesList.innerHTML = '<li>No queues found</li>';
          } else {
            result.queues.forEach(queue => {
              const li = document.createElement('li');
              li.textContent = queue.name;
              li.addEventListener('click', () => {
                // Deselect any previously selected queue
                const selected = queuesList.querySelector('.selected');
                if (selected) selected.classList.remove('selected');
                
                // Select this queue
                li.classList.add('selected');
                selectedQueue = queue.name;
                selectedEntity.textContent = queue.name;
                
                // Enable message actions
                peekBtn.disabled = false;
                receiveDeleteBtn.disabled = false;
              });
              queuesList.appendChild(li);
            });
          }
        } else {
          queuesList.innerHTML = `<li class="error">Error: ${result.error}</li>`;
        }
      } catch (error) {
        queuesList.innerHTML = `<li class="error">Error: ${error.message}</li>`;
      }
    }
  
    // Refresh topics
    refreshTopicsBtn.addEventListener('click', loadTopics);
  
    // Refresh queues
    refreshQueuesBtn.addEventListener('click', loadQueues);
  
    // Peek message
    peekBtn.addEventListener('click', async () => {
      if (!selectedQueue) return;
      
      messageContent.textContent = 'Loading message...';
      
      try {
        const result = await window.api.peekMessage(currentConnectionString, selectedQueue);
        
        if (result.success) {
          if (result.messages.length === 0) {
            messageContent.textContent = 'No messages in queue';
          } else {
            const message = result.messages[0];
            messageContent.textContent = JSON.stringify(message, null, 2);
          }
        } else {
          messageContent.textContent = `Error: ${result.error}`;
        }
      } catch (error) {
        messageContent.textContent = `Error: ${error.message}`;
      }
    });
  
    // Receive and delete message
    receiveDeleteBtn.addEventListener('click', async () => {
      if (!selectedQueue) return;
      
      messageContent.textContent = 'Receiving and deleting message...';
      
      try {
        const result = await window.api.receiveDeleteMessage(currentConnectionString, selectedQueue);
        
        if (result.success) {
          if (!result.message) {
            messageContent.textContent = 'No messages in queue';
          } else {
            messageContent.textContent = `Message received and deleted:\n\n${JSON.stringify(result.message, null, 2)}`;
          }
        } else {
          messageContent.textContent = `Error: ${result.error}`;
        }
      } catch (error) {
        messageContent.textContent = `Error: ${error.message}`;
      }
    });
  
    // Initialize buttons
    refreshTopicsBtn.disabled = true;
    refreshQueuesBtn.disabled = true;
    peekBtn.disabled = true;
    receiveDeleteBtn.disabled = true;
  });