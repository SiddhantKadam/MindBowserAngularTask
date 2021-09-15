import { Injectable } from '@angular/core';
import { MainURL } from 'src/app/constants/configUrl';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpmethodsService {

  baseUrl = MainURL.HostUrl;
  constructor(private http : HttpClient) { 

  }

  postRequest(url: any,body: any) {
    return this.http.post(this.baseUrl+url,body)
  }

  getRequest(url : any){
    return this.http.get(this.baseUrl+url)
  }

  putRequest(url : any,body : any){
    return this.http.put(this.baseUrl+url,body)
  }

  deleteRequest(url : any){
    return this.http.delete(this.baseUrl+url)
  }


}
