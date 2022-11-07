const express =require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://weddingPhotographer:u9ppmpVvmcyLIDJ8@cluster0.ankd1bs.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
         const photoCollection = client.db('weddingPhotographer').collection('services')
         app.get('/photos',async(req,res)=>{
            const query = {}
            const cursor = photoCollection.find(query)
            const photos = await cursor.toArray()
            res.send(photos)
         })
    }
    finally{

    }
}
 run ().catch(err=>console.error(err))


app.get('/',(req,res)=>{
    res.send('hello photographer');

})

app.listen(port,()=>{
    console.log(`hello photographer server : ${port}`)
})