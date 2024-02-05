import { Router } from "express"
import { deleteRental, getRental, createRental, returnRental } from "../controllers/controller.rentals.js"

const rentalsRouter = Router()

rentalsRouter.get('/rentals', getRental)
rentalsRouter.post('/rentals', createRental)
rentalsRouter.delete('/rentals/:id', deleteRental)
rentalsRouter.post('/rentals/:id/return', returnRental)

export default rentalsRouter

