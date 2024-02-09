const express = require ('express')

const tasksRouter = require('./tasks');
const projectsRouter = require('./projects');
const invoiceRouter = require ('./invoices');
const usersRouter = require('./users');
const customersRouter = require('./customers')
const router = express.Router();



router.use('/projects', projectsRouter);
router.use('/tasks', tasksRouter);
router.use('./invoice', invoiceRouter)
router.use('/users', usersRouter);
router.use('./customers', customersRouter)

module.exports = router