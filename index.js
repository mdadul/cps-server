const express = require('express')
const { MongoClient } = require('mongodb')
 
require('dotenv').config()

const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const app = express()
const port = 5000

// middle ware
app.use(cors())
app.use(express.json())


//  DATABASE USERNAME AND PASSWORD 
const username = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const path = process.env.MONGO_DB_PATH;

// CONNECTION URL
 const uri = `mongodb+srv://${username}:${password}@${path}?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})


async function run() {
  try {
    await client.connect()
    const database = client.db('cps')
    const courseCollection = database.collection('courses')
    const instructorCollection = database.collection('instructors')
    console.log('database connected')

    //  ################ Course API START HERE ######################

    //  ++++++++++++++++  send courses to the database ++++++++++++++
    app.post('/courses', async (req, res) => {
      const course = req.body
      const result = await courseCollection.insertOne(course)
      res.json(result)
    })

    // +++++++++++++++++ update data into products collection ++++++++
    app.put('/courses/:id([0-9a-fA-F]{24})', async (req, res) => {
      const id = req.params.id.trim()
      console.log('updating', id)
      const updatedcourse = req.body
      console.log(updatedcourse)
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          image : updatedcourse.image,
          title : updatedcourse.title,
          price : updatedcourse.price,
          totalClass : updatedcourse.totalClass,
          totalSheet : updatedcourse.totalSheet,
          totalHours : updatedcourse.totalHours,
          totalStudent : updatedcourse.totalStudent,
          
        },
      }
      const result = await courseCollection.updateOne(
        filter,
        updateDoc,
        options,
      )
      console.log('updating', id)
      res.json(result)
    })

  
    //  ++++++++++++++++++++ get all courses +++++++++++++++++++++++++++
    app.get('/courses', async (req, res) => {
      const cursor = courseCollection.find({})
      const course = await cursor.toArray()
      res.send(course)
    })


    // +++++++++++++++++++ get a single course from course collection ++++++++
    app.get('/courses/:id([0-9a-fA-F]{24})', async (req, res) => {
      const id = req.params.id.trim()
      const query = { _id: ObjectId(id) }
      const course = await courseCollection.findOne(query)
      res.json(course)
    })

    

    // ++++++++++++++++ delete a data from course collection +++++++++++++++++
    app.delete('/courses/:id([0-9a-fA-F]{24})', async (req, res) => {
      const id = req.params.id.trim()
      const query = { _id: new ObjectId(id) }
      const result = await courseCollection.deleteOne(query)
      res.json(result)
    })

    //  ################ Course API END HERE ######################



    //  ################ INSTRUCTOR API START HERE ################


    
    // ++++++++++++++ send instructor info to the databse +++++++++++++++

    app.post('/instructors', async(req,res)=>{
      const instrutor = req.body;
      const result = await instructorCollection.insertOne(instrutor); 
      res.json(result);
    })

     // ++++++++++++++++++ get all instructors+++++++++++++++++

    app.get('/instructors', async (req,res)=>{
      const cursor = instructorCollection.find({})
      const instrutor = await cursor.toArray()
      res.send(instrutor);
    })

  //  ++++++++++++++++++++ update instructor into instructor collection +++++++++
    app.put('/instructors/:id([0-9a-fA-F]{24})', async(req,res)=>{
      const id = req.params.id.trim();
      const updateInstrutor = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updateDoc ={
        $set : {
          image : updateInstrutor.image,
          name  : updateInstrutor.name,
          designation : updateInstrutor.designation,
          institute : updateInstrutor.institute,
          facebook : updateInstrutor.facebook,
          github : updateInstrutor.github,
          linkedin : updateInstrutor.linkedin
        },
      }
      const result = await instructorCollection.updateOne(
        filter,
        updateDoc,
        options,
      )
      console.log('updating', id)
      res.json(result)
    })
   

  // +++++++++++++++++++  get a single instructor information from instructores collection ++++++++++++++
    app.get('/instructors/:id([0-9a-fA-F]{24})', async(req,res)=>{
      const id = req.params.id.trim()
      const query = {_id: ObjectId(id)}
      const instrutor = await instructorCollection.findOne(query)
      res.json(instrutor)
    })
    // +++++++++++++ delete a instructor information from instructor collection +++++
    app.delete('/instructors/:id([0-9a-fA-F]{24})', async(req,res)=>{
      const id = req.params.id.trim();
      const query = {_id : ObjectId(id)}
      const result = await instructorCollection.deleteOne(query)
      res.json(result)
    })
    //  ################ INSTRUCTOR API START HERE ################
  } finally {
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Running CPS app')
})

app.listen(port, () => {
  console.log(`CPS on port ${port}`)
})

