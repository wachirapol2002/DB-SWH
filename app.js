const express = require('express')
const cookieSession = require('cookie-session');
const app = express()
const path = require("path")
const bodyParser = require('body-parser')
const port = 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge:  3600 * 1000 // 1hr
}));

const loginRouter = require('./routes/login')
const projectRouter = require('./routes/project')
const teamRouter = require('./routes/team')
const employeeRouter = require('./routes/employee')

app.use("/", loginRouter)
app.use("/project", projectRouter)
app.use("/team", teamRouter)
app.use("/employee", employeeRouter)

app.listen(port, () => {
  console.log(`Start server at http://localhost:${port}`)
})