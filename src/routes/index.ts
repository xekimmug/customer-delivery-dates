import {Router} from 'express';
import deliveriesRouter from './deliveriesRoute';

const routes = Router();

routes.use('/deliveries', deliveriesRouter);

export default routes;