const express = require('express')
const logger = require('morgan')

const app = express()

const generateId = () => {
    let max = 1000000000
    let newId = 0

    do {
        newId = Math.floor(Math.random() * max);
    } while (persons.map(p => Number(p.id)).includes(newId))

    return String(newId)
}

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

logger.token('content', (req, res) =>  JSON.stringify(req.body) )

app.use(express.json())

app.use(logger(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date().toString()
    let info = `<p>phonebook has info for ${persons.length} people</p><p>${date}</p>`
    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {

    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const notUnique = 
        persons
            .map(p => p.name.toLowerCase())
            .includes(body.name.toLowerCase())

    if (notUnique) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
