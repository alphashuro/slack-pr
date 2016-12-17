const http = require('http')

const port = process.env.PORT || 8080

const server = http.createServer((req, res) => {
    console.log('yo')
    res.statusCode = 200
    res.end()
})

server.listen(port)