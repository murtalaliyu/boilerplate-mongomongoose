require('dotenv').config();

var express = require('express');
var app = express();

//  connect to the database
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// --------------------------------------------------------------------------------------------

// create person schema
var Schema = mongoose.Schema;
var personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

// create person model
var Person = mongoose.model("Person", personSchema);

// --------------------------------------------------------------------------------------------

var createAndSavePerson = function(done) {
  const person = new Person({
      name: "Hohoho", 
      age: -234, 
      favoriteFoods: ["Snow", "Fire"]
    });

  person.save(function(err, data) {
    if (err) return console.error(err);
    console.log("saved one!");
    done(null);
  });
};

var arrayOfPeople = [
  {name: "Frankie", age: 74, favoriteFoods: ["Del Taco"]},
  {name: "Sol", age: 76, favoriteFoods: ["roast chicken"]},
  {name: "Robert", age: 78, favoriteFoods: ["wine"]}
];
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, people) {
    if (err) return console.error(err);
    console.log("saved all!");
    done(null, people);
  });
};

var personName = "Mike Row";
const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, function(err, personFound) {
    if (err) return console.error(err);
    done(null, personFound);
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, function(err, data) {
    if (err) return console.error(err);
    console.log("findOneByFood: " + data);
    done(null, data);
  });
};
/*
const food = "Bagels";
findOneByFood(food, function(err, food) {
  if (err) return console.error(err);
});
*/

const findPersonById = (personId, done) => {
  Person.findById(personId, function(err, person) {
    if (err) return console.err(err);
    done(null, person);
  });
};
/*
const id = "616c9b9f570dad07c85762dd";
findPersonById(id, function(err, person) {
  if (err) return console.error(err);
  console.log("person @ findPersonById: " + person);
})
*/

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  // find person by id
  findPersonById(personId, function(err, person) {
      if (err) return console.error(err);

      // update person's favorite foods
      person.favoriteFoods.push(foodToAdd);

      // send update to db
      person.save(function(err, updatedPerson) {
        if (err) return console.error(err);
        done(null,updatedPerson);
      });
  });
};
/*
findEditThenSave("616ca13971a4d63618fdf1af", function(err, updatedPerson) {
  if (err) return console.error(err);
  console.log("updatedPerson: " + updatedPerson);
})
*/

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({name:personName}, {age:ageToSet}, {new:true}, function(err, updatedPerson) {
    if (err) return console.error(err);
    done(null, updatedPerson);
  })
};
/*
findAndUpdate("Frankie", function(err, updatedPerson) {
  if (err) return console.error(err);
  console.log("updatedPerson: " + updatedPerson);
});
*/

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, function(err, removedPerson) {
    if (err) return console.error(err);
    done(null, removedPerson);
  });
};
/*
removeById("616ca13971a4d63618fdf1b0", function(err, removedPerson) {
  if (err) return console.error(err);
  console.log("removedPerson: " + removedPerson);
})
*/

const removeManyPeople = (done) => {
  const nameToRemove = "Sol";

  Person.remove({name:nameToRemove}, function(err, res) {
    if (err) return console.error(err);
    done(null, res);
  })
};
/*
removeManyPeople(function(err, res) {
  console.log("@removeManyPeople: " + res);
})
*/

const queryChain = (done) => {
  const foodToSearch = "Bagels";

  Person.find({favoriteFoods:foodToSearch})
  .sort({name:'asc'})
  .limit(2)
  .select('-age')
  .exec(function(err,res) {
    if (err) return console.error(err);
    done(null, res);
  });
};
/*
queryChain(function(err, res) {
  console.log("queryChain: " + res);
});
*/

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

 app.get("/try", function(req, res) {
  res.send("hi");
 });

 // ----------------------------------------------------------------------

  module.exports = app;

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
