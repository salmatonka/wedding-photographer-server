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
         
         const reviewCollection = client.db('weddingPhotographer').collection('review');
         

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
            const id=req.params.id;
            const query ={_id:ObjectId(id)};
            const service = await photoCollection.findOne(query);
            res.send(service)
         })

       //order api

    app.get('/reviews', async(req,res)=>{
        console.log(req.query.email);
        let query ={};
        if(req.query.email){
           query={
              email:req.query.email
           }
        }
        const cursor = reviewCollection.find(query);
        const reviews =await cursor.toArray();
        res.send(reviews)
  
      })
  
      
     app.post('/reviews', async(req,res)=>{
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result);
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