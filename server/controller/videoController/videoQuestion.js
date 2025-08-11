import videoQuestion from '../../models/videoQuestion.js';
import mongoose from "mongoose";

export const AskVideoquestion = async (req, res) => {
  const { Videoquestiontitle, Videoquestionbody, Videoquestiontags, userposted } = req.body;
  const userid = req.userid;
  const videopath = req.file ? `/uploads/videos/${req.file.filename}` : null;

try {
    const newVideoQ = new videoQuestion({
      Videoquestiontitle,
      Videoquestionbody,
      Videoquestiontags,
      userposted,
      userid,
      videopath,
    });

    const saved = await newVideoQ.save();
   
    res.status(200).json("Video question added successfully");
  } catch (error) {
    console.error(" Error saving video question:", error);
    res.status(500).json("Failed to post video question");
  }
};

export const getallVideoquestion = async (req, res) => {
    try {
        const questions = await videoQuestion.find().sort({ createdAt: -1 });
        res.status(200).json(questions)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
        return
    }
};
export const getVideoQuestionById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("Invalid video question ID");
  }

  try {
    const question = await videoQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Video question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching video question:", error);
    res.status(500).json({ message: error.message });
  }
};


export const deleteVideoquestion = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("Videoquestion unavailable...");
    }
    try {
        await videoQuestion.findByIdAndDelete(_id);
        res.status(200).json({ message: "successfully deletd..." })
    } catch (error) {
        res.status(404).json({ message: error.message });
        return
    }
};

export const voteVideoquestion = async (req, res) => {
    const { id: _id } = req.params;
    const { value } = req.body;
    const userid = req.userid;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("Videoquestion unavailable...");
    }

    try {
        const videoQ = await videoQuestion.findById(_id);
        const upIndex = videoQ.upvote.findIndex((id) => id === String(userid));
        const downIndex = videoQ.downvote.findIndex((id) => id === String(userid));

        if (value === "upvote") {
            if (downIndex !== -1) {
                videoQ.downvote = videoQ.downvote.filter((id) => id !== String(userid));
            }
            if (upIndex === -1) {
                videoQ.upvote.push(userid);
            } else {
                videoQ.upvote = videoQ.upvote.filter((id) => id !== String(userid));
            }
        } else if (value === "downvote") {
            if (upIndex !== -1) {
                videoQ.upvote = videoQ.upvote.filter((id) => id !== String(userid));
            }
            if (downIndex === -1) {
                videoQ.downvote.push(userid);
            } else {
                videoQ.downvote = videoQ.downvote.filter((id) => id !== String(userid));
            }
        }

        await videoQuestion.findByIdAndUpdate(_id, videoQ);
        res.status(200).json({ message: "Voted successfully." });

    } catch (error) {
        res.status(404).json({ message: "ID not found" });
    }
};
