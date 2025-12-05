const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000

// Default route to test if API is working
app.get('/', (req, res) => {
    try {
        res.send('Tasklist API is running!')
    } catch (error) {
        console.error('Error in GET /:', error)
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }
})

// POST route to add a new task
app.post('/add', (req, res) => {
    try {
        const { title, description } = req.query

        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' })
        }

        // Read existing tasks from tasks.json file
        fs.readFile('tasks.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading tasks.json:', err)
                return res.status(500).json({
                    message: 'Error reading tasks.json file',
                    error: err.message
                })
            }

            try {
                let tasks = JSON.parse(data);
    
                // Creates a new task with the received information on this HTTP request
                const newTask = {
                    id: tasks.length + 1,
                    title: title,
                    description: description,
                    completed: false
                }
    
                // Adds the new task to the tasks array
                tasks.push(newTask)
    
                // Writes the updated tasks array back to tasks.json file
                fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing tasks.json:', err)
                        return res.status(500).json({
                            message: 'Error writing tasks.json file',
                            error: err.message
                        })
                    }
    
                    res.status(201).json(newTask)
                })
            } catch (parseError) {
                console.error('Error parsing tasks.json:', parseError)
                res.status(500).json({
                    message: 'Error parsing tasks.json file',
                    error: parseError.message
                })
            }
        })
    } catch (error) {
        console.error('Error in POST /add:', error)
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }
})

app.listen(port, () => {
    try {
        console.log(`Tasklist API running on port ${port}`)
    } catch (error) {
        res.status(500).json({ error: 'Could not start server' })
    }
})