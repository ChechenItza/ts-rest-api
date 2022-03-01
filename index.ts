import {createServer} from 'http'

import {PORT} from './utils/config.js'
import * as logger from './utils/logger.js'
import app from './app.js'

const server = createServer(app)

server.listen(PORT, () => {
  logger.info(`Server is listening at port ${PORT}`)
})

