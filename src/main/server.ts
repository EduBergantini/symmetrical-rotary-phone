import express from 'express'

const port = 5100
const app = express()

app.listen(port, () => console.log(`Server running at http://localhost:${port}`))
