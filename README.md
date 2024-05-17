# transcriptor-youtube-a-texto
html, javascrip, css, node js, youtube, GCP, apis, se deben configurar variables de entorno y configurar todo el proyecto. tener presente que el video que se quiere transcribir debe tener activa o disponible la opcion de subtitulos.


# YouTube Transcript Fetcher

## Descripción
Este proyecto es una aplicación web que permite a los usuarios obtener la transcripción de un video de YouTube y guardarla en una base de datos MySQL. La aplicación utiliza Node.js para el backend, junto con Express, MySQL y la API de YouTube Data v3.

## Requisitos

- Node.js
- MySQL
- Navegador web

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/dfc201692/transcriptor-youtube-a-texto.git
   cd transcriptor-youtube-a-texto

BD
CREATE DATABASE youtube_transcripts;

USE youtube_transcripts;

CREATE TABLE transcripciones (
  id INT(11) NOT NULL AUTO_INCREMENT,
  youtube_url VARCHAR(255) NOT NULL,
  titulo_video VARCHAR(255) NOT NULL,
  transcripcion TEXT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;


node server.js

Autor: David Ferney Cruz 
Enlace al Repositorio: GitHub - dfc201692/transcriptor-youtube-a-texto


