const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
    res.sendFile('public/Mainpg.html', { root: __dirname });
});

app.get('/api/searches', async (req, res) => {
    console.log('Getting recent searches');
 
    const { data, error } = await supabase.from('searches').select()
 
    if (error) {
        console.log(`Error: ${error}`);
        res.statusCode = 500;
        res.send(error);
    } else {
        console.log('Received searches:', data.length);
        res.json(data);
    }
});

app.post('/api/searches', async (req, res) => {
    console.log('Logging player search');
    console.log(`Request: ${JSON.stringify(req.body)}`);
 
    const playerName = req.body.player_name;

    const { data, error } = await supabase
        .from('searches')
        .insert({
            player_name: playerName,
            searched_at: new Date().toDateString(),
        })
        .select();
 
    if (error) {
        console.log(`Error: ${error}`);
        res.statusCode = 500;
        res.send(error);
    } else {
        res.json(data);
    }
});

app.get('/api/player/:playerId', async (req, res) => {
    const { playerId } = req.params;
    console.log(`Fetching stats for player: ${playerId}`);

    try {
        
        const response = await fetch(`https://api.server.nbaapi.com/api/playeradvancedstats?playerId=${playerId}`);
        const advData = await response.json();

        const response2 = await fetch(`https://api.server.nbaapi.com/api/playertotals?playerId=${playerId}`);
        const boxData = await response2.json();

        if (!response.ok || !response2.ok) {
            throw new Error("Failed to fetch stats");
        }

        res.json({ advData, boxData });

    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.send("Error fetching player stats");
    }
});

app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});