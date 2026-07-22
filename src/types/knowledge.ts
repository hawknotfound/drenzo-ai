export interface KnowledgeFile {
  id: string
  name: string
  path: string
  type: string
  size: number
  updated_at: string
}

export interface KnowledgeContent {
  filename: string
  content: string
  cached_at: number
}
