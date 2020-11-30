console.log('hello livy')

const express = require('express')
const shortid = require('shortid')

const server = express()

server.use(express.json())

let users = [
    {
        id: shortid.generate(), name: 'Livy', bio: 'Junior Software Engineer'
    }
]

const User = {
    getAll() {
        return users
    },
    createNew(user) {
        const newUser = {
            id: shortid.generate(),
            ...user
        }
        users.push(newUser)
        return newUser
    },
    getById(id) {
        return users.find(user => user.id === id)
    },
    delete(id) {
        const user = users.find(user => user.id === id)
        if (user) {
            users = users.filter(u => u.id !== id)
        }
        return user
    },
    update(id, changes) {
        const user = users.find(user => user.id === id)
        if (!user) {
            return null
        } else {
            const updatedUser = { id, ...changes }
            users = users.map(u => {
                if (u.id === id) return updatedUser
                return u
            })
            return updatedUser
        }
    }
}

server.post('/api/users', (req, res) => {
    const userFromClient = req.body
    if (!userFromClient.name || !userFromClient.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } 
    const newlyCreatedUser = User.createNew(userFromClient)
    if (newlyCreatedUser) {
        res.status(201).json(newlyCreatedUser)
    } else {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database." })
    }
})
server.get('/api/users', (req, res) => {
    const users = User.getAll()
    res.status(200)
    if (users) {
        res.status(200).json(users)
    } else {
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database." })
    }
})
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    const user = User.getById(id)
    if (user) {
        res.status(200).json(user)
    } else {
        res.status(500).json({ errorMessage: "The user information could not be retrieved." })
    }
})
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    const deleted = User.delete(id)
    if (deleted) {
        res.status(200).json(deleted)
    } else {
        res.status(500).json({ errorMessage: "The user could not be removed." })
    }
})
server.put('/api/users/:id', (req, res) => {
    const changes = req.body
    const { id } = req.body
    const updatedUserFromClient = req.body
    if (!updatedUserFromClient.name || !updatedUserFromClient.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
    const updatedUser = User.update(id, changes)
    if (updatedUser) {
        res.status(200).json(updatedUser)
    } else {
        res.status(500).json({  errorMessage: "The user information could not be modified." })
    }
})

server.use('*', (req, res) => {
    res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
})

server.listen(5000, () => {
    console.log('listening on port 5000')
})