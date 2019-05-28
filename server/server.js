const express = require('express');
const connectDB = require('./config/db');
const {
    check,
    validationResult
} = require('express-validator/check');
const cors = require('cors');

const Graph = require('./models/Graph');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({
    extended: false
}));

// Enabling cors
app.use(cors());

app.get('/', (req, res) => res.send('API Running'));

//Define Routes

app.get('/api/graphdata/:date', async (req, res) => {
    try {
        const graph = await Graph.find({
            date: req.params.date});
        if (!graph) {
            return res.status(404).json({
                msg: 'Date not found'
            });
        }
        console.log('Api call excepted');
        res.json(graph);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({
                msg: 'Date not found'
            });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.post('/api/graphdata', async (req, res) => {

    try {
        const newGraph = new Graph({
            date: req.body.date,
            productname: req.body.productname,
            numberofbugs: req.body.numberofbugs
        });

        const graph = await newGraph.save();
        console.log(graph);

        res.json(graph);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));