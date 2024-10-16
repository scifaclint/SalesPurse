import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url"; 
import path, { dirname } from "path";
import url from "url"; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function CreateMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "Electron",
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false, 
    },
  });

  // Load the index.html file from the correct directory
  const startUrl = url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true,
  });

  mainWindow.loadURL("http://localhost:5173/"); // Load the index.html file
}

app.whenReady().then(CreateMainWindow);

// Ensure the app closes correctly
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    CreateMainWindow();
  }
});
