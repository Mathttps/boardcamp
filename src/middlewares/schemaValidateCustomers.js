import { db } from "../database/database.js";
import { customerSchema } from "../modules/customersSchema.js";

export async function schemaValidateCustomer(req, res, next) {
  const customer = req.body;

  next();
}
