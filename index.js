const Joi = require('joi')
const express = require('express')
const app = express()
app.use(express.json())

const courses = [
  {id:1,name:'Course1'},
  {id:2,name:'Course2'},
  {id:3,name:'Course3'},
]

//Validate Function
function validateCourse(course){
  const schema = {
    name:Joi.string().min(3).required()
  }

  return Joi.validate(course,schema)
}

  //Get
  app.get('/', (req, res) =>{
    res.send('Hello World!!!')
  })

  app.get('/api/courses', (req, res) =>{
    res.send(courses)
  })

  app.get('/api/courses/:id', (req, res) =>{
    //res.send(req.params.id)
   const course =  courses.find(c => c.id === parseInt(req.params.id))
   if(!course) return res.status(404).send('The course with the given ID was not found')//404 
   res.send(course)
  })

  // app.get('/api/posts/:year/:month', (req, res) =>{
  //   // res.send(req.params)
  //   res.send(req.query)
  // })

  //Post
  app.post('/api/courses', (req, res) =>{
    const {error} = validateCourse(req.body)
    if(error) return  res.status(400).send(error.details[0].message)
    // if(!req.body.name || req.body.name.length < 3){
    //   //400 Bad Request
    //   res.status(400).send('Name is required and should be minimum 3 characters')
    //   return
    // } 
      const course = {
        id: courses.length + 1,
        name: req.body.name
      }
      courses.push(course)
      res.send(course)
  })

//PUT
  app.put('/api/courses/:id', (req, res) =>{
    const course =  courses.find(c => c.id === parseInt(req.params.id))
   if(!course) return  res.status(404).send('The course with the given ID was not found')//404 
  // Validate
  //If invalid,return 400 - Bad request
  //  const result = validateCourse(req.body)
   const {error} = validateCourse(req.body)
    if(error) return res.status(400).send(error.details[0].message)  //400 Bad Request
    //Update Course
    course.name = req.body.name
    //Return the updated courses
    res.send(course)

  })

//Delete
  app.delete('/api/courses/:id', (req, res) =>{
    //Lookup for the course
    const course =  courses.find(c => c.id === parseInt(req.params.id))
    if(!course) res.status(404).send('The course with the given ID was not found')//404 Return when not found

    //Delete
    const index = courses.indexOf(course)
    courses.splice(index,1) 
    //Return the same course
    res.send(course)
  })

//PORT
const port = process.env.PORT || 4000
app.listen(port,()=>console.log(`Listening on port ${port}..`))