import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Voucher } from "../_models/voucher";
import { environment } from "../environments/environment";

@Injectable({
  providedIn: "root",
})
export class VoucherService {
  constructor(private httpClient: HttpClient) {}
  getVouchersByPlayer(playerId: string) {
    return this.httpClient.get<{
      vouchers: Voucher[];
    }>(`${environment.apiUrl}/api/v1/statistics/api/statistics/player_voucher/player/${playerId}`);
  }
  getVoucherById(voucherId: string) {
    return this.httpClient.get<Voucher>(
      `${environment.apiUrl}/api/v1/events/api/vouchers/id/${voucherId}`
    );
  }
}
