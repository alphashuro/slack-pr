const fetch = require('fetch');
const R = require('ramda');

const port = process.env.PORT || 8080

const slack = {
    sendMessage(opt) {
        return fetch('hooks.slack.com/services/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', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}

// this is to map users' usernames from bitbucket to slack
const users = {
    'alpha-shuro': 'alpha',
}

const server = http.createServer((req, res) => {
    const { url, method } = req;

    if (url === '/pr' && method === 'POST') {
        let body = ''

        req.on('data', data => body += data)
        req.on('end', () => {
            body = JSON.parse(body)

            const { actor, pullrequest, repository } = body

            const event = req.headers['X-Event-Key'] // bitbucket event type

            try {
                let message = ''

                switch (event) {
                    case 'pullrequest:created': {
                        message = `@${users[actor.username] || actor.username} has made a PR '<${pullrequest.links.html.href}|${pullrequest.title}>' `
                            + `from <${pullrequest.source.repository.links.html.href}/branch/${pullrequest.source.branch.name}|${pullrequest.source.branch.name}> `
                            + `into <${pullrequest.destination.repository.links.html.href}/branch/${pullrequest.destination.branch.name}|${pullrequest.destination.branch.name}> `
                            + `on <${repository.links.html.href}|${repository.name}>`
                        break
                    }
                    default: {
                        console.log(`unknown event: ${event}`)
                    }
                }

                if (message) {
                    slack.sendMessage({
                        channel: '@alpha',
                        text: message,
                    })
                }
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
