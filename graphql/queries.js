const axios = require("axios")

const USER_MICROSERVICE_ADDR = process.env.USER_MICROSERVICE_ADDR || 'http://127.0.0.1:8000' 
const BUY_MICROSERVICE_ADDR = process.env.BUY_MICROSERVICE_ADDR || 'http://127.0.0.1:8001'
const PRODUCT_MICROSERVICE_ADDR = process.env.PRODUCT_MICROSERVICE_ADDR || 'http://127.0.0.1:7000'

//función para crear usuario
const createUser = async (root, args) => {
    const URL = USER_MICROSERVICE_ADDR + '/api/users/'
    try {
        const user = {
            name: args.name,
            lastname: args.lastname,
            username: args.username,
            password: args.password,
            email: args.email,
            bank_account: args.bank_account
        }
    
        const response = await axios.post(URL, user)
        return response.data

    } catch (error) {
        return {
            error: error.response.data.error
        }
    }
}

//función para añadir  dinero a la cartera
const addMoney = async (root, args) => {
    const URL = USER_MICROSERVICE_ADDR + '/api/users/'
    try {
        const user = {
            money: args.money, 
            username: args.username
        }

        const response = await axios.put(URL, user)
        return response.data

    } catch (error) {
        return {
            error: error.response.data.error
        }
    }
}

//función para eliminar usuario
const delUser = async (root, args) => {
    const URL = USER_MICROSERVICE_ADDR + '/api/users/'
    try {
        const config = {
            headers: { Authorization: args.token }
        }
        const response = await axios.delete(URL, config)
        return response.data

    } catch (error) {
        return {
            error: error.response.data.error
        }
    }
}

//función para login
const loginUser = async (root, args) => {
    const URL = USER_MICROSERVICE_ADDR + '/api/login/'
    try {
        const login = {
            username: args.username,
            password: args.password
        }
        const response = await axios.post(URL, login)
        return response.data

    } catch (error) {
        return {
            error: error.response.data.error
        }
    }
}

//función para compra
const sendBuy = async (root, args) => {
    const URL = BUY_MICROSERVICE_ADDR + '/api/compras/'
    try {
        const buy = {
            idUsuario: args.idUsuario,
            precioTotal: args.precioTotal,
            fechaPedido: args.fechaPedido,
            fechaEntrega: args.fechaEntrega,
            articulos: args.articulos
        }
        const config = {
            headers: { Authorization: args.token }
        }
        const response = await axios.post(URL, buy, config)
        return response.data

    } catch (error) {
        return {
            error: "No tienes dinero suficiente para realizar el pedido."
        }
    }
}

//función para conseguir las compras de un usuario
const getBuy = async (root, args) => {
    const URL = BUY_MICROSERVICE_ADDR + '/api/compras/'
    try {
        const config = {
            headers: { Authorization: args.token }
        }
        const response = await axios.get(URL+String(args.idUsuario), config)
        return response.data

    } catch (error) {
        return {
            error: "Usuario no encontrado o sin permisos"
        }
    }
}

//función para conseguir un único producto
const getProductOne = async (root, args) => {
    const URL = PRODUCT_MICROSERVICE_ADDR + '/api/product/'

    try {
        const response = await axios.get(URL+String(args.ident))
        return response.data

    } catch (error) {
        return {
            error: "Usuario no encontrado o sin permisos"
        }
    }
}


//función para añadir una valoración
const addValoration = async (root, args, context) => {
    const URL = PRODUCT_MICROSERVICE_ADDR + '/api/product/'

    if (!args.ident | !args.username | !args.stars){
        return {
            error: "Producto no encontrado"
        }
    } 
    const newValoration = {
        username: args.username,
        text: args.text? args.text: "",
        stars: args.stars
    }

    try {
        const response = await axios.put(URL+String(args.ident), newValoration)
        return response.data

    } catch (error) {
        return {
            error: "Fallo al publicar la valoración"
        }
    }
}


//función para conseguir los productos
const getProducts = async (root, args) => {
    //formateamos los argumentos de la petición
    const amount = args.amount? args.amount: 50
    const maxPrice = args.price? args.price[0]: 1000000
    const minPrice = args.price? args.price[1]: 0
    const searchParam = args.search? args.search: 'no-search'
    const order = args.order? args.order: "Destacados"
    const category = args.category? args.category: "Todas las categorías"
    const sale = args.sale? args.sale: false

    const URL = PRODUCT_MICROSERVICE_ADDR + `/api/products/${amount}/${order}/${maxPrice}/${minPrice}/${searchParam}/${sale}/${category}/`

    if(minPrice > maxPrice){
        return [{error: "Precios incorrectos"}]
    }

    try {
        const response = await axios.get(URL)
        let products = [...response.data]

        return products

    } catch (error) {
        return [{
            error: "Productos no encontrados"
        }]
    }

}


module.exports = {
    createUser, 
    addMoney, 
    delUser, 
    loginUser, 
    sendBuy,
    getBuy,
    getProducts, 
    getProductOne, 
    addValoration
}