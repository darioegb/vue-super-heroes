export interface CustomTranslateResponse {
  dropdownTranslate: <T extends Record<number, string>>(
    path: string,
    value: number,
    object: T
  ) => string;
}
