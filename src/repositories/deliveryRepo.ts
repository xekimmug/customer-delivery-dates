import {DeliveryDate} from '../models/deliveryDate';

export class DeliveryRepo {

    private readonly TWO_WEEKS_IN_MS = 14 * 24 * 60 * 60 * 1000;

    public getPlusTwoWeekDates(startDate: Date): DeliveryDate[] {
        const endDate: Date = new Date(startDate.getTime() + this.TWO_WEEKS_IN_MS);

        startDate.setDate(startDate.getDate() + 1);

        const deliveryDates: DeliveryDate[] = [];
        while (startDate <= endDate) {
            const date: Date = new Date(startDate);
            deliveryDates.push(
                new DeliveryDate(
                    date.getDay(),
                    date.toISOString().split('T')[0]
                )
            );
            startDate.setDate(startDate.getDate() + 1);
        }

        this.setCurrentWeekForDates(deliveryDates);

        return deliveryDates;
    }

    private setCurrentWeekForDates(deliveryDates: DeliveryDate[]) {
        const isTomorrowMonday = (deliveryDates[0].dayOfWeek === 1);
        if (!isTomorrowMonday) {
            const indexOfNextMonday = deliveryDates.indexOf(deliveryDates.filter(d => d.dayOfWeek === 1)[0]);
            for (let i = 0; i < indexOfNextMonday; i++) {
                deliveryDates[i].isCurrentWeek = true;
            }
        }
    }
}