require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const app = express()

const PORT = 8080;
const validList = ["Frontend Developer", "Backend Developer", "Web Developer", "Fullstack Developer", "Software Engineer"]

app.use(morgan("dev"));
app.use(validateBearerToken);


/*app.use('/', (req, res, next) => {
  //res.send('Hello world');
  next();
});*/



app.get('/list', handleGetList);
app.get('/developer', handleGetDeveloper);

function validateBearerToken(req, res, next){ 
    console.log('validation')
    next();
}

function handleGetList(req, res){
    res.json(validList);
}

function handleGetDeveloper(req, res){
    res.send('I want to see the list of jobs I posted');
}


app.listen(8080, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});
