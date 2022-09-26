import {v4 as uuidv4} from 'uuid';

export abstract class DeliveryError extends Error {
    constructor(message: string) {
        super(`${message} (debugId: DeliveryError|${uuidv4()})`);
        console.error(this);
    }
}

export class NoProductFoundError extends DeliveryError {
    constructor(productId: string) {
        super(`No product was found by id: ${productId}`);
    }
}