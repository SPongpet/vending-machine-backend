import express from 'express'
import stock from './stock'

const router = express.Router()

router.use('/stock', stock)

export default router
