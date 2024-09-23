const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/search', async (req, res) => {
    const query = req.query.q;
    const url = `https://www.youtube.com/results?search_query=${query}`;
    
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const videos = [];

        $('a#video-title').each((i, element) => {
            const title = $(element).text();
            const link = `https://www.youtube.com${$(element).attr('href')}`;
            videos.push({ title, link });
        });

        res.json(videos);
    } catch (error) {
        res.status(500).send('Error fetching data');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
