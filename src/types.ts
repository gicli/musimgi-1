export interface RelatedFlower {
  name: string;
  description: string;
}

export interface Flower {
  rank: number;
  name: string;
  englishName: string;
  plantingPeriod: string;
  bloomingPeriod: string;
  characteristics: string;
  caution: string;
  relatedFlowers: RelatedFlower[];
}

export type ResponseData = 
  | { type: 'list'; flowers: Flower[] }
  | { type: 'detail'; content: string; name: string };

export type ViewState = 'LANDING' | 'LOADING' | 'RESULTS' | 'ERROR';
