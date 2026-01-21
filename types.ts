export interface Flower {
  rank: number;
  name: string;
  englishName: string;
  plantingPeriod: string;
  bloomingPeriod: string;
  characteristics: string;
  caution: string;
  relatedFlowers: string[];
}

export type ViewState = 'LANDING' | 'LOADING' | 'RESULTS' | 'ERROR';