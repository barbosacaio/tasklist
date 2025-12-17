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

// GET route to fetch all tasks
app.get('/tasks', (req, res) => {
    try {
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
                const tasks = JSON.parse(data)
                // Returns the list of tasks as JSON response
                res.status(200).json(tasks)
            } catch (parseError) {
                console.error('Error parsing tasks.json:', parseError)
                res.status(500).json({
                    message: 'Error parsing tasks.json file',
                    error: parseError.message
                })
            }
        })
    } catch (error) {
        console.error('Error in GET /tasks:', error)
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
    
                // Generates a new unique ID for the new task
                const newId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1

                // Creates a new task with the received information on this HTTP request
                const newTask = {
                    id: newId,
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

// PUT route to edit a task by id
app.put('/update', (req, res) => {
    const taskId = parseInt(req.query.id)
    const { title, description, completed } = req.query

    // Checks if the provided id is a valid number
    if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' })
    }

    try {
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
                const taskIndex = tasks.findIndex(task => task.id === taskId) // Finds the index of the task to be updated

                if (taskIndex === -1) {
                    return res.status(404).json({ error: 'Task not found' })
                }

                // Updates the task properties if provided in the request
                if (title) tasks[taskIndex].title = title
                if (description) tasks[taskIndex].description = description
                if (completed !== undefined) tasks[taskIndex].completed = (completed === 'true')

                fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing tasks.json:', err)
                        return res.status(500).json({
                            message: 'Error writing tasks.json file',
                            error: err.message
                        })
                    }

                    // Returns the updated task as response
                    res.status(200).json({
                        message: 'Task updated',
                        task: tasks[taskIndex]
                    })
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
        console.error('Error in PUT /update', error)
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }
})

// DELETE route to remove a task by id
app.delete('/delete', (req, res) => {
    const taskId = parseInt(req.query.id)

    // Checks if the provided id is a valid number
    if (isNaN(taskId)) {
        return res.status(400).json({ error: 'Invalid task ID' })
    }

    try {
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
                const taskIndex = tasks.findIndex(task => task.id === taskId) // Finds the index of the task to be deleted

                if (taskIndex === -1) {
                    return res.status(404).json({ error: 'Task not found' })
                }
    
                // Removes the task from the tasks array
                const deletedTask = tasks.splice(taskIndex, 1)
    
                // Writes the updated tasks array back to tasks.json file
                fs.writeFile('tasks.json', JSON.stringify(tasks, null, 2), (err) => {
                    if (err) {
                        console.error('Error writing tasks.json:', err)
                        return res.status(500).json({
                            message: 'Error writing tasks.json file',
                            error: err.message
                        })
                    }
    
                    res.status(200).json({ message: 'Task deleted', task: deletedTask[0] }) // Returns the deleted task as response
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
        console.error('Error in DELETE /delete/:id:', error)
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