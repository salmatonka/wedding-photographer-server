const express =require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
         app.get('/',async(req,res)=>{
            const query = {}
            const cursor = photoCollection.find(query)
            const services = await cursor.limit(3).toArray()
            res.send(services)
         })

         app.get('/services',async(req,res)=>{
            const query = {}
            const cursor = photoCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
         })


         app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const allDetails = await photoCollection.findOne(query)
            res.send(allDetails)
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