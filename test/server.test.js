const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const axios = require('axios')

jest.setTimeout(60000);

describe('Server test',  () => {

    const url = "http://127.0.0.1:4000/graphql/"

    function makeQuery(query){
        const request = axios.post(url, query)
        return request.then(response => response.data)
    }

  
    test('Microservicio Python funciona correctamente', async () => {
      const query1 = {
        "query":"mutation { createUser(name:\"usuarioPruebas\", lastname:\"usuario\", username:\"usuarioPruebas\", email:\"aasdf@asdfa\", password:\"12345\", bank_account:\"12121212121212121212\"){ __typename ... on User {token}... on Error {error} } }"
      }

      const response1 = await makeQuery(query1)
      expect(response1.data.createUser.token).toBeDefined()

      const query2 = {
        "query":`mutation { delUser(token:\"${response1.data.createUser.token}\"){ __typename ... on Message {msg}... on Error {error} } }`
      }

      const response2 = await makeQuery(query2)
      expect(response2.data.delUser.msg).toBeDefined()
    })


    test('Microservicio Python devuelve errores correctamente', async () => {
      const query = {
        "query":`mutation { delUser(token:\"lkjadsfoijeld\"){ __typename ... on Message {msg}... on Error {error} } }`
      }

      const response = await makeQuery(query)
      expect(response.data.delUser.error).toBeDefined()
    })


    test('Microservicio JavaScript funciona correctamente', async () => {
        const query = {
            "query":"mutation { addValoration(ident: \"63c722826668daae40c4fd3d\", username: \"manoloLama\", text: \"Valoración de prueba\", stars: 5){ __typename ... on Product {name}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.addValoration.name).toBeDefined()
    })


    test('Microservicio de JavaScript devuelve errores correctamente', async () => {
        const query = {
            "query":"mutation { addValoration(ident: \"noexisteelproducto\", username: \"manoloLama\", text: \"Valoración de prueba\", stars: 5){ __typename ... on Product {name}... on Error {error} } }"
        }
  
        const response = await makeQuery(query)
        expect(response.data.addValoration.error).toBeDefined()
    })

    test('Microservicio PHP funciona correctamente', async () => {
      const query = {
          "query":"mutation { getBuy(idUsuario: 1, token: \"tokentotalmentevalido\"){ __typename ... on Compra {id}... on Error {error} } }"
      }

      const response = await makeQuery(query)
      expect(response.data.getBuy[0].id).toBeDefined()
  })


  test('Microservicio de PHP devuelve errores correctamente', async () => {
    const query = {
      "query":"mutation{getBuy(idUsuario: 1234, token: \"aldskffdgjoiejlka\"){ __typename ... on Compra { id } ... on Error { error } } }"
    }
    const response = await makeQuery(query)
    console.log(response)
    expect(response.errors).toBeDefined()
  })
})
  
//cuando acabamos cerramos la conexión con la base de datos.
afterAll(async () => {
await mongoose.connection.close()
})