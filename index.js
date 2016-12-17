const http = require('http')

const port = process.env.PORT || 8080

const server = http.createServer((req, res) => {
    if (req.url === '/pr') {
        console.log(req)
        res.statusCode = 200
        res.end()
    }
})

server.listen(port)