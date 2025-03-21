import { Router, type Request, type Response } from "express";
import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const user_router = Router()

user_router.post('/users/link-wallet', async (req: Request, res: Response) => {
    const body = req.body
    await db.update(users).set({
        address: body.walletAddress
    }).where(eq(users.voter_id, body.voterId))

    res.status(200).send("done")
})

export default user_router