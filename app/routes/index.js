const express = require ('express')
const router = express.Router();
const revenueRouter = require ('./revenues')
const tasksRouter = require('./tasks');
const projectsRouter = require('./projects');
const invoiceRouter = require ('./invoices');
const usersRouter = require('./users');
const customersRouter = require('./customers')
const dashboardRouter = require ('./dashboard')



router.use('/users', usersRouter);
router.use('/dashboard', dashboardRouter)
router.use('/revenues', revenueRouter);
router.use('/projects', projectsRouter);
router.use('/tasks', tasksRouter);
router.use('/invoices', invoiceRouter);
router.use('/customers', customersRouter)

module.exports = router