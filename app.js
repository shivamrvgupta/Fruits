require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const Fruits = require("./model/fruits.js");
const Persons = require("./model/person.js");

app.set('view engine', 'ejs'); // Set EJS as the default template engine
app.set('views', path.join(__dirname, 'views')); // Set views directory
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// Connecting Mongoose\
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser : true,
  useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', ()=> console.log('Connected to the database!'));


// Add Fruits Data 
const fruit = new Fruits({
  name: "Apple",
  rating: 7,
  review: "Pretty solid as a fruit"
});

const kiwi = new Fruits({
    name: "Kiwi",
    rating: 10,
    review: "The best fruit!"
});

const orange = new Fruits({
    name: "Orange",
    rating: 4,
    review: "Too sour for me"
});

const defaultFruits = [fruit, kiwi, orange];

// Fruits.insertMany(defaultFruits)
//     .then(function () {
//         console.log("Successfully saved defult items to DB");
//       })
//       .catch(function (err) {
//         console.log(err);
//     });


// kiwi.save();

// // Add Persons Data
// const person = new Persons({
//     name: "kumar",
//     age: 21
// });

// person.save();

// paths

app.get("/", (req, res) => {
    Fruits.find()
      .then((fruits) => {
        res.render("index", {
          fruits: fruits,
        });
      })
      .catch((err) => {
        console.log('Error in retrieving fruit list: ' + err);
      });
});
  
app.get("/add", (req, res) => {
    res.render("add", {
    viewTitle: "Add Fruits"
    });
});

app.get("/update/:id", (req, res) => {
    let id = req.params.id;
    Fruits.findById(id)
      .exec()
      .then((fruit) => {
        if (fruit == null) {
          res.redirect("/");
        } else {
          res.render("update", {
            viewTitle: "Update Fruit",
            fruit: fruit,
          });
        }
      })
      .catch((err) => {
        res.redirect("/");
      });
  });
  

  
app.post("/add", (req, res) => {
    const fruit = new Fruits();
    fruit.name = req.body.name; // Update to req.body.name
    fruit.rating = req.body.rating; // Update to req.body.rating
    fruit.review = req.body.review; // Update to req.body.review
    fruit
      .save()
      .then(() => {
        res.redirect("/");
        console.log("Successfully added fruit");
        console.log(fruit);
      })
      .catch((err) => {
        console.log('Error in adding fruit: ' + err);
      });
  });


  app.post("/update-fruits/:id", (req, res) => {
    let id = req.params.id;
    Fruits.findByIdAndUpdate(id, {
      name: req.body.name,
      rating: req.body.rating,
      review: req.body.review,
    })
      .exec()
      .then((result) => {
        console.log('Successfully Updated');
        res.redirect('/');
      })
      .catch((err) => {
        res.json({ message: err.message });
      });
  });




app.get('/delete/:id', async(req, res) => {
    await Fruits.findOneAndDelete({ _id: req.params.id})
    .then((result) => {
      if(result) {
        console.log('SuccessFully Deleted');
        res.redirect('/');
      } else {
        res.json({
          message: "Student not found"
        })
      }
  
    })
    .catch((err) => {
      res.json({
        status: "failed",
      })
    })
  })


app.listen(3000, () => {
    console.log("Listening to port 3000");
})