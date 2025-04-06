let’s go with the Notion-like app, since it’ll give you a playground for:
	•	Hierarchical/nested data (blocks)
	•	Mixed embedded vs referenced documents
	•	Real-world features like tagging, permissions, and versioning
	•	Complex queries (e.g. deep block trees, lookups, filters)

App Concept: “NoteSpace” – A Notion-style knowledge base
Core Features (MVP)
	1.	Users can join or create Workspaces
	2.	Each workspace can have many Documents
	3.	Documents are made of nested Blocks (text, headings, lists, embeds, etc.)
	4.	Blocks can contain other blocks (tree structure)
	5.	Comments on blocks or documents
	6.	Tags for organizing documents
	7.	Permissions per workspace (owner, editor, viewer)

Users
{
  _id: ObjectId,
  email: string,
  name: string,
  workspaces: ObjectId[] // reference to workspaces
}

WorkSpaces
{
  _id: ObjectId,
  name: string,
  members: [{ userId: ObjectId, role: 'owner' | 'editor' | 'viewer' }]
}

Documents
{
  _id: ObjectId,
  title: string,
  workspaceId: ObjectId,
  authorId: ObjectId,
  tags: string[],
  blocks: ObjectId[], // root blocks (the rest are nested)
  createdAt: Date,
  updatedAt: Date
}

blocks
{
  _id: ObjectId,
  type: 'text' | 'heading' | 'list' | 'image' | 'code' | 'embed',
  content: string | { url: string } | any,
  parentId: ObjectId | null,
  children: ObjectId[],
  documentId: ObjectId,
  createdBy: ObjectId,
  createdAt: Date
}

Comments
{
  _id: ObjectId,
  content: string,
  userId: ObjectId,
  targetType: 'document' | 'block',
  targetId: ObjectId,
  createdAt: Date
}
