import express from 'express';
import ejs from 'ejs';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded( {extended: true })); //--> This line is essential. Without it, const searchCountry = req.body.countryName; doesn't work

app.get('/', async(req, res) => {
    res.render('index.ejs');
});

app.post('/submit', async(req, res) => {
    try {
        const searchCountry = req.body.countryName;
        const response = await axios.get (`https://restcountries.com/v3.1/name/${searchCountry}?fullText=true`);
        res.render('index.ejs', {
            countryName: response.data[0].name.common,
            flagLink: response.data[0].flags.png,
            capital: response.data[0].capital[0],
            population: response.data[0].population,
            continent: response.data[0].continents[0],
            area: response.data[0].area
        });
    
    } catch (error) {
        if (error.response && error.response.status === 404){
            console.log('Error This country does not exist');
            res.render('index.ejs', {
                errorMessage: "This country doesn't exist"
            });
        }else {
            console.log('Error: Something went wrong');
            res.render('index.ejs', {
                errorMessage: 'Something went wrong. Please try again'
            });
        }
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});