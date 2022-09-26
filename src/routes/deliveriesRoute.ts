import {Router} from 'express';
import {getDeliveries} from '../controllers/getDeliveries';
import {RequestError} from '../errors/requestError';
import {DeliveryRequest} from '../models/request';
import {DeliveryError} from '../errors/deliveryError';

const router = Router();

router.post('/', (request, response) => {
    try {
        const delivery = getDeliveries(request.body as DeliveryRequest);
        return response.status(200).json(delivery);
    } catch (error) {
        if (error instanceof RequestError) {
            return response.status(400).send({message: error.message});
        }
        if (error instanceof DeliveryError) {
            return response.status(409).send({message: error.message});
        }
        return response.status(500).send({message: error.message});
    }
});

export default router;