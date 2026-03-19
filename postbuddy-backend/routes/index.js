import express from 'express';
const app = express();

import User from './user/user.routes.js';
import Comment from './comment.routes.js'
import Payment from './payment.routes.js'
import Plans from './plans.routes.js'
import ApiKey from './user/apiKey.routes.js'
import ReleaseNotes from './releaseNotes.routes.js'
import Admin from './admin/admin.routes.js'
import FileUpload from './fileUpload.js'
import Organization from './user/organization.routes.js'
import Graph from './graph.routes.js'
import BrandVoice from './user/brandVoice.routes.js'

app.use('/user', User)
app.use('/comment', Comment)
app.use('/payment', Payment)
app.use('/plans', Plans)
app.use('/apiKey', ApiKey)
app.use('/release-notes', ReleaseNotes)
app.use('/admin', Admin)
app.use('/file', FileUpload)
app.use('/organization', Organization)
app.use('/graph', Graph)
app.use('/brandVoice', BrandVoice)
export default app;