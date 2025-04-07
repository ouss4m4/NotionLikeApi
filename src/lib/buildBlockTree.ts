import { Block } from "@prisma/client"; // Adjust the import based on your setup

export const buildBlockTree = (blocks: Block[], parentId: string | null = null): Block[] => {
  return blocks.filter((b) => b.parentId === parentId).map((b) => ({ ...b, children: buildBlockTree(blocks, b.id) }));
};
