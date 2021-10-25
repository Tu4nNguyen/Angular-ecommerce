
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Country } from '../common/country';
import { map } from 'rxjs/operators';
import { State } from './../common/state';

@Injectable({
  providedIn: 'root'
})
export class Tu4nnguyenShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private HttpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{
    return this.HttpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]>{

    // search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.HttpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(respone => respone._embedded.states)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]>{


    let data: number[] = [];

    //build an array for "Month" dropdown list
    // start at current month and loop until

    for (let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of(data);
  }


  getCreditCardYers(): Observable<number[]>{

    let data: number[] = [];

    //build an array for "Year" dropdown list
    // start at current Year and loop until

   const startYear: number = new Date().getFullYear();
   const endYear: number = startYear + 10;

   for (let theYear = startYear; theYear <= endYear; theYear++){
     data.push(theYear);
   }

   return of(data);
  }
}

interface GetResponseCountries{
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  }
}
