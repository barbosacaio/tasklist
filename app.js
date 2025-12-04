const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    try {
        res.send('Tasklist API is running!')
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.listen(port, () => {
    try {
        console.log(`Tasklist API running on port ${port}`)
    } catch (error) {
        res.status(500).json({ error: 'Could not start server' })
    }
})