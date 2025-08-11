import mongoose from "mongoose";
import videoQuestion from "../../models/videoQuestion.js";

export const postvideoanswer = async (req, res) => {
    const { id: _id } = req.params;
    const { noofanswers, answerbody, useranswered, userid } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("question unavailable...");
    }
    updatenoofquestion(_id, noofanswers);
    try {
        const updatevideoquestion = await videoQuestion.findByIdAndUpdate(_id, {
            $addToSet: { answer: [{ answerbody, useranswered, userid }] },
        });
        res.status(200).json(updatevideoquestion)
    } catch (error) {
        res.status(404).json({ message: "error in uploading" });
        return
    }
};
const updatenoofquestion = async (_id, noofanswers) => {
    try {
        await videoQuestion.findByIdAndUpdate(_id, {
            $set: { noofanswers: noofanswers },
        });

    } catch (error) {
        console.log(error)
    }
}


export const deletevideoanswer = async (req, res) => {
    const { id: _id } = req.params;
    const { answerid, noofanswers } = req.body;

    // console.log(_id,answerid,noofanswers)
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("question unavailable...");
    }
    if (!mongoose.Types.ObjectId.isValid(answerid)) {
        return res.status(404).send("answer unavailable...");
    }
    
    updatenoofquestion(_id, noofanswers);
    try {
        await videoQuestion.updateOne(
            { _id },
            { $pull: { answer: { _id: new mongoose.Types.ObjectId(answerid) } } }
        );
        res.status(200).json({ message: "successfully deleted.." });
    } catch (error) {
        console.error(" Error during deletion:", error);
        res.status(500).json({ message: "error in deleting..", error: error.message });
    }
}
