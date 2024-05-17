const express = require('express');
const { YoutubeTranscript } = require('youtube-transcript');
const { writeFile } = require('fs');
const axios = require('axios');

const app = express();
const PORT = 3000;
const YOUTUBE_API_KEY = 'AIzaSyBrf9N8zgNxIUbFpDIUPjsyNNiYmsf6lfw';

app.use(express.static('public'));

app.get('/transcript', async (req, res) => {
  const videoUrl = req.query.url;
  const videoId = videoUrl.split('v=')[1].split('&')[0];

  try {
    // Obtener transcripción
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    const transcriptText = transcript.map(entry => entry.text);

    // Obtener detalles del video
    const videoResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`);
    const videoTitle = videoResponse.data.items[0].snippet.title;

    const response = {
      title: videoTitle,
      transcript: transcriptText
    };

    const transcriptData = JSON.stringify(response);
    writeFile('public/transcript.json', transcriptData, (err) => {
      if (err) throw err;
      console.log('Transcript data has been saved to public/transcript.json');
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching or storing the transcript:', error);
    if (error.message.includes('Transcript is disabled on this video')) {
      res.status(400).json({ error: 'Transcripción deshabilitada para este video.' });
    } else {
      res.status(500).json({ error: 'Error al obtener o almacenar la transcripción. Por favor, inténtalo de nuevo más tarde.' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
