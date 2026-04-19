import { Router } from 'express';
import { setCustomClaims } from "../controllers/adminController"
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";

const adminRoutes: Router = Router();

adminRoutes.post('/setCustomClaims', authenticate, authorize({hasRole:["admin"], allowSameUser: true}), setCustomClaims);


export default adminRoutes;
