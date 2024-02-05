import { db } from "../database/database.connection.js";

export async function createGame(req, res) {
    const { name, image, stockTotal, pricePerDay } = req.body;

    try {
        const result = await db.query(`
            INSERT INTO games (name, image, "stockTotal", "pricePerDay")
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (name) DO NOTHING
            RETURNING *;
        `, [name, image, stockTotal, pricePerDay]);

        if (result.rows.length === 0) {
            return res.sendStatus(409); // Já existe um jogo com esse nome
        }

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getGame(req, res) {
    try {
        const games = await db.query(`SELECT * FROM games;`);
        res.send(games.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
