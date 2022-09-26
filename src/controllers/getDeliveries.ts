import {DeliveryRequest} from '../models/request';
import {DeliveryService} from '../services/deliveryService';
import {DuplicatedProductIdsError, EmptyArrayError, MandatoryFieldMissingError} from '../errors/requestError';
import {DeliveryDate} from '../models/deliveryDate';
import {DeliveryResponse} from '../models/response';

const ONE_DAY_IN_MS = 1000 * 3600 * 24;

const prepareAndSendResponse = (availableDeliveryDates: Pick<DeliveryDate, "date" | "isGreenDelivery">[],
                                postalCode: number,
                                startDate: string): DeliveryResponse[] => {
    const processedDates = availableDeliveryDates
        .map(d => ({
            postalCode,
            deliveryDate: d.date,
            isGreenDelivery: d.isGreenDelivery
        }) as DeliveryResponse)
        .sort((d1, d2) => d1.deliveryDate < d2.deliveryDate ? 1 : -1);

    prioritizeGreenDeliveryDates(processedDates, startDate);

    return processedDates;
}

export const getDeliveries = (request: DeliveryRequest): DeliveryResponse[] => {
    checkRequest(request);
    const availableDeliveryDates: Pick<DeliveryDate, 'date' | 'isGreenDelivery'>[] = new DeliveryService().getProductsAndCalcDelivery(request);
    return prepareAndSendResponse(availableDeliveryDates, request.postalCode, request.startDate);
}

const checkRequest = (request?: DeliveryRequest) => {
    const postalCode: number = request?.postalCode;
    const productIds: string[] = request?.productIds;

    if (!postalCode) {
        throw new MandatoryFieldMissingError('postalCode');

    }
    if (!productIds) {
        throw new MandatoryFieldMissingError('productIds');
    }

    if (productIds.length === 0) {
        throw new EmptyArrayError('productIds');
    }

    const duplicatedProductIds = findDuplicates(productIds);
    if (duplicatedProductIds.length > 0) {
        throw new DuplicatedProductIdsError(duplicatedProductIds);
    }
}

const prioritizeGreenDeliveryDates = (processedDates: DeliveryResponse[],
                                      startDate?: string) => {
    const greenDeliveryDatesWithinThree: DeliveryResponse[] = processedDates
        .filter(d => d.isGreenDelivery && isGreenDeliveryWithinNextThreeDays(d, startDate));
    greenDeliveryDatesWithinThree.forEach(d => {
        const index = processedDates.findIndex(pd => pd.deliveryDate === d.deliveryDate);
        processedDates.unshift(processedDates.splice(index, 1)[0]);
    });
};

const findDuplicates = (arr: string[]) => arr.filter((item: string, index: number) => arr.indexOf(item) !== index);

const isGreenDeliveryWithinNextThreeDays = (d: DeliveryResponse, startDate?: string) => {
    const currentDate: Date = startDate ? new Date(startDate) : new Date();
    return (new Date(d.deliveryDate).getTime() - currentDate.getTime()) / (ONE_DAY_IN_MS) <= 3;
};