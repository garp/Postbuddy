import express from 'express';
const app = express();

import ReportBug from './reportBug.routes.js'
import TalkToSales from './talkToSales.routes.js'
import ContactUs from './contactus.js'
import FeatureRequest from './featureRequest.router.js'
import RoadMap from './static_page/productroadmap.routes.js'

app.use('/contactus', ContactUs)
app.use('/talkToSales', TalkToSales)
app.use('/report-bug', ReportBug)
app.use('/feature-request', FeatureRequest)
app.use('/product-roadmap',RoadMap)

export default app;