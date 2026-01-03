export type Tag = {
  id: string;
  name: string;
  type: "system" | "user";
  color: string;
}

export interface CreateTagPayload {
  name: string;
  color?: string;
  type?: "system" | "user";
}

export type UpdateTagPayload = Partial<CreateTagPayload>;

export interface CreateTagResponse {
  message: string;
  tag: Tag;
}

export interface UpdateTagResponse {
  message: string;
  tag: Tag;
}

export interface TagsResponse {
  tags: Tag[];
  total: number;
}