import { Money } from "./money.type";

export interface Product {
    createdAt?: string,
    Description?: string,
    id?: string;
    imageURL?: string;
    price?: Money;
    title?: string;
    updatedAt?: string;
    url?: string;
}