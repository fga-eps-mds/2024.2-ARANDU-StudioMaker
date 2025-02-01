export interface UpdateKnowledgeOrderInterface {
  _id: string;
  name: string;
  description?: string;
  user?: string;
  subjects?: string[];
  order: Number;
  createdAt: string;
  __v: number;
  updatedAt: string;
}

export class UpdateKnowledgeOrderDTO {
  knowledge: UpdateKnowledgeOrderInterface[];
}
