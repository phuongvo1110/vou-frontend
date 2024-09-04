import { Item } from "./item";

export class ConversionParams {
    playerId: string;
    recipientId: string;
    artifactId: string;
    eventId?: string;
    items?: {itemId: string, quantity: number}[];
    transactionDate: string;
    quantity: number;
    transactionType: string;
}