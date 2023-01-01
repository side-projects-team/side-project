import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  public getClaims = (route: string) => {
    return this.http.get(this.createCompletedRoute(route, this.envUrl.urlAddress));
  }

  public createCompletedRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`
  }
}
