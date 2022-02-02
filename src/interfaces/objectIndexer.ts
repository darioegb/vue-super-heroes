export interface ObjectIndexer<T> {
  [key: string]: T;
}

export interface ObjectNumberIndexer {
  [key: number]: string;
}
