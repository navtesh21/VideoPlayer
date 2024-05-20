# Video Player with Notes

This project is a video player with notes functionality, allowing users to add, edit, and delete notes linked to specific timestamps in a YouTube video. Notes are saved in local storage and tied to the video ID, so changing the video will display the corresponding notes for the new video ID.

## Features

1. **Video Player**
    - Embed a YouTube video player that can play any YouTube video.
    - The video is changeable based on a provided video ID.

2. **Notes Functionality**
    - Users can add notes linked to specific timestamps in the video.
    - Each note includes:
        - A timestamp (clickable to jump to that point in the video).
        - The date the note was created.
        - The note content.
    - Users can edit and delete notes.

3. **Local Storage**
    - Save notes in local storage.
    - Notes are tied to the video ID, so changing the video will display the corresponding notes for the new video ID.

## Usage

To use this project, simply provide a YouTube video ID in the URL to load the video player with notes functionality for that video.

Example URL: `https://video-player-wine-chi.vercel.app/YT_VIDEO_ID`

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/navtesh21/video-player.git
   cd video-player
   npm install
   npm start

 Open your browser and navigate to http://localhost:3000 to view the project.



