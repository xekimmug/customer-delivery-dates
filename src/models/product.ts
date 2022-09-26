export type ProductsCollection = {
    maxDaysInAdvance: number,
    unavailableWeekDays: number[],
    external: Product[];
    normal: Product[];
    temporary: Product[];
}

export type Product = {
    productId: string;
    name: string;
    deliveryDays: number[];
    productType: ProductType;
    daysInAdvance: number;
}

export const enum ProductType {
    NORMAL = 'normal',
    TEMPORARY = 'temporary',
    EXTERNAL = 'external'
}