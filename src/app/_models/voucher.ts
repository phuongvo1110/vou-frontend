import { Brand } from "./brand";

export class Voucher {
    id: string;
    brand: Brand;
    voucherCode: string;
    qrCode: string;
    image: string;
    value: number;
    description: string;
    expiredDate: string;
    VoucherStatus: VoucherStatus;
    unitValue: VoucherUnitValue;
    voucherType: 'online' | 'offline'
}
export enum VoucherStatus {
    ACTIVE,
    INACTIVE,
    EXPIRED
}
export enum VoucherUnitValue {
    PERCENT,
    MINUS,
    MINUS_PERCENT
}