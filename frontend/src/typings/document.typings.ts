export interface IUser {
  id: string
  email: string
  name: string
}
export interface IDocument {
  id: string
  title: string
  tags: string[]
  workspaceId: string
  author: IUser
  createdAt: string
  updatedAt: string
}

export type IBlockType = 'text' | 'heading' | 'list' | 'image' | 'code' | 'embed'

export interface IBlock {
  id: string
  type: IBlockType
  content: string
  documentId: string
  createdById: string
  parentId?: IBlock
  createdAt: string
  children: IBlock[]
}

export interface IDocumentDetails extends IDocument {
  blocks: IBlock[]
}
