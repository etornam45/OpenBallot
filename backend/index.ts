import app from "./src/app"

const PORT = 3001

app.listen(PORT, () => {
    console.log(`App listerning on http://localhost:${PORT}`)
})