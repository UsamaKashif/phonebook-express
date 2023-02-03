const express = require('express');
const morgan = require('morgan')
const app = express();
const port = process.env.PORT || 3001;

const PHONEBOOK = [
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



const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  

app.use(express.json());
app.use(morgan('tiny'))
// Configure morgan so that it also shows the data sent in HTTP POST requests:
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
// app.use(unknownEndpoint);

app.get("/api/persons", (req, res) => {
    // RETURN ALL PHONEBOOK ENTRIES
    res.json(PHONEBOOK);
})

app.get("/info", (req, res) => {
    // RETURN INFO
    res.send(`<p>Phonebook has info for ${PHONEBOOK.length} people</p>
    <p>${new Date()}</p>`);
})

app.get("/api/persons/:id", (req, res) => {
    // RETURN SINGLE PHONEBOOK ENTRY
    const id = Number(req.params.id);
    const person = PHONEBOOK.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})

app.delete("/api/persons/:id", (req, res) => {
    // DELETE SINGLE PHONEBOOK ENTRY
    const id = Number(req.params.id);
    PHONEBOOK = PHONEBOOK.filter(person => person.id !== id);

    res.status(204).end();
})

app.post("/api/persons", (req, res) => {
    // ADD NEW PHONEBOOK ENTRY
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number missing"
        })
    }

    if (PHONEBOOK.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        id: Math.floor(Math.random() * 1000000),
        name: body.name,
        number: body.number
    }

    PHONEBOOK = PHONEBOOK.concat(person);

    res.json(person);

})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})