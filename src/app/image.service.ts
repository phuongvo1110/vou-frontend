import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient) {}

  getImageUrl(key: string): Observable<string> {
    return this.http.get<{ signedUrl: string }>(`https://vou.haina.id.vn/api/presign/download/${key}`)
      .pipe(
        map(response => response.signedUrl)
      );
  }
}
