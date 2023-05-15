import { Router } from "express";
import { create, findAll, queryTest } from "../controllers/games.controller.js";
import { schemaValidateGame } from "../middlewares/schemaValidateGames.js";

const gamesRouter = Router();

gamesRouter.post("/games", schemaValidateGame, create);
gamesRouter.get("/games", findAll);
gamesRouter.post("/gamesTest", queryTest);

export default gamesRouter;