export class DeliveryDate {
    private readonly _isGreenDelivery: boolean;
    private readonly _dayOfWeek: number;
    private readonly _date: string;

    constructor(dayOfWeek: number,
                date: string) {
        this._isGreenDelivery = (dayOfWeek === 5);
        this._dayOfWeek = dayOfWeek;
        this._date = date;
    }

    private _isAvailable: boolean = true;

    get isAvailable(): boolean {
        return this._isAvailable;
    }

    set isAvailable(value: boolean) {
        this._isAvailable = value;
    }

    private _isCurrentWeek: boolean = false;

    get isCurrentWeek(): boolean {
        return this._isCurrentWeek;
    }

    set isCurrentWeek(value: boolean) {
        this._isCurrentWeek = value;
    }

    get isGreenDelivery(): boolean {
        return this._isGreenDelivery;
    }

    get dayOfWeek(): number {
        return this._dayOfWeek;
    }

    get date(): string {
        return this._date;
    }
}