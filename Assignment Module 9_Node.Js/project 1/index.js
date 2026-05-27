const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.path;

    switch (path) {
        case '/':
            fs.readFile('./index.html', (err, data) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('<h1>404 Not Found</h1>');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data);
                }
            });
            break;
        case '/about':
            fs.readFile('./about.html', (err, data) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('<h1>404 Not Found</h1>');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data);
                }
            });
            break;
        case '/contact-me':
            fs.readFile('./contact-me.html', (err, data) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('<h1>404 Not Found</h1>');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data);
                }
            });
            break;
        default:
            fs.readFile('./404.html', (err, data) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    res.end('<h1>404 Not Found</h1>');
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data);
                }
            });
            break;
    }
});

server.listen(8080, () => {
    console.log('Server is running at http://localhost:8080');
});