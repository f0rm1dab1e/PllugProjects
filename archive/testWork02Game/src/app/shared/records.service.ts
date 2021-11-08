import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './interfaces';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  constructor(private http: HttpClient) { }

  setRecord(user: User): Observable<any> {
    return this.http.post(`${environment.rbDbUrl}/record.json`, user);
  }
  getRecord(): Observable<Array<User>> {
    return this.http.get<User>(`${environment.rbDbUrl}/record.json`)
      .pipe(
        map((response: { [key: string]: any }) => {
          return Object
            .keys(response)
            .map((key) => ({
              ...response[key],
              id: key,
            }));
        })
      );
  }
}

