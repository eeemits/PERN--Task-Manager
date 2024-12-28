export interface TaskList {
  createdAt: Date;
  description: string;
  id?: number;
  status: string;
  title: string;
}

export interface FetchResponse {
  message: string;
  rows: TaskList[];
  status: boolean;
}

export interface HeadCell {
  id?: keyof TaskList;
  label: string;
  numeric: boolean;
  sortable?: boolean;
}
export type Order = 'asc' | 'desc';
