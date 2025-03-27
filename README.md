Here's a comprehensive README.md file for your Azure Service Bus Explorer project:

```markdown:README.md
# Azure Service Bus Explorer

A desktop application built with Electron that allows you to explore and interact with Azure Service Bus resources. This tool provides a user-friendly interface for managing topics, queues, and messages in Azure Service Bus.

## Features

- Connect to Azure Service Bus using connection strings
- View list of topics and queues
- Select and interact with queues
- Peek messages without removing them
- Receive and delete messages from queues
- Persistent connection string storage
- Modern, responsive UI

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- An Azure account with an active Service Bus namespace

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd azure-service-bus-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

## Building the Application

To build the application for different platforms:

- Windows:
```bash
npm run build:win
```

- macOS:
```bash
npm run build:mac
```

- Linux:
```bash
npm run build:linux
```

The built applications will be available in the `dist` directory.

## Project Structure

- `index.html` - Main application window layout
- `main.js` - Electron main process file
- `renderer.js` - Frontend JavaScript code
- `preload.js` - Preload script for secure IPC communication
- `styles.css` - Application styling
- `package.json` - Project configuration and dependencies

## Configuration

The application stores connection strings securely using `electron-store`. No additional configuration is required.

## Usage

1. Launch the application
2. Enter your Azure Service Bus connection string
3. Click "Connect" to establish a connection
4. Use the sidebar to view available topics and queues
5. Select a queue to enable message operations
6. Use "Peek Message" to view messages without removing them
7. Use "Receive & Delete Message" to process and remove messages

## Security

- Uses contextIsolation and secure IPC communication
- Connection strings are stored securely using electron-store
- No direct Node.js integration in renderer process

## Dependencies

- `@azure/service-bus` - Azure Service Bus SDK
- `electron` - Desktop application framework
- `electron-store` - Secure storage for connection strings
- `electron-builder` - Application packaging and distribution

## Development

To run the application in development mode:

```bash
npm start
```

To enable developer tools, uncomment the following line in `main.js`:
```javascript
// mainWindow.webContents.openDevTools();
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Troubleshooting

### Common Issues

1. Connection Failed
   - Verify your connection string is correct
   - Ensure you have proper permissions in Azure
   - Check your network connection

2. Messages Not Showing
   - Verify the queue contains messages
   - Check if you have proper access rights
   - Try refreshing the queue list

3. Build Errors
   - Ensure all dependencies are installed
   - Clear npm cache and node_modules
   - Verify Node.js version compatibility

### Debug Mode

To enable debugging:
1. Open DevTools using Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (macOS)
2. Check the console for error messages
3. Enable main process logging by uncommenting the openDevTools line in main.js

## Support

For issues and feature requests, please create an issue in the repository.

```