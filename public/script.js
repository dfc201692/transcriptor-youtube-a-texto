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
      transcriptText.textContent = data.transcript.join('\n');
      transcriptElement.appendChild(transcriptText);
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
  