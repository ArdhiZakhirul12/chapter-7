const express = require('express');
        cors = require('cors');
        dotenv = require('dotenv');

const app = express();
const router = require('./router');
const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser')
app.set('views', './views');
app.set('view engine', 'ejs')
app.use(cors())
// app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(router)



app.listen(PORT, () =>{
    console.log(`api running at port ${PORT}` )
})