const http = require('http')

const port = process.env.PORT || 8080

const server = http.createServer((req, res) => {
    if (req.url === '/pr' && req.method === 'POST') {
        let body = ''

        req.on('data', data => body += data)
        req.on('end', () => {
            body = JSON.parse(body)

            const { actor, pullrequest, repository } = body

            console.log(`${actor.username} has made a PR '${pullrequest.title}' from ${pullrequest.source.branch.name} into ${pullrequest.destination.branch.name} in ${repository.name}`);
            
            res.statusCode = 200
            res.end()
            return;
        })
    }

    res.statusCode = 404
    res.end()
})

server.listen(port)