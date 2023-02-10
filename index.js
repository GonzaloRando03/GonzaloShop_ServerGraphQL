const { ApolloServer } = require('apollo-server-express')
const typeDefs = require('./graphql/types')
const resolvers = require('./graphql/resolvers')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(express.json({limit: "50mb", extended: true}))
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 100000}))

app.use(cors())

app.use(bodyParser.json())

const server = new ApolloServer({
  introspection: true,
  typeDefs,
  resolvers,
  formatError: error => {
    return error
  },
  context: ({ req, res }) => {
    return {
      req,
      res,
    }
  },
})

server.start().then(()=>{
    server.applyMiddleware({ app, path: "/graphql" })
    app.listen(4000, () => {
        console.log("app is listening to port 4000")
    })
})






