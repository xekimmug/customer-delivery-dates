import axios from 'axios';
import {closeRestServer, startRestServer} from '../../src/app';
import {DeliveryRequest} from '../../src/models/request';
import {DeliveryResponse} from '../../src/models/response';

const axiosInstance = axios.create({
    baseURL: `http://localhost:5555`,
    proxy: false
});

describe('deliveries endpoints', () => {

    beforeAll(() => startRestServer());
    afterAll(() => closeRestServer());

    it('POST/delivers should pass with two normal products and green delivery within three days should be on top', () => {
        return axiosInstance.post(`/deliveries`, {
            postalCode: 12345,
            productIds: ['N-001', 'N-002'],
            startDate: "2022-09-27"
        } as DeliveryRequest)
            .then(response => {
                expect(response?.status).toBe(200);
                const availableDeliveryDates = (response.data) as DeliveryResponse[];

                expect(availableDeliveryDates).toEqual([
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-09-30",
                        "isGreenDelivery": true
                    },
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-10-11",
                        "isGreenDelivery": false
                    },
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-10-10",
                        "isGreenDelivery": false
                    },
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-10-07",
                        "isGreenDelivery": true
                    },
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-10-04",
                        "isGreenDelivery": false
                    },
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-10-03",
                        "isGreenDelivery": false
                    }
                ]);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    });

    it('POST/delivers should pass with two temporary products', () => {
        return axiosInstance.post(`/deliveries`, {
            postalCode: 12345,
            productIds: ['T-001', 'T-002'],
            startDate: "2022-09-26"
        } as DeliveryRequest)
            .then(response => {
                expect(response?.status).toBe(200);
                const availableDeliveryDates = (response.data) as DeliveryResponse[];
                expect(availableDeliveryDates).toEqual([
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-10-02",
                        "isGreenDelivery": false
                    },
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-10-01",
                        "isGreenDelivery": false
                    },
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-09-30",
                        "isGreenDelivery": true
                    },
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-09-29",
                        "isGreenDelivery": false
                    }
                ]);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    });

    it('POST/delivers should pass with two external products', () => {
        return axiosInstance.post(`/deliveries`, {
            postalCode: 12345,
            productIds: ['E-001', 'E-002'],
            startDate: "2022-09-26"
        } as DeliveryRequest)
            .then(response => {
                expect(response?.status).toBe(200);
                const availableDeliveryDates = (response.data) as DeliveryResponse[];
                expect(availableDeliveryDates).toEqual([
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-10-09",
                        "isGreenDelivery": false
                    },
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-10-08",
                        "isGreenDelivery": false
                    },
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-10-07",
                        "isGreenDelivery": true
                    },
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-10-02",
                        "isGreenDelivery": false
                    }
                ]);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    });

    it('POST/delivers should pass with mixture of all three types of products', () => {
        return axiosInstance.post(`/deliveries`, {
            postalCode: 12345,
            productIds: ['E-001', 'N-001', 'T-001'],
            startDate: "2022-09-26"
        } as DeliveryRequest)
            .then(response => {
                expect(response?.status).toBe(200);
                const availableDeliveryDates = (response.data) as DeliveryResponse[];
                expect(availableDeliveryDates).toEqual([
                    {
                        "postalCode": 12345,
                        "deliveryDate": "2022-10-02",
                        "isGreenDelivery": false
                    }
                ]);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    });

    it('POST/delivers should fail when there are no available delivery dates possible', () => {
        return axiosInstance.post(`/deliveries`, {
            postalCode: 12345,
            productIds: ['E-002', 'N-002', 'T-002'],
            startDate: "2022-09-26"
        } as DeliveryRequest)
            .then(() => fail('Should have thrown error'))
            .catch((error) => {
                expect(error.response?.data?.message?.includes(`There is unfortunately no available delivery dates for your products in the incoming two weeks`)).toBe(true);
            });
    });

    it('POST/delivers should fail when mandatory fields are missing in request', () => {
        return axiosInstance.post(`/deliveries`, {postalCode: 12345, productIds: []} as DeliveryRequest)
            .then(() => fail('Should have thrown error'))
            .catch((error) => {
                expect(error.response?.status).toBe(400);
                expect(error.response?.data?.message?.includes(`Empty array of: 'productIds' is not allowed in the request`)).toBe(true);
            });
    });

    it('POST/delivers should fail when duplicated products ids are provided in request', () => {
        return axiosInstance.post(`/deliveries`, {
            postalCode: 12345,
            productIds: ['T-001', 'N-001', 'T-001']
        } as DeliveryRequest)
            .then(() => fail('Should have thrown error'))
            .catch((error) => {
                expect(error.response?.status).toBe(400);
                expect(error.response?.data?.message?.includes(`The request contains duplicated products ids: T-001`)).toBe(true);
            });
    });

    it('POST/delivers should fail when no products ids are provided in request', () => {
        return axiosInstance.post(`/deliveries`, {postalCode: 12345, productIds: []} as DeliveryRequest)
            .then(() => fail('Should have thrown error'))
            .catch((error) => {
                expect(error.response?.status).toBe(400);
                expect(error.response?.data?.message?.includes(`Empty array of: 'productIds' is not allowed in the request`)).toBe(true)
            });
    });
});