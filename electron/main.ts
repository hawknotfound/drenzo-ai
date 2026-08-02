import { app, BrowserWindow, shell, protocol, net, Menu } from 'electron'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173'
const AUTH_SCHEME = 'drenzo'
const APP_SCHEME = 'app'
const isDev = !!process.env.VITE_DEV_SERVER_URL || !app.isPackaged

const distRoot = path.join(__dirname, '..', 'dist')

let mainWindow: BrowserWindow | null = null
let googlePopup: BrowserWindow | null = null

protocol.registerSchemesAsPrivileged([
  { scheme: AUTH_SCHEME, privileges: { standard: false, secure: true, supportFetchAPI: false } },
  {
    scheme: APP_SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true },
  },
])

function rendererUrl(search = ''): string {
  const base = isDev ? DEV_SERVER_URL : `${APP_SCHEME}://./index.html`
  return search ? `${base}${search}` : base
}

function registerAppProtocol(): void {
  protocol.handle(APP_SCHEME, (request) => {
    let rel = ''
    try {
      rel = decodeURIComponent(new URL(request.url).pathname).replace(/^\/+/, '')
    } catch {
      return new Response('Bad Request', { status: 400 })
    }
    if (!rel) rel = 'index.html'
    const file = path.normalize(path.join(distRoot, rel))
    if (file !== distRoot && !file.startsWith(distRoot + path.sep)) {
      return new Response('Forbidden', { status: 403 })
    }
    return net.fetch(pathToFileURL(file).toString())
  })
}

function handleAuthUrl(url: string): void {
  if (!mainWindow || mainWindow.isDestroyed()) return
  if (googlePopup && !googlePopup.isDestroyed()) googlePopup.close()
  googlePopup = null
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

  win.webContents.on('did-create-window', (window) => {
    googlePopup = window
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
    registerAppProtocol()
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
