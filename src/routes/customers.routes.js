import { Router } from "express";
import { create, findAll, findById, update } from "../controllers/customers.controller.js";
import { schemaValidateCustomer, schemaValidateCustomerUpdate } from "../middlewares/schemaValidateCustomers.js";

const customersRouter = Router();

customersRouter.post("/customers", schemaValidateCustomer, create);
customersRouter.get("/customers", findAll);
customersRouter.get("/customers/:id", findById);
customersRouter.put("/customers/:id", schemaValidateCustomerUpdate, update);

export default customersRouter;