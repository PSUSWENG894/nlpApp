const http = require('http');

//const hostname = '127.0.0.1';
//const port = 3000;

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('The {"Location": "Philadelphia"} {"Organization": "Flyers"} are the best hockey team in the {"Organization": "NHL"}, and {"Person": "Claude Giroux"} should have won {"Organization": "MVP"}.\n');
});

server.listen(PORT, () => {
  console.log(`Server running ${PORT}/`);
});
