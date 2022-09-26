import {ProductRepo} from '../../../src/repositories/productRepo';
import {ProductsCollection} from '../../../src/models/product';

describe('product repo', () => {
    const sut = new ProductRepo();

    it('getProductsByIds should pass when product ids are valid', () => {
        const productsCollection: ProductsCollection = sut
            .getProductsByIds(['E-001', 'N-001', 'T-001']);

        expect(productsCollection).toStrictEqual(
            {
                maxDaysInAdvance: 5,
                unavailableWeekDays: [1, 2, 3, 4, 6],
                external: [
                    {
                        "productId": "E-001",
                        "name": "diaper",
                        "deliveryDays": [
                            5,
                            6,
                            0
                        ],
                        "productType": "external",
                        "daysInAdvance": 5
                    }
                ],
                normal: [
                    {
                        "productId": "N-001",
                        "name": "milk",
                        "deliveryDays": [
                            1,
                            2,
                            5,
                            0
                        ],
                        "productType": "normal",
                        "daysInAdvance": 1
                    }
                ],
                temporary: [
                    {
                        "productId": "T-001",
                        "name": "beer",
                        "deliveryDays": [
                            2,
                            3,
                            4,
                            5,
                            6,
                            0
                        ],
                        "productType": "temporary",
                        "daysInAdvance": 2
                    }
                ]
            }
        );
    });

    it('getProductsByIds should fail when any product id is invalid', () => {
        try {
            sut.getProductsByIds(['E-001', 'N-001', 'TT-999']);
            fail('Should have thrown error');
        } catch (error) {
            expect(error.message.includes('No product was found by id: TT-999')).toBe(true);
        }
    });
});