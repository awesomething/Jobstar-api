const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan("dev"));


app.get('/', (req, res) => {
  res.send('Hello world');
});

const PORT = 8000;
app.listen(8000, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});
