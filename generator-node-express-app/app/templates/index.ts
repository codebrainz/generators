import dotenv from 'dotenv'
import express from 'express'
<% if (middleware.includes('compression')) { %>import compression from 'compression'<% } %>
<% if (middleware.includes('cors')) { %>import cors from 'cors'<% } %>
<% if (middleware.includes('helmet')) { %>import helmet from 'helmet'<% } %>
<% if (middleware.includes('morgan')) { %>import morgan from 'morgan'<% } %>

// pull .env variables into environment variables
dotenv.config()

// instantiate a new Express app
const app = express()

// install middleware
app.use(express.json())
<% if (middleware.includes('compression')) { %>app.use(compression())<% } %>
<% if (middleware.includes('cors')) { %>app.use(cors())<% } %>
<% if (middleware.includes('helmet')) { %>app.use(helmet())<% } %>
<% if (middleware.includes('morgan')) { %>app.use(morgan('tiny'))<% } %>

// an example route
app.get('/', async (req, res) => {
  res.json({ message: 'Hello World' })
})

// run the app forever
const host = process.env.HOST || '<%= host %>'
const port = +(process.env.PORT || '<%= port %>')
app.listen(port, host, () => console.log(`Server is listening at 'http://${host}:${port}'...`))
