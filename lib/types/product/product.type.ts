import { Moeny } from "./money.type";

export interface Product {
    createdAt?: string,
    Description?: string,
    id?: string;
    imageURL?: string;
    price?: Moeny;
    title?: string;
    updatedAt?: string;
    url?: string;
}