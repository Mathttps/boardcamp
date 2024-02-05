import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

async function handleDbQuery(query, values = []) {
    try {
        const result = await db.query(query, values);
        return result.rows;
    } catch (err) {
        throw new Error(err.message);
    }
}

async function formatDateFields(data) {
    return {
        ...data,
        birthday: dayjs(data.birthday).format("YYYY-MM-DD"),
    };
}

export async function createCustumers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const verification = await handleDbQuery("SELECT * FROM customers WHERE cpf = $1;", [cpf]);

        if (verification[0]) {
            return res.sendStatus(409);
        }

        await handleDbQuery("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);", [name, phone, cpf, birthday]);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function putUsers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
        const verification = await handleDbQuery("SELECT * FROM customers WHERE cpf = $1 AND id <> $2;", [cpf, id]);

        if (verification[0]) {
            return res.sendStatus(409);
        }

        await handleDbQuery("UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5;", [name, phone, cpf, birthday, id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;

    try {
        const users = await handleDbQuery("SELECT * FROM customers WHERE id=$1;", [id]);

        if (!users[0]) {
            return res.sendStatus(404);
        }

        const user = await formatDateFields(users[0]);
        res.send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getUsers(req, res) {
    try {
        const users = await handleDbQuery("SELECT * FROM customers;");

        const formattedUsers = await Promise.all(users.map(formatDateFields));
        res.send(formattedUsers);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
