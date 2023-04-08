export type Todo = {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  title: string;
  notes: string;
};
