const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors
const cors = require('cors');

app.use(cors());


// router
const path = require('path');  
const userRouter = require('./routes/user');
const cameraRouter = require('./routes/facility');
const detailRouter = require('./routes/obj_record');

app.use('/user', userRouter);
app.use('/facility', cameraRouter);
app.use('/obj_record', detailRouter);

app.use(express.static(path.join(__dirname, 'project', 'build')));
app.get('*', (req, res) => {
  console.log('router - default')
  res.sendFile(path.join(__dirname, 'project', 'build', 'index.html'));
});

// listen
const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
  console.log(`PORT: ${PORT}`);
});