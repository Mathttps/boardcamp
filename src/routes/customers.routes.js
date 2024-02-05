import { Router } from "express"
import { customerSchema } from "../schemas/customers.schemas.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { getUsers, getCustomerById, createCustumers, putUsers } from "../controllers/controller.users.js"


const customersRouter = Router()

customersRouter.get('/customers', getUsers)
customersRouter.get('/customers/:id', getCustomerById)
customersRouter.put('/customers/:id', validateSchema(customerSchema), putUsers)
customersRouter.post('/customers', validateSchema(customerSchema), createCustumers)

export default customersRouter