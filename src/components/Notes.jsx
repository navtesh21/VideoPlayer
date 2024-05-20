import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { json } from "react-router-dom";

const Notes = ({ pause, videoId, seek }) => {
  const [id, setid] = useState(1);
  const [idedit, setidedit] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [notes, setnotes] = useState(() => {
    const savedNotes = localStorage.getItem(JSON.stringify(videoId));
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);

        return parsedNotes;
      } catch (error) {
        console.error("Error parsing saved notes:", error);
      }
    }
    return []; // Return an empty array as the initial state if no saved notes
  });

  console.log(notes);
  const [timestamp, setTimestamp] = useState("");
  const [note, setNote] = useState("");

  const formatTime = (seconds) => {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Add leading zero if minutes or seconds are less than 10
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedMinutes}m${formattedSeconds}sec`;
  };
  function getCurrentFormattedDate() {
    const now = new Date();
    return format(now, "d MMM''yy");
  }

  useEffect(() => {
    localStorage.setItem(JSON.stringify(videoId), JSON.stringify(notes));
  }, [notes]);

  const save = () => {
    if (note) {
      if (notes.length > 1) {
        const data = [
          videoId,
          [
            ...notes[1],
            { timestamp, date: getCurrentFormattedDate(), note, id },
          ],
        ];
        setnotes(data);
        setid((prev) => prev + 1);

        console.log(data);
      } else {
        const data = [
          videoId,
          [{ timestamp, date: getCurrentFormattedDate(), note, id }],
        ];
        setnotes(data);
        setid((prev) => prev + 1);
        console.log(data);
      }
      setNote("");
    } else {
      alert("cannot be empty");
    }
  };

  const deletenote = (id) => {
    if (notes.length > 1) {
      const updatedNotes = notes[1].filter((match) => match.id !== id);
      setnotes((prevNotes) => {
        const newNotes = [...prevNotes];
        newNotes[1] = updatedNotes;
        return newNotes;
      });
    } else {
      console.error("notes[1] is undefined or not an array");
    }
  };

  const click = () => {
    setTimestamp(formatTime(pause()));
  };
  const saveEdit = (id, content) => {
    const updatedNotes = notes[1].filter((match) => match.id === id);
    setnotes((prev) => {
      return [
        prev[0],
        prev[1].map((note) =>
          note.id === id ? { ...note, note: editContent } : note
        ),
      ];
    });
    setidedit(null);
    setEditContent("");
  };
  const edit = (id, content) => {
    setidedit(id);
    setEditContent(content);
  };

  return (
    <Card>
      <CardHeader className="">
        <div className="flex justify-between max-lg:block">
          <div className="block text-start max-lg:text-center">
            <CardTitle className="text-xl">My notes</CardTitle>
            <CardDescription>
              All your notes at a single place. Click on the note to go to a
              specific timestamp on the video
            </CardDescription>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={click}
                className="max-lg:w-full max-lg:mt-3"
              >
                <PlusCircledIcon className="h-4 w-4 mr-2" />
                Add new note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Write Note</DialogTitle>
                <DialogDescription>
                  Write note for the given timestamp.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="block gap-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Label htmlFor="name" className=" ">
                      Date: {getCurrentFormattedDate()}
                    </Label>
                    <Label htmlFor="name" className=" ">
                      Timestamp: {timestamp}
                    </Label>
                    <Label htmlFor="name" className="">
                      Note:
                    </Label>
                  </div>
                  <Input
                    id="name"
                    value={note}
                    className="col-span-3 mt-2"
                    onChange={(e) => {
                      setNote(e.target.value);
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button type="submit" onClick={save}>
                    Save changes
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <hr className="my-5" />
        {notes && notes.length > 1 && notes[1].length > 0 ? (
          notes[1].map((data) => {
            return (
              <>
                <div className="text-start">
                  <h3 className="text-bold">{data.date}</h3>
                  <CardDescription className="mb-3 text-md">
                    Timestamp:{" "}
                    <span
                      className="text-[#874CCC] cursor-pointer"
                      onClick={seek}
                    >
                      {data.timestamp}
                    </span>
                  </CardDescription>
                  {idedit == data.id ? (
                    <input
                      value={editContent}
                      className="border border-[red] rounded-b-lg p-2 w-full"
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                  ) : (
                    <p className="border border-gray-200 rounded-b-lg p-2">
                      {data.note}
                    </p>
                  )}
                </div>
                <div className="justify-end my-2 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      deletenote(data.id);
                    }}
                  >
                    Delete note
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      idedit == data.id
                        ? saveEdit(data.id, data.note)
                        : edit(data.id, data.note)
                    }
                  >
                    {idedit == data.id ? "Save " : "Edit note"}
                  </Button>
                </div>
              </>
            );
          })
        ) : (
          <p>No notes available</p>
        )}
        <hr className="my-5" />
      </CardContent>
    </Card>
  );
};

export default Notes;
