const User = require("../models/User");
const Thought = require("../models/Thought");

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  getThoughtById({ params }, res) {
    Thought.findById(params.id)
      .then((dbThought) => {
        if (!dbThought) {
          res.status(404).json({ message: "No thought found" });
          return;
        }
        res.json(dbThought);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  createThought({ params, body }, res) {
    // console.log(params);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "Unable to find user!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(400).json({ message: "No thought found" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  deleteThought({params, body}, res ){
      Thought.findOneAndDelete({_id:params.id})
      .then((dbThoughtData) => {
        if (dbThoughtData) {
          res.status(404).json({ message: 'No thought found!' });
          return;
        }
        res.json({ message: 'Thought deleted!' });
      })
      .catch((err) => res.status(400).json(err));
},

addReaction({params, body}, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
    ) 
    .then(dbThoughtData => {
        if(!dbThoughtData) {
            res.status(404).json({ message: 'No thought found' });
            return;
        }

        res.json(dbThoughtData);
    })
},
    
};

module.exports = thoughtController;