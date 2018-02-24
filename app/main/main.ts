const { format } = require('url');
const ioHook = require('iohook');
const { BrowserWindow, app, Tray, Menu, nativeImage } = require('electron');
const isDev = require('electron-is-dev');
const { resolve } = require('app-root-path');

let tray;
let contextMenu;
let mainWindow;
// Tray Icon as Base64 so tutorial has less overhead
let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw
7AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AkZCg87wZW7ewA
AAp1JREFUOMuV1U2IVlUcx/HPnbc0MWwEF40hRWRQmWhEUi4KorlTQ0zQKgqSxKinRYuWrdq0iIp8DAy
CFmYUUVTYY0Qw0SsYVDQRlFlQU4o4VDMUY9NzWtz/45znzo3yv7n/l3O+53fOPS+F/7R9G0l34Vlap/x
PG+gPby76471jpJdxI4p/x5QrakPVZ3yI4lLSLH4LpetIT5N24AWKpZXAW4boXogFnGxQXEzhdQYHl0v
pbtJkBIOkBqXpVhzAWIPi8hocxCyH5qp0e10oHY6BNy3P7szULyc9hzkGTjat8WPRqctkD3QORrJ211J
srPV7CKP4i7S6CXxF+GtY2lG5D5yg+D6bckHaRXs463dV+OtJVzeBj4Q/inuy2uf4NYPvyVR38Vn4GzD
ZAC5ezHbITsqtEU8HvGcjpFblDncpDma16yhvqit+c3mLuQj3Vm7rJ4r3kW+z+6sD80aKQWcivwm318B
pHk9mA11PuSXil/B1thyrSA9HMI8nMtYNlDszcKdbHVcLkduCO0L1VxTv1VTv5plR3lrCuzga+c2YqB2
QNEfqjV7EWl8c8X78kKleTTfWeuA49maDjlNuz8CHFykOYDEabKvg0Jqh+AB/Z4D7qs+h03gbxyK/FVf
WL6FfsC/8tdGoZ0/hRKZ6A+2pUP1jdZecse01cGcBr2YNzqdcG6q/oDgS+7e3XLeF6j/wTvzM6Lfi2nQ
KP8e0P6Ezn9X2488MvLnW75vwP2wCr8J5eD4upsxaHZzOwNNZcU2c3FfwWg1cDuISfIxH6fzedE8G90s
8nuXH8B0eoXNc/6tQjsQfXaQz0/BEXUD3W4oF0hQPflTlJwZIl+FcOp86e2vvoj1Le6I/P974ZA2dBXk
97qQ13Z8+3PS0+AdjKa1R95YOZgAAAABJRU5ErkJggg==`;

const audioKeysAndLengths = {
  kd: 5,
  ku: 5,
  md: 5, 
  mu: 5
};

const random = (min, max) => Math.floor(Math.random()*(max-min+1)+min);

const keys = Object.keys(audioKeysAndLengths)
  .reduce(
    (all, key) => {
      for (let x = 1; x <= audioKeysAndLengths[key]; x++) {
        all[key] = all[key] || [];
        all[key].push(`${key.toUpperCase()}-${x}.mp3`);
      }
      return all;
    },
    [] 
  );

const handleInput = (type) => () => {
  mainWindow.webContents.send('play', format({
    pathname: resolve(`app/assets/${keys[type][random(0,4)]}`),
    protocol: 'file:',
    slashes: true
  }));
};

ioHook.on("keyup", handleInput('ku'));

app.on('ready', async () => {

  const icon = nativeImage.createFromDataURL(base64Icon);
  tray = new Tray(icon);
  tray.setToolTip('Smooth, clean keyboard click emulation for the most prodigious screencasters.');
  contextMenu = Menu.buildFromTemplate([
    {label: 'Emulate Clicks', type: 'checkbox'},
    {label: 'Exit', type: 'normal', click: app.quit}
  ]);
  tray.setContextMenu(contextMenu);

  // Add a click handler so that when the user clicks on the menubar icon, it shows
  // our popup window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: !isDev,
      preload: __dirname + '/preload.js',
      webSecurity: false
    }
  });

  if (isDev) mainWindow.webContents.openDevTools({mode: 'detach'})

  const devPath = 'http://localhost:1124';
  const prodPath = format({
    pathname: resolve('app/renderer/.parcel/production/index.html'),
    protocol: 'file:',
    slashes: true
  });
  const url = isDev ? devPath : prodPath;

  mainWindow.setMenu(null);
  mainWindow.loadURL(url);
  //Register and start hook
  ioHook.start();
});

app.on('window-all-closed', app.quit);
