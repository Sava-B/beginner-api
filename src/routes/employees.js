const express = require('express');
const schema = require('../db/schema');
const db = require('../db/connection');

const employees = db.get('employees')

const router = express.Router()

// get employees
router.get('/', async (req, res, next) => {
    try {
        const allEmployees = await employees.find({})
        res.json(allEmployees)
    } catch (error) {
        next(error)
    }
})

// get specific employee 
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const employee = await employees.findOne({ _id: id })

        if (!employee) {
            const error = new Error('The employee does not exist')
            return next(error)
        }

        res.json(employee)
    } catch (error) {
        next(error)
    }
})

// Make new employee
router.post('/', async (req, res, next) => {
    try {
        const { name, job } = req.body
        const result = await schema.validateAsync({ name, job })

        const employee = await employees.findOne({ name })

        if (employee) {
            const error = new Error('Employee already exists')
            return next(error)
        }

        const newuser = await employees.insert({ name, job })
        res.status(201).json(newuser)
    } catch (error) {
        next(error)
    }
})

// Update employee
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const { name, job } = req.body;
        const result = await schema.validateAsync({ name, job });
        const employee = await employees.findOne({ _id: id })

        if (!employee) {
            const error = new Error('The employee does not exist')
            return next(error)
        }

        const updatedEmployee = employees.update({ _id: id }, { $set: result }, { upsert: true })
        res.json(updatedEmployee)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const employee = await employees.findOne({ _id: id })
        if (!employee) {
            const error = new Error('The employee does not exist')
            return next(error)
        }
        await employees.remove({ _id: id })
        res.json({ message: 'Employee has been deleted' })
    } catch (error) {
        next(error)
    }
})

module.exports = router