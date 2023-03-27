const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

// Data
let data = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

// Routes
app.use(cors())
app.use(express.static('build'))

app.use(morgan(function(tokens, request, response) {
    return [
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'),
        '---',
        tokens['response-time'](request, response), 'ms',
        JSON.stringify(request.body)
    ].join(' ')

}))

const requestLogger = (request, response, next) => {
    console.log("Method: ", request.method);
    console.log("Path: ", request.path);
    console.log("Body: ", request.body);
    console.log("---");
    next();
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    })
} 

app.use(express.json())

app.get('/api/persons/', (request,response) => {
    response.json(data);
})

app.get('/info', (request, response) => {
    const numOfPeople = data.length
    const currDate = new Date()
    response.send(`<p>Phonebook has info for ${numOfPeople} people</p> <p>${currDate}</p> `)
})

app.get('/info', (request, response) => {
    const numOfPeople = data.length
    response.send(`<p>Testing my guy</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = data.find(person => person.id == id)

    if(person)
    {
        response.json(person)
    }
    else
    {
        response.status(404).end();
    }

})

app.delete('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    data = data.filter(person => person.id !== id)
    response.status(204).end();
})

app.post('/api/persons/', (request, response) => {
    const pName = request.body.name
    const pNumber = request.body.number

    if(!pName || !pNumber)
    {
        return response.status(400).json({
            error: 'either name or number is missing'
        })
    }

    if(data.find(person => person.name === pName))
    {
        return response.status(400).json({
            error: 'name must be unique'
        })

    }

    const pId = Math.floor(Math.random() * 101)
    const person = {
        id: pId,
        name: pName,
        number: pNumber,
    }

    data = data.concat(person)
    response.json(person)
    
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})