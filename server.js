const path = require('path');
const express = require('express');
const app = new express();
const https = require('https');
const port = process.env.PORT || 5000;

const apik = process.env.NKEY;
const langs = {'gb': 'Iso-Britannia', 'jp': 'Japani', 'fr': 'Ranska', 'de': 'Saksa', 'us': 'Yhdysvallat'};

app.use(express.static('www'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/getdata', (req, res) => {
    res.send(langs);
});

app.post('/getnews', (req, res) => {
    console.log(req.body);
    var data = req.body;
    if ((data.type !== undefined) && (data.input !== undefined) && (data.page !== undefined)) {
        var url;
        if (data.type === 'newest') {
            url = 'top-headlines?country=' + data.input;
        } else if (data.type === 'wordsearch') {
            url = 'everything?q=' + data.input;
        } else {
            res.send(false);
            return;
        }

        https.get('https://newsapi.org/v2/' + url + '&page=' + data.page + '&apiKey=' + apik, (pres) => {
            pres.setEncoding('utf8');
            let rawData = '';
            pres.on('data', (chunk) => { rawData += chunk; });
            pres.on('end', () => {
                try {
                    res.send(rawData);
                } catch (e) {
                    console.error(e.message);
                }
            });
        });
    } else { res.send(false); }
});

app.listen(port, () => {
    console.log('App listening on port ' + port)
})