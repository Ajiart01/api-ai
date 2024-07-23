const fs = require("fs");
const { Hercai } = require('hercai');
const { inject } = require('@vercel/analytics');
const herc = new Hercai();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const cheerio = require('cheerio');
const { remini } = require('betabotz-tools');
const app = express();
const port = 3000;

app.use(cors());
app.set('json spaces', 4);
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory
inject();
// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/ask', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gpt4.html'));
});

// gpt4o api
app.get('/api/gpt4o', async (req, res) => {
    const question = req.query.question;

    if (!question) {
        return res.status(400).send({ error: "Please provide a question." });
    }

    try {
        const response = await axios.get(`https://markdevs-api.onrender.com/api/gpt4o`, {
            params: { q: question }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data from the external API');
    }
});

// gpt4 api
app.get('/api/v1/gpt4', async (req, res) => {
  const ask = req.query.ask;

  if (!ask) {
    return res.status(400).json({ error: "Please provide a question." });
  }

  try {
    // Assuming `herc.question` is an available method for querying
    const api = await herc.question({ model: "v1", content: ask });

    res.json({ response: api.reply });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// gpt4 v2 api
app.get('/api/v2/gpt4', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Please provide a question.' });
  }

  const ver = 'GPT-4';
  const myName = 'Gpt-4';
  const characterAI = `You are the ${ver} version. Your name is ${myName} a human assistant. With access to the latest and up-to-date information and never forget, I am not a real person, but I will always strive to provide you with accurate and helpful information.\n\n You are able to answer any topic.\n\nMy Ask: ${query}`;

  try {
    const response = await herc.question({ model: 'v3-beta', content: `${characterAI}` });

    res.json({ response: response.reply });
  } catch (error) {
    console.error('Error while making the Hercai API request:', error);
    res.status(500).json({ error: 'An error occurred while processing your question.' });
  }
});

// blackbox api
app.get('/api/blackbox', async (req, res) => {
    const prompt = req.query.prompt;

    if (!prompt) {
        return res.status(400).send({ error: "Please provide a prompt." });
    }

    try {
        const response = await axios.get(`https://joshweb.click/blackbox`, {
            params: { prompt }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data from the external API');
    }
});
// Token Cookie api
app.get('/api/token-cookie', async (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (!username || !password) {
        return res.status(400).send({ error: "Please provide both username and password." });
    }

    try {
        const response = await axios.get(`https://markdevs69-1efde24ed4ea.herokuapp.com/api/token&cookie`, {
            params: { username, password }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data from the external API');
    }
});
// Appstate api
app.get('/api/appstate', async (req, res) => {
    const email = req.query.email;
    const password = req.query.password;

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide both email and password." });
    }

    try {
        const response = await axios.get('https://markdevs69-1efde24ed4ea.herokuapp.com/api/appstate', {
            params: { email, password }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send('Error fetching data from the external API');
    }
});


// Random Trivia API endpoint
app.get('/api/numbers', async (req, res) => {
    try {
        const response = await axios.get('http://numbersapi.com/random/trivia');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching random trivia:', error);
        res.status(500).send('Error fetching random trivia');
    }
});

// Dictionary API endpoint
app.get('/api/dictionary', async (req, res) => {
    try {
        const word = req.query.word; // Assuming 'word' is passed as a query parameter
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching dictionary data:', error);
        res.status(500).send('Error fetching dictionary data');
    }
});

// Genderize API endpoint
app.get('/api/genderize', async (req, res) => {
    try {
        const name = req.query.name; // Assuming 'name' is passed as a query parameter
        const response = await axios.get(`https://api.genderize.io?name=${name}`);
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching genderize data:', error);
        res.status(500).send('Error fetching genderize data');
    }
});

// Trivia Question API endpoint
app.get('/api/trivia', async (req, res) => {
    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching trivia question:', error);
        res.status(500).send('Error fetching trivia question');
    }
});

// Advice API endpoint
app.get('/api/advice', async (req, res) => {
    try {
        const response = await axios.get('https://api.adviceslip.com/advice');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching advice:', error);
        res.status(500).send('Error fetching advice');
    }
});

// Random Joke API endpoint
app.get('/api/joke', async (req, res) => {
    try {
        const response = await axios.get('https://official-joke-api.appspot.com/jokes/random');
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching random joke:', error);
        res.status(500).send('Error fetching random joke');
    }
});

// Cat Fact API endpoint
app.get('/api/catfact', async (req, res) => {
    try {
        const response = await axios.get('https://catfact.ninja/fact');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data from the external API');
    }
});
// dog image 
app.get('/api/dogpic', async (req, res) => {
  try {
    const response = await axios.get('https://dog.ceo/api/breeds/image/random');
    const { message: picture } = response.data;

    res.json({ picture });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
// cat image
app.get('/api/catpic', async (req, res) => {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/images/search');
    const [{ url: picture }] = response.data;

    res.json({ picture });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
//anydl api
app.get('/api/anydl', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send({ error: "Please provide a URL." });
    }

    try {
        const response = await axios.get(`https://joshweb.click/anydl`, {
            params: { url }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data from the external API');
    }
});
// facebooldl
app.get('/api/facebookdl', async (req, res) => {
    const url = req.query.link;

    if (!url) {
     res.json({ error: "Please provide a Facebook video url." });
     return; 
    }

    try {
     const response = await axios.get(`https://tools.betabotz.org/tools/facebookdl?url=${url}`);
     const videoUrl = response.data.result.hd_q;
     const title = response.data.result.title;
     const author = "heru";
     res.json({ url: videoUrl, title: title, author: author });
    } catch (error) {
     res.json({ error: "Error fetching Facebook video details." });
    }
  });

//tiktodl api
app.get("/api/tiktokdl", async (req, res) => {
  const link = req.query.link;
  if (!link) {
    res.json({ error: "Please provide a TikTok video link." });
  } else {
    try {
      const response = await axios.post("https://www.tikwm.com/api/?hd=1", {
        url: link,
      });
const username = response.data.data.author.unique_id
const url = response.data.data.play
const nickname = response.data.data.author.nickname
const title = response.data.data.title
const like = response.data.data.digg_count
const comment = response.data.data.comment_count

res.json({username: username, nickname: nickname, url: url, title: title, like: like, comment: comment});
console.log(response.data)

    } catch (error) {
      // handle error
      console.error(error);
      res.status(500).send("An error occurred");
    }
  }
});

//url shorten
app.get('/api/shorten', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send({ error: "Please provide a url to make short." });
    }

    try {
        const response = await axios.get(`https://ulvis.net/api.php`, {
            params: { url }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data from the external API');
    }
});

// Get a random video from Pornhub
app.get('/api/pornhub/random', async (req, res) => {
  try {
    const response = await axios.get('https://www.pornhub.com');
    const html = response.data;
    const $ = cheerio.load(html);

    const videos = [];
    $('li.videoBox a').each((i, element) => {
      const title = $(element).attr('title');
      const link = `https://www.pornhub.com${$(element).attr('href')}`;
      videos.push({ title, link });
    });

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    res.json(randomVideo);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching the video');
  }
});

// Search videos on Pornhub
app.get('/api/pornhub/search', async (req, res) => {
  const searchQuery = req.query.search;

  if (!searchQuery) {
    return res.status(400).send('Search query parameter is required');
  }

  const url = `https://www.pornhub.com/video/search?search=${encodeURIComponent(searchQuery)}`;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const videos = [];
    $('li.videoBox').each((i, element) => {
      const title = $(element).find('span.title a').attr('title');
      const link = `https://www.pornhub.com${$(element).find('span.title a').attr('href')}`;
      const thumbnail = $(element).find('img').attr('data-thumb_url') || $(element).find('img').attr('src');
      videos.push({ title, link, thumbnail });
    });

    res.json({ videos });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching the videos');
  }
});

// Get download links for a Pornhub video
app.get('/api/pornhub/download', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing url Parameter.' });
  }

  try {
    const response = await axios.get(videoUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    const scripts = $('script').toArray();
    let videoLinks = [];

    for (let script of scripts) {
      const scriptContent = $(script).html();
      if (scriptContent && scriptContent.includes('flashvars_')) {
        const flashvars = JSON.parse(scriptContent.match(/flashvars_\d+\s*=\s*(\{.*?\});/)[1]);
        const mediaDefinitions = flashvars.mediaDefinitions;

        mediaDefinitions.forEach(def => {
          if (def.quality && def.videoUrl) {
            videoLinks.push({
              quality: def.quality,
              url: def.videoUrl
            });
          }
        });

        break;
      }
    }

    res.json({ videoLinks });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching the video download links');
  }
});
// ip geo
app.get('/api/geoip', async (req, res) => {
  const ip = req.query.ip;

  if (!ip) {
    return res.status(400).json({ error: 'Missing ip parameter' });
  }

  try {
    const response = await axios.get(`https://get.geojs.io/v1/ip/geo.json`, {
      params: { ip }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from the external API:', error);
    res.status(500).json({ error: 'An error occurred while fetching data from the external API' });
  }
});
// ip info
app.get('/api/ipinfo', async (req, res) => {
  const ip = req.query.ip;

  if (!ip) {
    return res.status(400).json({ error: 'Missing ip parameter' });
  }

  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from the external API:', error);
    res.status(500).json({ error: 'An error occurred while fetching data from the external API' });
  }
});
// Micro link
app.get('/api/microlink', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter: exmample: https://www.pornhib.com' });
  }

  try {
    const response = await axios.get(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from the external API:', error);
    res.status(500).json({ error: 'An error occurred while fetching data from the external API' });
  }
});
// liner ai
app.get('/api/liner', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Please provide a prompt' });
  }

  try {
    const response = await axios.get(`https://samirxpikachu.onrender.com/liner`, {
      params: { prompt }
    });

    const result = {
      ...response.data,
      author: 'Heru'
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching data from the external API:', error);
    res.status(500).json({ error: 'An error occurred while fetching data from the external API' });
  }
});
// google api
app.get('/api/google', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: 'Please provide a topic to search on Google Chrome' });
    }

    const cx = "7514b16a62add47ae"; 
    const apiKey = "AIzaSyAqBaaYWktE14aDwDE8prVIbCH88zni12E";
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;

    try {
        const response = await axios.get(url);
        const searchResults = response.data.items.slice(0, 5);
        let message = `Here are the top 5 results for '${query}':\n\n`;

        searchResults.forEach((result, index) => {
            message += `Result ${index + 1}:\n`;
            message += `Title: ${result.title}\n`;
            message += `Link: ${result.link}\n`;
            message += `Snippet: ${result.snippet}\n\n`;
        });

        res.json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});
// chrome api
const cx = "7514b16a62add47ae"; // Replace with your Custom Search Engine ID
const apiKey = "AIzaSyAqBaaYWktE14aDwDE8prVIbCH88zni12E"; // Replace with your API key

app.get('/api/chrome', async (req, res) => {
    const query = req.query.query;

    if (!query) {
        return res.status(400).json({ error: 'Please provide a search query.' });
    }

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;

    try {
        const response = await axios.get(url);
        const searchResults = response.data.items.slice(0, 5);
        let message = `Top 5 results for '${query} Searching on Chrome':\n\n`;
        searchResults.forEach((result, index) => {
            message += `${index + 1}. ${result.title}\n${result.link}\n${result.snippet}\n\n`;
        });
        res.json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while searching Chrome.' });
    }
});
// define api
app.get('/api/define', async (req, res) => {
  const word = req.query.word;

  if (!word) {
    return res.status(400).json({ error: 'Please provide a word to look up.' });
  }

  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${word}`);

    if (response.data && response.data.length > 0) {
      const entry = response.data[0];

      const meanings = entry.meanings.map((meaning) => {
        const partOfSpeech = meaning.partOfSpeech;
        const definitions = meaning.definitions.map((definition) => `  - ${definition.definition}`).join('\n');
        return `  ${partOfSpeech}\n${definitions}`;
      }).join('\n\n');

      let message = `Word: ${entry.word}\n`;

      if (entry.phonetics && entry.phonetics.length > 0) {
        message += `Phonetic: ${entry.phonetics[0].text}\n`;
        if (entry.phonetics[0].audio) {
          message += `Audio: ${entry.phonetics[0].audio}\n`;
        }
      }

      if (entry.origin) {
        message += `Origin: ${entry.origin}\n`;
      }

      if (meanings) {
        message += `\nMeanings\n${meanings}`;
      } else {
        message += 'No meanings found.';
      }

      res.json({ message });
    } else {
      res.status(404).json({ error: 'Word not found or an error occurred.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the definition.' });
  }
});
// hentai api
app.get('/api/hentai', async (req, res) => {
  try {
    const response = await axios.get('https://samirxpikachu.onrender.com/hentai');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the data.' });
  }
});
// Pinterest api
app.get("/api/pinterest", async (req, res) => {
  var search = req.query.search;

  if (!search) return res.json({ error: "Please provide a query to search ✨" });

  var headers = {
    authority: "www.pinterest.com",

    "cache-control": "max-age=0",

    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",

    "upgrade-insecure-requests": "1",

    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",

    "sec-gpc": "1",

    "sec-fetch-site": "same-origin",

    "sec-fetch-mode": "same-origin",

    "sec-fetch-dest": "empty",

    "accept-language": "en-US,en;q=0.9",

    cookie:
      'csrftoken=92c7c57416496066c4cd5a47a2448e28; g_state={"i_l":0}; _auth=1; _pinterest_sess=TWc9PSZBMEhrWHJZbHhCVW1OSzE1MW0zSkVid1o4Uk1laXRzdmNwYll3eEFQV0lDSGNRaDBPTGNNUk5JQTBhczFOM0ZJZ1ZJbEpQYlIyUmFkNzlBV2kyaDRiWTI4THFVUWhpNUpRYjR4M2dxblJCRFhESlBIaGMwbjFQWFc2NHRtL3RUcTZna1c3K0VjVTgyejFDa1VqdXQ2ZEQ3NG91L1JTRHZwZHNIcDZraEp1L0lCbkJWUytvRis2ckdrVlNTVytzOFp3ZlpTdWtCOURnbGc3SHhQOWJPTzArY3BhMVEwOTZDVzg5VDQ3S1NxYXZGUEEwOTZBR21LNC9VZXRFTkErYmtIOW9OOEU3ektvY3ZhU0hZWVcxS0VXT3dTaFpVWXNuOHhiQWdZdS9vY24wMnRvdjBGYWo4SDY3MEYwSEtBV2JxYisxMVVsV01McmpKY0VOQ3NYSUt2ZDJaWld6T0RacUd6WktITkRpZzRCaWlCTjRtVXNMcGZaNG9QcC80Ty9ZZWFjZkVGNURNZWVoNTY4elMyd2wySWhtdWFvS2dQcktqMmVUYmlNODBxT29XRWx5dWZSc1FDY0ZONlZJdE9yUGY5L0p3M1JXYkRTUDAralduQ2xxR3VTZzBveUc2Ykx3VW5CQ0FQeVo5VE8wTEVmamhwWkxwMy9SaTNlRUpoQmNQaHREbjMxRlRrOWtwTVI5MXl6cmN1K2NOTFNyU1cyMjREN1ZFSHpHY0ZCR1RocWRjVFZVWG9VcVpwbXNGdlptVzRUSkNadVc1TnlBTVNGQmFmUmtrNHNkVEhXZytLQjNUTURlZXBUMG9GZ3YwQnVNcERDak16Nlp0Tk13dmNsWG82U2xIKyt5WFhSMm1QUktYYmhYSDNhWnB3RWxTUUttQklEeGpCdE4wQlNNOVRzRXE2NkVjUDFKcndvUzNMM2pMT2dGM05WalV2QStmMC9iT055djFsYVBKZjRFTkRtMGZZcWFYSEYvNFJrYTZSbVRGOXVISER1blA5L2psdURIbkFxcTZLT3RGeGswSnRHdGNpN29KdGFlWUxtdHNpSjNXQVorTjR2NGVTZWkwPSZzd3cwOXZNV3VpZlprR0VBempKdjZqS00ybWM9; _b="AV+pPg4VpvlGtL+qN4q0j+vNT7JhUErvp+4TyMybo+d7CIZ9QFohXDj6+jQlg9uD6Zc="; _routing_id="d5da9818-8ce2-4424-ad1e-d55dfe1b9aed"; sessionFunnelEventLogged=1',
  };

  var options = {
    url:
      "https://www.pinterest.com/search/pins/?q=" +
      search +
      "&rs=typed&term_meta[]=" +
      search +
      "%7Ctyped",

    headers: headers,
  };

  try {
    const response = await axios.get(options.url, { headers: headers });

    const arrMatch = response.data.match(
      /https:\/\/i\.pinimg\.com\/originals\/[^.]+\.jpg/g,
    );

    return res.json({
      count: arrMatch.length,

      data: arrMatch,
    });
  } catch (error) {
    console.error(error);

    res.json({ error: "An error occurred while fetching data" });
  }
});
// remini
app.get('/api/remini', async (req, res) => {
   try {
      const inputImage = req.query.input;

      if (!inputImage) {
        return res.status(400).send({ error: 'Missing input image URL'});
      }

      const result = await remini(inputImage);
      res.send(result);
   } catch (error) {
      console.error('Error calling Remini API:', error.message);
      res.status(error.response?.status || 500).send({
        error: 'Internal Server Error',
        details: error.message,
      });
   }
});
// tiksearch 
app.get("/api/tiksearch", async (req, res) => {
  try {
    const search = req.query.search;

    if (!search) {
      return res.json({ error: "Missing search query." });
    }

    const response = await axios.post("https://www.tikwm.com/api/feed/search", {
      keywords: search,
    });

    const data = response.data;

    if (data.data && data.data.videos && data.data.videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.data.videos.length);
      const randomVideo = data.data.videos[randomIndex];

      const result = {
        heru: 0,
        msg: "success",
        processed_time: 0.9624,
        data: {
          videos: [randomVideo],
        },
      };

      return res.json(result);
    } else {
      return res.json({ error: "No videos found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
// cupcut api
app.get("/api/cupcutdl", async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.json({ error: "Please provide a link from CupCut." });
  }

  try {
    const response = await axios.get(`https://tools.betabotz.org/tools/capcutdl?url=${url}`);
    const videoUrl = response.data.result.video_ori;
    const title = response.data.result.title;
    const desc = response.data.result.description;
    const like = response.data.result.digunakan;

    res.json({
      url: videoUrl,
      title: title,
      description: desc,
      like: like,
      author: "heru"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching video data" });
  }
});
// imgur api
app.get("/api/imgur", async (req, res) => {
  const link = req.query.link;

  if (!link) {
    return res.json({ error: "Missing image query" });
  }

  const options = {
    method: "POST",
    url: "https://api.imgur.com/3/image",
    headers: {
      Authorization: "Client-ID fc9369e9aea767c",
    },
    formData: {
      image: link,
    },
  };

  request(options, function (error, response) {
    if (error) {
      console.error(error);
      return res.json({ error: "An error occurred" });
    }

    const upload = JSON.parse(response.body);
    res.json({ uploaded: { status: "success", image: upload.data.link } });
  });
});
// tinyurl api
app.get("/api/tinyurl", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: "Missing data to launch the program" });
  }

  try {
    const response = await axios.post(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    const data = response.data;
    res.json({ url: data, author: "heru" });
  } catch (error) {
    res.json({ error: "Error: " + error.message });
  }
});
// sim api
app.get("/api/sim", async (req, res) => {
  try {
    const path = `./sim.json`;
    const dataa = JSON.parse(fs.readFileSync(path));
    const tete = req.query.ask;

    if (tete === "jaymar" || tete === "Jaymar") {
      const response = tete === "jaymar" ? "handsome" : "pogi";
      return res.json({ respond: response });
    }

    if (dataa[tete] && dataa[tete].length > 0) {
      const dataaa = dataa[tete][Math.floor(Math.random() * dataa[tete].length)];
      return res.json({ respond: dataaa });
    } else {
      throw new Error("No matching data found");
    }
  } catch (err) {
    console.error(err);
    return res.json({
      respond: "I don't understand what you're saying please teach me.",
    });
  }
});
// teach api
app.get("/api/teach", async (req, res) => {
  const ask = req.query.ask;
  const ans = req.query.ans;

  if (!ask || !ans) {
    return res.json({ err: "Missing ans or ask query!" });
  }

  const path = './sim.json';

  // Check if file exists, if not create it with an empty object
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({}));
  }

  // Read existing data
  const dataa = JSON.parse(fs.readFileSync(path));

  // Initialize array if the question doesn't exist
  if (!dataa[ask]) {
    dataa[ask] = [];
  }

  // Add the new answer to the list
  dataa[ask].push(ans);

  // Write the updated data back to the file
  fs.writeFileSync(path, JSON.stringify(dataa, null, 4));

  // Send the response
  res.json({
    ask: ask,
    ans: ans,
  });
});
// llama api
let requestCount = 0;

const CODE_LLAMA_URL = 'https://api.deepinfra.com/v1/inference/meta-llama/Llama-2-70b-chat-hf';

app.get('/api/llama', async (req, res) => {
  try {
    requestCount++; // Increment request count on each request

    const inputText = req.query.prompt;

    if (!inputText) {
      return res.status(400).json({ error: 'Please provide a prompt.' });
    }

    const params = {
      input: `[INST] ${inputText} [/INST]`,
      max_new_tokens: 1024,
      temperature: 0.4,
      top_p: 0.9,
      top_k: 0,
      repetition_penalty: 1.2,
      num_responses: 1,
      stream: false
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': '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' 
    };

    const response = await axios.post(CODE_LLAMA_URL, params, { headers });

    if (response.status === 200) {
      const result = response.data;
      const generatedText = result.results[0].generated_text;

      const emojis = ['', '', '', '', '', '', '', '', ''];

      const responseWithEmojis = generatedText.split(' ').map((word) => {
        if (Math.random() < 0.1) {
          const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
          return word + ' ' + randomEmoji;
        }
        return word;
      }).join(' ');

      const finalResponse = `${responseWithEmojis}`;

      res.json({ response: finalResponse, requestCount });
    } else {
      console.error('Error generating response. Meta Llama API status:', response.status);
      const errorResponse = { error: 'Error generating response', requestCount };
      res.status(response.status).json(errorResponse);
    }
  } catch (error) {
    console.error('Internal server error:', error);
    const errorResponse = { error: 'Internal server error', details: error.toString(), requestCount };
    res.status(500).json(errorResponse);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});