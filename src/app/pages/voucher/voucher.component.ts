import { Component, OnInit, ViewChild } from "@angular/core";
import { VoucherService } from "../../_services/voucher.service";
import { Voucher, VoucherStatus, VoucherUnitValue } from "../../_models/voucher";
import { AccountService } from "../../_services/account.service";
import { Brand } from "../../_models/brand";
import { ImageService } from "../../image.service";
import { TransactionService } from "../../_services/transaction.service";
import { ToastComponent } from "../../shared/toast/toast.component";

@Component({
  selector: "app-voucher",
  templateUrl: "./voucher.component.html",
  styleUrl: "./voucher.component.css",
})
export class VoucherComponent implements OnInit {
  vouchers: Voucher[] = [];
  @ViewChild(ToastComponent) toast: ToastComponent;
  voucher: Voucher = { id: '', brand: {} as Brand, voucherCode: '', qrCode: '', image: '', value: 0, description: '', expiredDate: '', VoucherStatus: VoucherStatus.ACTIVE, unitValue: VoucherUnitValue.PERCENT };
  userId: string = "";
  modalItemOpen = false;
  voucherId: string = '';
  disableButton: boolean = true;
  itemModalContent = "This is the gift from AAA event";
  modalTitle = "";
  imgVoucher: string = '';
  constructor(
    private voucherService: VoucherService,
    private accountService: AccountService,
    private imageService: ImageService,
    private transactionService: TransactionService
  ) {}
  ngOnInit(): void {
    this.accountService.getMyInfo().subscribe({
      next: (userData: any) => {
        this.userId = userData.result.id;
        this.voucherService.getVouchersByPlayer(this.userId).subscribe({
          next: (voucherData: any) => this.vouchers = voucherData
        });
      },
    });
  }
  onClose() {
    this.modalItemOpen = false;
  }
  onSubmit(voucherId: string) {
    this.transactionService.transactionVoucherUsed([{
      playerId: this.userId,
      recipientId: this.userId,
      artifactId: this.voucher.id,
      eventId:'',
      transactionDate: new Date().toISOString(),
      transactionType: 'voucher_used',
      quantity: 1
    }]).subscribe({
      next: (data) => {
        console.log('Transaction: ', data);
        this.toast.openToast("Use Voucher Successfully", "fa-check");
        this.modalItemOpen = false;
      }
    })
  }
  openModal(voucherId: string) {
    this.voucherId = voucherId;
    this.modalItemOpen = true;
    this.voucherService.getVoucherById(voucherId).subscribe({
      next: (voucherData: any) => {
        this.voucher = voucherData;
        this.modalTitle = this.voucher.description;
        this.imageService.getImageUrl(this.voucher.qrCode).subscribe({
          next: (data) => this.imgVoucher = data
        })
        console.log(this.voucher)
      },
    })
  }
}
