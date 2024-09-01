export class Brand {
    id: string;
    fullName: string;
    username: string;
    accountId: string;
    email: string;
    phone: string;
    role: UserRole;
    brandName: string;
    field: string;
    address: string;
    latitude: number;
    longitude: number;
    status: boolean
}
export enum UserRole {
    admin, brand, player
}