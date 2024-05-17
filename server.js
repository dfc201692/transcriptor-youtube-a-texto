const express = require('express');
const { YoutubeTranscript } = require('youtube-transcript');
const { writeFile } = require('fs');
const axios = require('axios');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const YOUTUBE_API_KEY = 'AIzaSyBrf9N8zgNxIUbFpDIUPjsyNNiYmsf6lfw';

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost', // Cambia esto si tu base de datos está en otro host
  user: 'root', // Reemplaza con tu usuario de MySQL
  password: '', // Reemplaza con tu contraseña de MySQL
  database: 'transcripciones' // Reemplaza con el nombre de tu base de datos
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/transcript', async (req, res) => {
  const videoUrl = req.query.url;
  const videoId = videoUrl.split('v=')[1]?.split('&')[0];

  if (!videoId) {
    res.status(400).json({ error: 'URL de YouTube inválida.' });
    return;
  }

  try {
    // Obtener transcripción
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const transcriptText = transcript.map(entry => entry.text).join('\n');

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

app.post('/save-transcript', (req, res) => {
  const { youtube_url, titulo_video, transcripcion } = req.body;

  const query = 'INSERT INTO transcripciones (youtube_url, titulo_video, transcripcion) VALUES (?, ?, ?)';
  db.query(query, [youtube_url, titulo_video, transcripcion], (err, result) => {
    if (err) {
      console.error('Error guardando en la base de datos:', err);
      res.status(500).json({ error: 'Error al guardar la transcripción en la base de datos.' });
      return;
    }
    console.log('Datos guardados en la base de datos:', result);
    res.json({ message: 'Transcripción guardada exitosamente.' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
