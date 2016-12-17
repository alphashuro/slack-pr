const http = require('http')
const https = require('https')

const port = process.env.PORT || 8080

const slack = {
    sendMessage(opt) {
        const data = JSON.stringify(opt)

        const reqOptions = {
            hostname: 'hooks.slack.com',
            path: '/services/T1NQR00CT/B1RLAPLLF/qHGbexLENyAlO4PhT6md41Yy',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const req = https.request(reqOptions, res => {
            console.log(`slack response: ${res.statusCode}`);
        })

        req.on('error', console.log)

        req.write(data);
        req.end();
    }
}

const users = {
    'alpha-shuro': 'alpha',
};

const server = http.createServer((req, res) => {

    if (req.url === '/pr' && req.method === 'POST') {
        let body = ''

        req.on('data', data => body += data)
        req.on('end', () => {
            body = JSON.parse(body)

            const { actor, pullrequest, repository } = body

            try {
                const message = `@${users[actor.username] || actor.username} has made a PR '<${pullrequest.links.html.href}|${pullrequest.title}>' `
                                + `from <${pullrequest.source.repository.links.html.href}/branch/${pullrequest.source.branch.name}|${pullrequest.source.branch.name}> ` 
                                + `into <${pullrequest.destination.repository.links.html.href}/branch/${pullrequest.destination.branch.name}|${pullrequest.destination.branch.name}> `
                                + `on <${repository.links.html.href}|${repository.name}>`

                slack.sendMessage({
                    channel: '@alpha',
                    text: message,
                })
            } catch (e) {
                console.log(e)
            }
            
            res.statusCode = 200
            res.end()
        })

        return
    }

    res.statusCode = 404
    res.end()
})

server.listen(port)