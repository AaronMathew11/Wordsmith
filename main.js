const { BrowserWindow, app, Menu } = require("electron");
const path = require("path");

const isMac = process.platform === "darwin";

const template = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },
  
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

const createWindow = () => {
  const win = new BrowserWindow({
    fullscreen: true,
    show: false,
    // autoHideMenuBar: true,
  });
  win.loadFile("./pages/test.html");

  const splash = new BrowserWindow({
    fullscreen: true,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    autoHideMenuBar: true,
  });
  splash.loadFile("./pages/splashscreen.html");
  splash.center();

  setTimeout(function () {
    splash.close();
    win.show();
  }, 500);
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
