import {DeliveryRepo} from '../../../src/repositories/deliveryRepo';
import {DeliveryDate} from '../../../src/models/deliveryDate';

describe('delivery repo', () => {
    const sut = new DeliveryRepo();

    it('getPlusTwoWeekDates from 2022-10-04 should pass and all Wednesdays should be green deliveries', () => {
        //2022-10-04 is a Tuesday
        const plusTwoWeekDates: DeliveryDate[] = sut.getPlusTwoWeekDates(new Date('2022-10-04'));
        expect(plusTwoWeekDates.length).toBe(14);

        const nextDeliveryDate = plusTwoWeekDates[0];
        expect(nextDeliveryDate.date).toBe('2022-10-05');
        expect(nextDeliveryDate.dayOfWeek).toBe(3);
        expect(nextDeliveryDate.isCurrentWeek).toBe(true);
        expect(nextDeliveryDate.isGreenDelivery).toBe(false);

        const nextFriday = plusTwoWeekDates[9];
        expect(nextFriday.date).toBe('2022-10-14');
        expect(nextFriday.dayOfWeek).toBe(5);
        expect(nextFriday.isCurrentWeek).toBe(false);
        expect(nextFriday.isGreenDelivery).toBe(true);

        const lastDayInRange = plusTwoWeekDates[13];
        expect(lastDayInRange.date).toBe('2022-10-18');
        expect(lastDayInRange.dayOfWeek).toBe(2);
        expect(lastDayInRange.isCurrentWeek).toBe(false)
        expect(lastDayInRange.isGreenDelivery).toBe(false);
    });
});