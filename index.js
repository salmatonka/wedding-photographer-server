const express =require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ycofkd3.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
   const authHeader = req.headers.authorization;

   if (!authHeader) {
       return res.status(401).send({ message: 'unauthorized access' });
   }
   const token = authHeader.split(' ')[1];

   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
       if (err) {
           return res.status(403).send({ message: 'Forbidden access' });
       }
       req.decoded = decoded;
       next();
   })
}


 async function run(){
     try{
         const photoCollection = client.db('photoService').collection('services');
         
          const reviewCollection = client.db('photoService').collection('reviews');

        //   const userCollection = client.db('photoService').collection('users');
         
         
        app.post('/jwt',(req,res)=>{
            const user = req.body;
            console.log(user)
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'})
            res.send({token })
           
        })
           
        
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
            const query ={_id: ObjectId(id)};
            const service = await photoCollection.findOne(query);
            res.send(service)
        })

       //order api

    app.get('/reviews', verifyJWT, async(req,res)=>{
      const decoded = req.decoded;

      if (decoded.email !== req.query.email) {
         res.status(403).send({ message: 'unauthorized access' })
     }

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
  
      
    app.post('/reviews', verifyJWT, async(req,res)=>{
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result);
    })
     
        
    app.patch('/reviews/:id',verifyJWT,async(req,res) =>{
        const id = req.params.id;
        const status = req.body.status;
        const query = {_id: ObjectId(id)}
        const updatedDoc = {
            $set: {
                status: status
            }
        }

        const result = await reviewCollection.updateOne(query,updatedDoc);
        res.send(result);
    })


    app.delete('/reviews/:id', verifyJWT,async(req,res) =>{
       const id = req.params.id;
       const query = {_id: ObjectId(id)};
       const result = await reviewCollection.deleteOne(query);
       res.send(result)

    })

     //services review
    app.get('/services',async(req,res) =>{
      const query = {};
      const users = await photoCollection.find(query).toArray();
      res.send(users);
    })


    app.post('/services',async(req,res) =>{
          const query = req.body;
          console.log(query);
          const result = await photoCollection.insertOne(query);
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