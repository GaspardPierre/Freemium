const express = require ('express')
const usersRouter = require('./users');
const tasksRouter = require('./tasks');
const projectsRouter = require('./projects');
const invoiceRouter = require ('./invoices');
const router = express.Router();


router.use('/users', usersRouter);
router.use('/projects', projectsRouter);
router.use('/tasks', tasksRouter);
router.use('./invoice', invoiceRouter)

module.exports = router