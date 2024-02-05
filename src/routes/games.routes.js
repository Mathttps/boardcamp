import { Router } from "express"
import { gameSchema } from "../schemas/games.schema.js"
import { getGame, createGame } from "../controllers/controller.games.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"


const gamesRouter = Router()

gamesRouter.get('/games', getGame)
gamesRouter.post('/games', validateSchema(gameSchema), createGame)

export default gamesRouter