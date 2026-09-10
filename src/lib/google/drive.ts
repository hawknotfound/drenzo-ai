import { ensureToken, silentRefresh } from './auth'

const DRIVE_BASE = 'https://www.googleapis.com/drive/v3'
const DRIVE_UPLOAD = 'https://www.googleapis.com/upload/drive/v3'

async function request(
  method: string,
  url: string,
  body?: string | FormData,
  contentType?: string
): Promise<Response> {
  let token = await ensureToken()
  let headers: Record<string, string> = { Authorization: `Bearer ${token}` }
  if (body && contentType) headers['Content-Type'] = contentType

  let res = await fetch(url, { method, headers, body })

  if (res.status === 401) {
    const refreshed = await silentRefresh()
    if (refreshed) {
      headers = { Authorization: `Bearer ${refreshed}` }
      if (body && contentType) headers['Content-Type'] = contentType
      res = await fetch(url, { method, headers, body })
    }
  }

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Drive API ${res.status}: ${err}`)
  }

  return res
}

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  modifiedTime: string
}

export async function listFiles(): Promise<DriveFile[]> {
  const res = await request(
    'GET',
    `${DRIVE_BASE}/files?spaces=appDataFolder&fields=files(id,name,mimeType,modifiedTime)`
  )
  const data = await res.json()
  return data.files || []
}

export async function readFileContent(fileId: string): Promise<string> {
  const res = await request('GET', `${DRIVE_BASE}/files/${fileId}?alt=media`)
  return res.text()
}

export async function createFile(
  name: string,
  content: string,
  mimeType = 'application/json'
): Promise<string> {
  const boundary = '----Boundary' + Math.random().toString(36).slice(2)
  const metadata = JSON.stringify({ name, parents: ['appDataFolder'] })
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    metadata,
    `--${boundary}`,
    `Content-Type: ${mimeType}`,
    '',
    content,
    `--${boundary}--`,
  ].join('\r\n')

  const res = await request(
    'POST',
    `${DRIVE_UPLOAD}/files?uploadType=multipart&fields=id`,
    body,
    `multipart/related; boundary=${boundary}`
  )
  const data = await res.json()
  return data.id
}

export async function updateFileContent(fileId: string, content: string): Promise<void> {
  await request(
    'PATCH',
    `${DRIVE_UPLOAD}/files/${fileId}?uploadType=media`,
    content,
    'application/octet-stream'
  )
}

export async function deleteFile(fileId: string): Promise<void> {
  await request('DELETE', `${DRIVE_BASE}/files/${fileId}`)
}

export async function findFileByName(name: string): Promise<DriveFile | null> {
  const files = await listFiles()
  return files.find(f => f.name === name) ?? null
}

export async function getOrCreateFile(
  name: string,
  fallbackContent = '[]'
): Promise<{ id: string; content: string }> {
  const existing = await findFileByName(name)
  if (existing) {
    const content = await readFileContent(existing.id)
    return { id: existing.id, content }
  }
  const id = await createFile(name, fallbackContent)
  return { id, content: fallbackContent }
}

export async function writeJSON(
  name: string,
  data: unknown
): Promise<void> {
  const content = JSON.stringify(data, null, 2)
  const existing = await findFileByName(name)
  if (existing) {
    await updateFileContent(existing.id, content)
  } else {
    await createFile(name, content)
  }
}

export async function readJSON<T = unknown>(name: string): Promise<T | null> {
  const existing = await findFileByName(name)
  if (!existing) return null
  try {
    const content = await readFileContent(existing.id)
    return JSON.parse(content) as T
  } catch {
    return null
  }
}
