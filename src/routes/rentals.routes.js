import {Router} from "express";
import {create, findAll, finish, deleteRent} from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", create);
rentalsRouter.get("/rentals", findAll);
rentalsRouter.post("/rentals/:id/return", finish);
rentalsRouter.delete("/rentals/:id", deleteRent);

export default rentalsRouter;