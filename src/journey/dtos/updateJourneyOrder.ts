export interface JourneyInterface {
  _id: string;
  title?: string;
  subject?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: string;
  trails?: string[];
  description?: string;
  user?: string;
  order: number;
}

export class UpdateJourneysOrderDto {
  journeys: JourneyInterface[];
}
