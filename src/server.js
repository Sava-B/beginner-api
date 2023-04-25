const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const { notFound, errorHandler } = require('./middlewares')

require('dotenv').config()

const schema = require('./db/schema');
const schema = require('./db/schema');
const e = require('express')
const employees = db.get('employees')

const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.use(bodyParser.json())

app.use(errorHandler)
app.use(notFound)


// get all the employees 
app.get('/', async (req, res, next) => {
    try {
        const allEmployees = await employees.find({})
        res.json(allEmployees)
    } catch (error) {
        next(error)
    }
})

// get a specific employee
app.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const employee = await employees.findOne({ _id: id })

        if (!employee) {
            const error = new Error('Employee does not exist')
            return next(error)
        }
        res.json(employee)
    } catch (error) {
        next(error)
    }
})

// make an employee
app.post('/', async (req, res, next) => {
    try {
        const { name, job } = req.body
        const result = await schema.validateAsync({ name, job })

        const employee = await employees.findOne({ name })

        // If the employee already exists 
        if (employee) {
            res.status(409) // This is a conflict visit https://restfulapi.net/http-status-codes/ to check status codes
            const error = new Error('Employee already exists')
            return next(error)
        }
        const newUser = await employees.insert({ name, job })

        console.log('New employee has been created. Congrats on the job :)')
        res.status(201).json.newUser
    } catch (error) {
        next(error)
    }
})

// edit an existing employee
app.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const { name, job } = req.body
        const result = await schema.validateAsync({ name, job })
        const employee = await employees.findOne({ _id: id })

        // if employee isn't real
        if (!employee) {
            return next()
        }

        const updatedEmployee = await employees.update({
            _id: id,
        }, {
            $set: result,
        }, {
            upsert: true,
        })

        res.json(updatedEmployee)

    } catch (error) {
        next(error)
    }
})

// delete an employee
app.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const employee = await employees.findOne({ _id: id })

    } catch (error) {
        next(error)
    }
})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})