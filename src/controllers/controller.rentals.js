import dayjs from "dayjs";
import { db } from "../database/database.connection.js";

async function executeQuery(query, values = []) {
    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function createRental(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format("YYYY-MM-DD");

    try {
        await db.query('BEGIN');

        const userExists = await executeQuery('SELECT 1 FROM customers WHERE id=$1;', [customerId]);
        if (!userExists.length) {
            await db.query('ROLLBACK');
            return res.sendStatus(400);
        }

        const gameExists = await executeQuery('SELECT 1 FROM games WHERE id=$1;', [gameId]);
        if (!gameExists.length) {
            await db.query('ROLLBACK');
            return res.sendStatus(400);
        }

        if (daysRented <= 0) {
            await db.query('ROLLBACK');
            return res.sendStatus(400);
        }

        const currentRents = await executeQuery('SELECT COUNT(*) FROM rentals WHERE "gameId"=$1;', [gameId]);
        const stockTotal = gameExists[0].stockTotal;

        if (currentRents[0].count >= stockTotal) {
            await db.query('ROLLBACK');
            return res.sendStatus(400);
        }

        const originalPrice = daysRented * gameExists[0].pricePerDay;

        const result = await executeQuery(`
            INSERT INTO rentals
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, null, $5, null)
            RETURNING *;
        `, [customerId, gameId, rentDate, daysRented, originalPrice]);

        await db.query('COMMIT');

        res.sendStatus(201);
    } catch (error) {
        await db.query('ROLLBACK');
        res.status(500).send(error.message);
    }
}

export async function returnRental(req, res){
    const { id } = req.params;
    const date = dayjs().format('YYYY-MM-DD');

    try {
        const rent = await db.query(`SELECT * FROM rentals WHERE id=$1 FOR UPDATE;`, [id]);

        if (!rent.rows[0]) {
            return res.sendStatus(404);
        }

        if (rent.rows[0].returnDate) {
            return res.sendStatus(400);
        }

        const game = await db.query(`SELECT * FROM games WHERE id=$1;`, [rent.rows[0].gameId]);

        const delayDays = dayjs(date).diff(rent.rows[0].rentDate, 'day');
        const delayFee = Math.max(0, delayDays - rent.rows[0].daysRented) * game.rows[0].pricePerDay;

        await db.query(`
            UPDATE rentals
            SET "returnDate"=$1, "delayFee"=$2
            WHERE id=$3;
        `, [date, delayFee, id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function deleteRental(req, res){
    const { id } = req.params;

    try {
        const rent = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        if (!rent.rows[0]) {
            return res.sendStatus(404);
        }
        if (!rent.rows[0].returnDate) {
            return res.sendStatus(400);
        }

        await db.query(`DELETE FROM rentals WHERE id=$1`, [id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getRental(req, res){
    try {
        const rentals = await db.query(`
            SELECT
                rentals.id,
                rentals."customerId",
                rentals."gameId",
                rentals."rentDate",
                rentals."daysRented",
                rentals."returnDate",
                rentals."originalPrice",
                rentals."delayFee",
                customers.id AS "customer.id",
                customers.name AS "customer.name",
                games.id AS "game.id",
                games.name AS "game.name"
            FROM
                rentals
                JOIN customers ON customers.id = rentals."customerId"
                JOIN games ON games.id = rentals."gameId";
        `);

        const list = rentals.rows.map((data) => ({
            id: data.id,
            customerId: data.customerId,
            gameId: data.gameId,
            rentDate: dayjs(data.rentDate).format('YYYY-MM-DD'),
            daysRented: data.daysRented,
            returnDate: data.returnDate,
            originalPrice: data.originalPrice,
            delayFee: data.delayFee,
            customer: {
                id: data.customer.id,
                name: data.customer.name
            },
            game: {
                id: data.game.id,
                name: data.game.name
            }
        }));

        res.send(list);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
