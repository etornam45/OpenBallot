import express, { type Request, type Response } from "express"
import user_router from "./routes/users"
import cors from "cors"
import { json } from "body-parser"
import { auth_middleware, logger } from "./utils/middlewares"
import CookieParser from "cookie-parser"
import auth_router from "./routes/auth"
import elections_router from "./routes/elections"
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(json())
app.use(CookieParser())
app.use(logger)

app.use(auth_router)
app.use(elections_router)
app.use(user_router)

app.get("/", auth_middleware, (req: Request, res: Response) => {
    res.send("From get")
})

export default app