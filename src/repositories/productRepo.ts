import {Product, ProductsCollection, ProductType} from '../models/product';
import testProducts from '../../data/testProducts.json';
import realProducts from '../../data/realProducts.json';
import {NoProductFoundError} from '../errors/productError';
import {TemporaryProductDaysInAdvanceInvalidError} from '../errors/deliveryError';

export class ProductRepo {
    private static readonly WEEK_DAYS = [1, 2, 3, 4, 5, 6, 0];

    public getProductsByIds(productIds: string[]): ProductsCollection {
        //just simulating a dataset, in real world it may be read from DB, storage etc.
        const availableProducts: Product[] = JSON.parse(JSON.stringify(process.env.NODE_ENV === 'test' ? testProducts : realProducts)) as Product[];

        const productsCollection: ProductsCollection = {
            maxDaysInAdvance: 0,
            unavailableWeekDays: [],
            external: [],
            normal: [],
            temporary: []
        };

        for (const pid of productIds) {
            const foundProduct: Product = availableProducts[pid];

            this.checkProductExistence(foundProduct, pid);

            this.checkTemporaryProductValidity(foundProduct);

            switch (foundProduct.productType) {
                case ProductType.EXTERNAL:
                    productsCollection.external.push(foundProduct);
                    foundProduct.daysInAdvance = 5;
                    break;
                case ProductType.NORMAL:
                    productsCollection.normal.push(foundProduct);
                    break;
                case ProductType.TEMPORARY:
                    productsCollection.temporary.push(foundProduct);
                    break;
            }

            const productDaysInAdvance = foundProduct.daysInAdvance;
            if (productDaysInAdvance > productsCollection.maxDaysInAdvance) {
                productsCollection.maxDaysInAdvance = productDaysInAdvance;
            }

            productsCollection.unavailableWeekDays = [...productsCollection.unavailableWeekDays, ...ProductRepo.WEEK_DAYS.filter(weekDay => !foundProduct.deliveryDays.includes(weekDay))];
        }

        productsCollection.unavailableWeekDays = [...new Set(productsCollection.unavailableWeekDays)].sort();

        return productsCollection;
    }

    private checkProductExistence(foundProduct, pid: string) {
        if (!foundProduct) {
            throw new NoProductFoundError(pid);
        }
    }

    private checkTemporaryProductValidity(foundProduct) {
        if (foundProduct.productType === ProductType.TEMPORARY && foundProduct.daysInAdvance >= 7) {
            throw new TemporaryProductDaysInAdvanceInvalidError(foundProduct);
        }
    }
}