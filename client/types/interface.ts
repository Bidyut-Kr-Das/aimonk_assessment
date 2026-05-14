export interface TreeNode {
  id: number;
  name: string;
  children?: TreeNode[];
  data?: string;
  parent: number | null;
}
