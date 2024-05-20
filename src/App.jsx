import { useState, useEffect, useRef, createRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import YouTube from "react-youtube";
import { useParams } from "react-router-dom";

import "./App.css";
import axios from "axios";
import Notes from "./components/Notes";

function App() {
  let { id } = useParams();
  const videoId = id;

  const [videoDetails, setVideoDetails] = useState(null);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);
  const elementRef = useRef(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyD0yjCTfcK49mhkQtxZZfY-wzLvK3PuxIc&part=snippet,contentDetails,statistics,status`
        );
        console.log(response);
        if (response.data.items.length > 0) {
          setVideoDetails(response.data.items[0].snippet);
        } else {
          setError("No video found with the provided ID.");
        }
      } catch (err) {
        setError("An error occurred while fetching video details.");
      }
    };

    fetchVideoDetails();
  }, []);

  const parseTime = (formattedTime) => {
    const minutesIndex = formattedTime.indexOf("m");
    const secondsIndex = formattedTime.indexOf("sec");
    const minutes = parseInt(formattedTime.slice(0, minutesIndex), 10);
    const seconds = parseInt(
      formattedTime.slice(minutesIndex + 1, secondsIndex),
      10
    );
    return minutes * 60 + seconds;
  };

  const seek = (event) => {
    playerRef.current.seekTo(parseTime(event.target.textContent));
    playerRef.current.pauseVideo();
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  const onReady = (event) => {
    // Save the player instance to the ref
    playerRef.current = event.target;
    event.target.playVideo();
  };
  const pause = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
      return playerRef.current.getCurrentTime();
    } else {
      return "Player not ready";
    }
  };

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  return (
    <div>
      <CardTitle className="text-left text-2xl text-bold mb-5">
        Video player with notes
      </CardTitle>
      <div className="w-full mb-5" style={{ height: "75vh" }}>
        <div className="relative w-full h-full rounded-lg" ref={elementRef}>
          <YouTube
            videoId={videoId}
            className="absolute top-0 left-0 w-full h-full"
            iframeClassName="rounded-xl"
            opts={opts}
            onReady={onReady}
            rel="0"
          />
        </div>
      </div>
      <div className="block text-start mb-7">
        <CardTitle>Title: {videoDetails?.title}</CardTitle>
        <CardDescription>
          Description: {videoDetails?.description.substring(0, 150)}...
        </CardDescription>
      </div>
      <hr className="my-9" />
      <Notes pause={pause} videoId={videoId} seek={seek} />{" "}
    </div>
  );
}

export default App;
