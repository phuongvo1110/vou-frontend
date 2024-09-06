import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConversionParams } from '../_models/conversion';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private httpClient: HttpClient) { }
  transactionVoucherConversion(params: ConversionParams[]) {
    return this.httpClient.post(`${environment.apiUrl}/api/v1/statistics/api/transactions/process`, params)
  }
  transactionVoucherUsed(params: ConversionParams[]) {
    return this.httpClient.post(`${environment.apiUrl}/api/v1/statistics/api/transactions/process`, params)
  }
  transactionItemShared(params: ConversionParams[]) {
    return this.httpClient.post(`${environment.apiUrl}/api/v1/statistics/api/transactions/process`, params)
  }
}
