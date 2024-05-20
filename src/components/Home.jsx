import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [id, setid] = useState("");
  const go = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=AIzaSyD0yjCTfcK49mhkQtxZZfY-wzLvK3PuxIc&part=snippet,contentDetails,statistics,status`
      );
      console.log(response);
      if (response.data.items.length > 0) {
        navigate(`/${id}`);
      } else {
        alert("No video found with the provided ID.");
      }
    } catch (err) {
      alert("An error occurred while fetching video details.");
    }
  };
  return (
    <div className="align-middle">
      <h1 className="text-2xl text-smbold">Enter the videoid in the url</h1>
      <h1>OR</h1>
      <div></div>
      <Input
        id="name"
        value={id}
        className="col-span-3 mt-2"
        placeholder="Enter the youtube videoid "
        onChange={(e) => {
          setid(e.target.value);
        }}
      />
      <Button type="submit" onClick={go} className="mt-3">
        click to go to video player
      </Button>
      <div className="flex justify-center">
        <img
          src="https://i.ibb.co/tHRCHdd/EXAMPLE.png"
          className="w-full mt-3 h-full shadow-lg border "
        />
      </div>
    </div>
  );
};

export default Home;
