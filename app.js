require('dotenv').config();
const express =require('express');
const mongoose =require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//Database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(()=>{
    console.log("DB #feed CONNECTED");
})

//connection
const port = 4000;
app.listen(port,()=>{
    console.log(`App is running at ${port}`)
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

//my routes
const authRoutes =require('./routes/authRoutes')


//basic route
app.get('/',(req,res)=>{
    res.send("#feed")
})

//api Routes
app.use("/api",authRoutes)

