const express =require('express');
const mongoose =require('mongoose');
const app = express();
require('dotenv').config();

//Database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(()=>{
    console.log("DB #feed CONNECTED");
})

//basic route
app.get('/',(req,res)=>{
    res.send("#feed")
})

//api Routes
// app.use('api/',authRoutes)





const port = 4000;
app.listen(port,()=>{
    console.log(`App is running at ${port}`)
});
