export interface Plan {
  _id: string;
  price: number;
  features: string[];
  name: string;
  type: string;
}

export interface ModelList {
  title: string;
  extra: string;
  apiURL: string;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}