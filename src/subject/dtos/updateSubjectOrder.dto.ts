export interface UpdateSubjectOrderInterface {
    _id: string;
    name: string;
    shortName: string;
    description?: string;
    user?: string;
    journeys?: string[];
    order: Number;
    createdAt: string;
    __v: number;
    updatedAt: string;
    journey?: string;
  }
  
  export class UpdateSubjectOrderDto {
    subjects: UpdateSubjectOrderInterface[];
  }
  