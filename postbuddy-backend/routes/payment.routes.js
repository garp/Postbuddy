import express from 'express';
const app = express();

import Transaction from './payment/transaction.routes.js'
import Subscription from './payment/subscription.routes.js'

app.use('/transactions', Transaction)
app.use('/subscription', Subscription)

export default app;