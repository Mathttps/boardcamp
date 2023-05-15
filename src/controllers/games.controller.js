import { db } from "../database/database.js.js";

export async function create(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;

  try {
    await db.query(
      `
            INSERT INTO games
                ("name", "image", "stockTotal", "pricePerDay")
            VALUES
                ($1, $2, $3, $4);
            `,
      [name, image, stockTotal, pricePerDay]
    );
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function findAll(req, res) {
  try {
    const { rows } = await db.query(`
        SELECT
            *
        FROM
            games
        `);
    res.send(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function findCountByName(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send("Name parameter is required");
  }

  try {
    const { rows } = await db.query(
      `
        SELECT COUNT(*) as count
        FROM games
        WHERE "name" = $1
        `,
      [name]
    );
    res.send(rows[0].count);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
