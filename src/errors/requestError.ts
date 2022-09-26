import {v4 as uuidv4} from 'uuid';

export abstract class RequestError extends Error {
    constructor(message: string) {
        super(`${message} (debugId:RequestError|${uuidv4()})`);
        console.error(this);
    }
}

export class MandatoryFieldMissingError extends RequestError {
    constructor(field: string) {
        super(`Mandatory field: '${field}' is missing in the request`);
    }
}

export class EmptyArrayError extends RequestError {
    constructor(field: string) {
        super(`Empty array of: '${field}' is not allowed in the request`);
    }
}

export class DuplicatedProductIdsError extends RequestError {
    constructor(duplicatedProductIds: string[]) {
        super(`The request contains duplicated products ids: ${duplicatedProductIds}`);
    }
}