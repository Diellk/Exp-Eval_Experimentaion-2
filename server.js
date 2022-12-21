var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');
const port = 3000;
const createCSVWriter = require('csv-writer').createObjectCsvWriter;



const csvWriter = createCSVWriter({
    path: 'data.csv',
    header: [
        { id: 'name', title: 'Name' },
        { id: 'age', title: 'Age' },
        { id: 'confidence', title: 'Confidence' },
        { id: 'correct', title: 'Correct' },
        { id: 'answer', title: 'Answer' },
        { id: 'time', title: 'Time' },
    ]
});


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// endpoints

app.get('/', function (req, res) {
    if (req.accepts("text/html")) {
        let css = '/style.css'

        let model = {
            css,
        }
        res.render('index.ejs', model)
    }

});

app.get('/form', function (req, res) {
    if (req.accepts("text/html")) {
        let css = '/style.css'

        let model = {
            css,
        }
        res.render('form.ejs', model)
    }
})

app.get('/end', function (req, res) {
    fs.rename('data.csv', csvname, function (err) {
        if (err) console.log('ERROR: ' + err);
    });
    if (req.accepts("text/html")) {
        let css = '/style.css'

        let model = {
            css,
        }
        res.render('end.ejs', model)
    }
})

app.get('/start', function (req, res) {

    csvname = req.query.name + '.csv';
    let person = {
        name: req.query.name,
        age: req.query.age,
        confidence: req.query.confidence,
    }
    data.push(person);

    if (req.accepts("text/html")) {
        let css = '/style.css'

        let model = {
            css,
        }
        res.render('start.ejs', model)
    }

})

app.post('/end', function (req, res) {


    console.log('I am here');
    console.log(' req: ' + JSON.stringify(req.body));

    let asdasd = req.body.data;

    console.log(asdasd);

    asdasd.forEach(element => {
        let towrite = [];

        let answer;
        let time;


        let correct_string = element.correct
        let user_string = element.user

        let kebab_guess = ((user_string).split('-').join('')).toLowerCase()
        let camel_guess = (user_string).toLowerCase()
        let correct_answer = ((correct_string).split(' ').join('')).toLowerCase()

        if ((kebab_guess == correct_answer) || (camel_guess == correct_answer)) {
            answer = 'correct';
        } else {
            answer = 'wrong';
        }

        time = element.time + 'ms';

        let topush = {
            correct: element.correct,
            answer: answer,
            time: time,
        };

        console.log(topush);
        towrite.push(topush)

        csvWriter.writeRecords(towrite)
            .then(() => {
                console.log('Wrote ' + towrite);
            })
            .catch((err) => {
                console.log(err);
            });
    })


    let css = '/style.css'

    let model = {
        css,
    }

    res.status(200).send('ok');
})


app.get('/experiment', function (req, res) {
    let number = Math.floor(Math.random() * 14);

    // console.log(data);
    csvWriter.writeRecords(data)
        .then(() => {
            console.log('wrote ' + data);
        })
        .catch((err) => {
            console.log(err);
        });

    if (req.accepts("text/html")) {

        let css = '/style.css'

        let model = {
            css
        }
        // console.log(model)

        return res.render('experiment.ejs', model)
    }
});

app.get('*', function (req, res) {
    res.status(404)
});

app.listen(3000, () => console.log('Listening'));

let csvname = '';
let userName = '';
let data = []