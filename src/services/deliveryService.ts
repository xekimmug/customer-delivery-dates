import {DeliveryRepo} from '../repositories/deliveryRepo';
import {Product, ProductsCollection} from '../models/product';
import {DeliveryRequest} from '../models/request';
import {ProductRepo} from '../repositories/productRepo';
import {DeliveryDate} from '../models/deliveryDate';
import {NoDeliveryDatesAvailableTheIncomingTwoWeeksError} from '../errors/deliveryError';

export class DeliveryService {

    private deliveryRepo: DeliveryRepo;
    private productRepo: ProductRepo;

    constructor() {
        this.deliveryRepo = new DeliveryRepo();
        this.productRepo = new ProductRepo();
    }

    public getProductsAndCalcDelivery(request: DeliveryRequest): Pick<DeliveryDate, 'date' | 'isGreenDelivery'>[] {
        const products: ProductsCollection = this.productRepo.getProductsByIds(request.productIds);
        const plusTwoWeekDates: DeliveryDate[] = this.deliveryRepo.getPlusTwoWeekDates(request.startDate ? new Date(request.startDate) : new Date());

        return this.calcDelivery(products, plusTwoWeekDates);
    }

    private calcDelivery(products: ProductsCollection, plusTwoWeekDates: DeliveryDate[]): Pick<DeliveryDate, 'date' | 'isGreenDelivery'>[] {
        this.excludeDatesForTemporaryProducts(plusTwoWeekDates, products.temporary);
        this.excludeDatesForExternalProducts(plusTwoWeekDates, products.external);
        this.excludeDatesByMaxDaysInAdvance(plusTwoWeekDates, products.maxDaysInAdvance);
        this.excludeDatesByUnavailableWeekDays(plusTwoWeekDates, products.unavailableWeekDays);

        return this.getOnlyAvailableDates(plusTwoWeekDates);
    }

    private excludeDatesForTemporaryProducts(plusTwoWeekDates: DeliveryDate[], temporaryProducts: Product[]) {
        if (temporaryProducts.length > 0) {
            plusTwoWeekDates.filter(d => !d.isCurrentWeek).forEach(d => d.isAvailable = false);
        }
    }

    private excludeDatesForExternalProducts(plusTwoWeekDates: DeliveryDate[], externalProducts: Product[]) {
        if (externalProducts.length > 0) {
            for (let i = 0; i < 5; i++) {
                plusTwoWeekDates[i].isAvailable = false;
            }
        }
    }

    private excludeDatesByMaxDaysInAdvance(plusTwoWeekDates: DeliveryDate[], maxDaysInAdvance: number) {
        for (let i = 0; i < maxDaysInAdvance; i++) {
            plusTwoWeekDates[i].isAvailable = false;
        }
    }

    private excludeDatesByUnavailableWeekDays(plusTwoWeekDates: DeliveryDate[], unavailableWeekDays: number[]) {
        plusTwoWeekDates.filter(d => unavailableWeekDays.includes(d.dayOfWeek)).forEach(d => d.isAvailable = false);
    }

    private getOnlyAvailableDates(plusTwoWeekDates: DeliveryDate[]) {
        const availableDeliveryDates = plusTwoWeekDates.filter(d => d.isAvailable);
        if (availableDeliveryDates.length === 0) {
            throw new NoDeliveryDatesAvailableTheIncomingTwoWeeksError();
        }
        return availableDeliveryDates;
    }
}