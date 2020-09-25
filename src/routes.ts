import { Router } from "express";
import { UserController } from "./controllers/user.controller";

const router = Router();
const error = Router();

router.get('/', UserController.get);
router.get('/user/:uid', UserController.getUser);
router.post('/user', UserController.saveNewUser);
router.put('/user', UserController.updateUser);
router.put('/address', UserController.address2User);
router.delete('/address/:uid/:name', UserController.rmAddress);

export { router, error };
