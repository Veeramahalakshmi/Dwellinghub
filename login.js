// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/dwellinghub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a Mongoose Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files like HTML, CSS, and images
//app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});


app.get('/cleaning', (req, res) => {
  res.sendFile(path.join(__dirname, 'cleaning.html'));
});

app.get('/painting', (req, res) => {
  res.sendFile(path.join(__dirname, 'painting.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/service', (req, res) => {
  res.sendFile(path.join(__dirname, 'service.html'));
});

app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'signin.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/Bookpage', (req, res) => {
  res.render("waiting.ejs");
});

// Handle POST request from the login form
app.post('/login', async(req, res) => {
  const { email, password } = req.body;
  const data = await User.findOne({
      email: email,
      password:password
   });

  if (data) {
      req.session.user = email;
      res.status(200).sendFile(path.join(__dirname, 'index.html'));  // Redirect to the dashboard after successful login
  } else {
      res.status(401).send('Invalid username or password');
  }
});

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
      // Check if the user already exists
      const foundUser = await User.findOne({ email: email });
      
      if (foundUser) {
          res.status(400).send('User already exists.');
      } else {
          // Create a new user
          const newUser = new User({
              name: name,
              email: email,
              password: password,
          });
  
          // Save the new user to the database
          await newUser.save();
          res.status(200).sendFile(path.join(__dirname, 'signin.html'));
      }
  } catch (err) {
          console.log(err); // This will log the error to the console
          res.status(500).send(`Error: ${err.message}`); // This will send the error message as a response
  }
});

  const cleaningServiceSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: Number,
    address: String,
    cleaningDate: Date,
    cleaningPrice: String,
  });
  const CleaningService = mongoose.model('CleaningService', cleaningServiceSchema);
  
  app.use(bodyParser.json());
  
  // Endpoint to save cleaning service data
  app.post('/save-cleaning-service-data', async (req, res) => {
    try {
      const { name, email, phoneNumber, address,cleaningDate } = req.body;
  
      const newCleaningService = new CleaningService({
        name, email, phoneNumber, address,
        cleaningDate,
        cleaningPrice: 'Rs.750'
      });
  
      await newCleaningService.save();
      res.status(200).json({ message: 'Registered! Booking will be confirmed soon!' });
    } catch (error) {
      res.status(500).json({ error: 'Error saving data to the database' });
    }
  });

  app.get('/cleaning-services', async (req, res) => {
    try {
      const services = await CleaningService.find({});
      res.render('Cwaiting', { services: services });
    } catch (error) {
      res.status(500).send('Error retrieving data from the database.');
    }
  });

  app.delete('/cservice/:id', async (req, res) => {
    try {
      await CleaningService.findByIdAndDelete(req.params.id);
      res.redirect('/cleaning-services');
    } catch (err) {
      console.log(err); // This will log the error to the console
      res.status(500).send(`Error: ${err.message}`);
    }
  });
  


const paintingServiceSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  address: String,
  paintingDate: Date,
  paintingTime: String,
  paintingPrice: String
});
const PaintingService = mongoose.model('PaintingService', paintingServiceSchema);

app.use(bodyParser.json());

// Endpoint to save painting service data
app.post('/save-painting-service-data', async (req, res) => {
  try {
    const { name, email, phoneNumber, address, paintingDate, paintingPrice } = req.body;

    const newPaintingService = new PaintingService({
      name, email, phoneNumber, address,
      paintingDate,
      paintingPrice: 'Rs.1000'
    });

    await newPaintingService.save();
    res.status(200).json({ message: 'Registered! Booking will be confirmed soon!' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving data to the database' });
  }
});

app.get('/painting-services', async (req, res) => {
  try {
    const services = await PaintingService.find({});
    res.render('Pwaiting', { services: services });
  } catch (error) {
    res.status(500).send('Error retrieving data from the database.');
  }
});

app.delete('/pservice/:id', async (req, res) => {
  try {
    await PaintingService.findByIdAndDelete(req.params.id);
    res.redirect('/painting-services');
  } catch (err) {
    console.log(err); // This will log the error to the console
    res.status(500).send(`Error: ${err.message}`);
  }
});




const gardeningServiceSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  address: String,
  gardeningDate: Date,
  gardeningTime: String,
  gardeningPrice: String
});

const GardeningService = mongoose.model('GardeningService', gardeningServiceSchema);


// Serve HTML file for gardening service form
app.get('/gardening', (req, res) => {
  res.sendFile(path.join(__dirname, 'gardening.html'));
});

// Endpoint to save gardening service data
app.post('/save-gardening-service-data', async (req, res) => {
  try {
    const { name, email, phoneNumber, address,gardeningDate, gardeningPrice } = req.body;

    const newGardeningService = new GardeningService({
      name, email, phoneNumber, address,
      gardeningDate,
      gardeningPrice: 'Rs.650'
    });

    await newGardeningService.save();
    res.status(200).json({ message: 'Registered! Booking will be confirmed soon!' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving data to the database' });
  }
});
app.get('/gardening-services', async (req, res) => {
  try {
    const services = await GardeningService.find({});
    res.render('gwaiting', { services: services });
  } catch (error) {
    res.status(500).send('Error retrieving data from the database.');
  }
});

var methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.delete('/gservice/:id', async (req, res) => {
  try {
    await GardeningService.findByIdAndDelete(req.params.id);
    res.redirect('/gardening-services');
  } catch (err) {
    console.log(err); // This will log the error to the console
    res.status(500).send(`Error: ${err.message}`);}
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.redirect('/');
  });
});

// Create a Mongoose Schema for the form data
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String
});

// Create a Mongoose Model
const FormData = mongoose.model('FormData', formDataSchema);

// Handle form submission
app.post('/submit-form', async (req, res) => {
  try {
    // Extract data from the form submission
    const { name, email, subject, message } = req.body;

    // Create a new document using the Mongoose model and save it to the database
    const formData = new FormData({
      name,
      email,
      subject,
      message
    });
    
    await formData.save();
    res.redirect('/contact');
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while saving form data' });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server is running on port ${PORT}\nhttp://localhost:3003`);
});
