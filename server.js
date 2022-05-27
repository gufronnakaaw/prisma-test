import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const app = express()
const port = 3000
const prisma = new PrismaClient()

app.use(express.urlencoded())

app.get('/', (req, res) => {
    let start = Date.now()

    res.status(200).json({
        took: Date.now() - start,
        status: 'OK',
        message: 'Welcome To Prisma Test',
        data: null,
        errors: null
    })
})

app.get('/users', async (req, res) => {
    let start = Date.now()

    res.status(200).json({
        took: Date.now() - start,
        status: 'OK',
        message: 'Get data success',
        data: await prisma.users.findMany(),
        errors: null
    })
})

app.post('/users', async (req, res) => {
    let start = Date.now()

    const { name, email, username, password, phone_number } = req.body

    // hash password
    const salt = await bcrypt.genSalt(10)
    const newpass = await bcrypt.hash(password, salt)

    const data = await prisma.users.create({
        data: {
            name,
            email,
            username,
            password: newpass,
            phone_number
        }
    })

    res.status(200).json({
        took: Date.now() - start,
        status: 'OK',
        message: 'Create data success',
        data: data,
        errors: null
    })
})

app.patch('/users/:id', async (req, res) => {
    let start = Date.now()

    const id = parseInt(req.params.id)
    const { name, email, username, password, phone_number } = req.body

    // hash password
    const salt = await bcrypt.genSalt(10)
    const newpass = await bcrypt.hash(password, salt)

    const data = await prisma.users.update({
        where: { id: id },
        data: {
            name,
            email,
            username,
            password: newpass,
            phone_number
        }
    })

    res.status(200).status(200).json({
        took: Date.now() - start,
        status: 'OK',
        message: 'Update data success',
        data: data,
        errors: null
    })
})

app.delete('/users/:id', async (req, res) => {
    let start = Date.now()

    const id = parseInt(req.params.id)

    const data = await prisma.users.delete({
        where: { id: id }
    })

    res.status(200).json({
        took: Date.now() - start,
        status: 'OK',
        message: 'Delete data success',
        data: null,
        errors: null
    })
})

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})