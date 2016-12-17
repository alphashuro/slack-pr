const http = require('http')

const port = process.env.PORT || 8080

const server = http.createServer((req, res) => {
    if (req.url === '/pr' && req.method === 'POST') {
        let body = ''

        req.on('data', data => body += data)
        req.on('end', () => {
            console.log(body)

            body = JSON.parse(body)

            console.log(body)
        })

        res.statusCode = 200
        res.end()
        return;
    }

    res.statusCode = 404
    res.end()
})

server.listen(port)