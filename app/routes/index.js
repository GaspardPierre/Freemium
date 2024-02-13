const express = require ('express')
const router = express.Router();
const revenueRouter = require ('./revenues')
const tasksRouter = require('./tasks');
const projectsRouter = require('./projects');
const invoiceRouter = require ('./invoices');
const usersRouter = require('./users');
const customersRouter = require('./customers')
const dashboardRouter = require ('./dashboard');
const auth = require('../../middleware/authMiddleware');



router.use('/users', usersRouter);
router.use('/dashboard',auth, dashboardRouter)
router.use('/revenues', auth,revenueRouter);
router.use('/projects', auth, projectsRouter);
router.use('/tasks', auth,tasksRouter);
router.use('/invoices', auth, invoiceRouter);
router.use('/customers', auth, customersRouter)

module.exports = router