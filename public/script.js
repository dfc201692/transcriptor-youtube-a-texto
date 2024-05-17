let currentVideoUrl = '';
let currentVideoTitle = '';
let currentTranscript = '';

async function fetchTranscript() {
  const videoUrl = document.getElementById('videoUrl').value;

  // Validación para URL vacía
  if (!videoUrl.trim()) {
    alert('Por favor, ingresa una URL de YouTube.');
    return;
  }

  const response = await fetch(`/transcript?url=${encodeURIComponent(videoUrl)}`);

  if (response.ok) {
    const data = await response.json();
    const transcriptElement = document.getElementById('transcript');
    transcriptElement.textContent = ''; // Limpiar contenido previo

    // Mostrar título del video
    const titleElement = document.createElement('h2');
    titleElement.textContent = `Título del video: ${data.title}`;
    transcriptElement.appendChild(titleElement);

    // Mostrar transcripción
    const transcriptText = document.createElement('pre');
    transcriptText.textContent = data.transcript;
    transcriptElement.appendChild(transcriptText);

    // Habilitar el botón de guardar
    document.getElementById('saveButton').disabled = false;

    // Almacenar datos actuales
    currentVideoUrl = videoUrl;
    currentVideoTitle = data.title;
    currentTranscript = data.transcript;
  } else {
    const errorData = await response.json();
    let errorMessage = 'Ha ocurrido un error desconocido. Por favor, inténtalo de nuevo.';

    if (response.status === 400 && errorData.error) {
      errorMessage = errorData.error;
    } else if (response.status === 500 && errorData.error) {
      errorMessage = errorData.error;
    }

    alert(`Error: ${errorMessage}`);
    console.error('Error al obtener la transcripción:', errorMessage);
  }
}

async function saveTranscript() {
  if (!currentVideoUrl || !currentVideoTitle || !currentTranscript) {
    alert('No hay datos para guardar. Por favor, obtén una transcripción primero.');
    return;
  }

  const response = await fetch('/save-transcript', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      youtube_url: currentVideoUrl,
      titulo_video: currentVideoTitle,
      transcripcion: currentTranscript
    })
  });

  if (response.ok) {
    alert('Transcripción guardada exitosamente.');
  } else {
    const errorData = await response.json();
    alert(`Error al guardar la transcripción: ${errorData.error}`);
    console.error('Error al guardar la transcripción:', errorData.error);
  }
}
