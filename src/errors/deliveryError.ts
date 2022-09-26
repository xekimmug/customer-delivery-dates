import {v4 as uuidv4} from 'uuid';

export abstract class DeliveryError extends Error {
    constructor(message: string) {
        super(`${message} (debugId: DeliveryError|${uuidv4()})`);
        console.error(this);
    }
}

export class NoDeliveryDatesAvailableTheIncomingTwoWeeksError extends DeliveryError {
    constructor() {
        super(`There is unfortunately no available delivery dates for your products in the incoming two weeks`);
    }
}

export class TemporaryProductDaysInAdvanceInvalidError extends DeliveryError {
    constructor(productId: string) {
        super(`Temporary product cannot have 'daysInAdvance' >= 7 since it can only be ordered in current week, productId: ${productId} `);
    }
}