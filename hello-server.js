var http = require('http')
var os = require('os')

http.createServer(function (req, res) {
    var text = req.headers["user-agent"]
    res.writeHead(200, {'Content-Type': 'text/plain'})
    const host = os.hostname()
    res.end(`Hello World ${text} ${host} \n`)
}).listen(8989)