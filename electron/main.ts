import { app, BrowserWindow, shell, protocol, Menu } from 'electron'
import path from 'node:path'

const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
const AUTH_SCHEME = 'drenzo'
const isDev = !!process.env.VITE_DEV_SERVER_URL || !app.isPackaged

let mainWindow: BrowserWindow | null = null

protocol.registerSchemesAsPrivileged([
  { scheme: AUTH_SCHEME, privileges: { standard: false, secure: true, supportFetchAPI: false } },
])

function rendererUrl(search = ''): string {
  const file = path.join(__dirname, '..', 'dist', 'index.html')
  const base = isDev ? DEV_SERVER_URL : `file://${file}`
  return search ? `${base}${search}` : base
}

function handleAuthUrl(url: string): void {
  if (!mainWindow || mainWindow.isDestroyed()) return
  let search = ''
  try {
    const parsed = new URL(url)
    const params = new URLSearchParams(parsed.search)
    const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ''))
    for (const [key, value] of hashParams) {
      if (!params.has(key)) params.set(key, value)
    }
    const query = params.toString()
    if (query) search = `?${query}`
  } catch {}
  mainWindow.loadURL(rendererUrl(search))
  mainWindow.show()
}

function createMainWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1280,
    height: 832,
    minWidth: 480,
    minHeight: 600,
    title: 'Drenzo AI',
    backgroundColor: '#090b10',
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    let parsed: URL
    try {
      parsed = new URL(url)
    } catch {
      return { action: 'deny' }
    }

    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      const host = parsed.hostname
      if (host === 'accounts.google.com' || host.endsWith('.supabase.co')) {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: { width: 520, height: 640, autoHideMenuBar: true },
        }
      }
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  win.webContents.on('will-navigate', (event, url) => {
    const allowed = isDev && url.startsWith(DEV_SERVER_URL)
    if (!allowed) event.preventDefault()
  })

  win.on('closed', () => {
    mainWindow = null
  })

  win.loadURL(rendererUrl())
  return win
}

const gotLock = app.requestSingleInstanceLock()

if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, argv) => {
    const authUrl = argv.find(a => a.startsWith(`${AUTH_SCHEME}://`))
    if (authUrl) handleAuthUrl(authUrl)
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
    }
  })

  app.whenReady().then(() => {
    if (app.isPackaged) Menu.setApplicationMenu(null)
    mainWindow = createMainWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createMainWindow()
      }
    })
  })
}

app.on('open-url', (event, url) => {
  event.preventDefault()
  if (url.startsWith(`${AUTH_SCHEME}://`)) handleAuthUrl(url)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
