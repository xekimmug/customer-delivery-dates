import {DeliveryService} from '../../../src/services/deliveryService';
import {DeliveryRequest} from '../../../src/models/request';
import {DeliveryDate} from '../../../src/models/deliveryDate';

describe('delivery service', () => {
    const sut = new DeliveryService();

    it('getProductsAndCalcDelivery should pass', () => {
        const deliveryRequest: DeliveryRequest = {
            "postalCode": 123,
            "productIds": ["E-001", "N-001", "T-001"],
            startDate: '2022-09-26'
        };

        const plusTwoWeekDates: Pick<DeliveryDate, 'date' | 'isGreenDelivery'>[] = sut.getProductsAndCalcDelivery(deliveryRequest);
        expect(plusTwoWeekDates.length).toBe(1);
    });

    it('getProductsAndCalcDelivery should fail when there are no available delivery dates', () => {
        const deliveryRequest: DeliveryRequest = {
            postalCode: 123,
            productIds: ["E-002", "N-002", "T-002"],
            startDate: '2022-09-26'
        };

        try {
            sut.getProductsAndCalcDelivery(deliveryRequest);
            fail('Should have thrown error');
        } catch (error) {
            expect(error.message.includes('There is unfortunately no available delivery dates for your products in the incoming two weeks')).toBe(true)
        }
    });
});