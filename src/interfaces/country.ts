export namespace ICountriesResponse {
  export type Countries = Country[];

  export interface Country {
    country: string;
    geonameid: number;
    name: string;
    subcountry?: string;
  }
}
