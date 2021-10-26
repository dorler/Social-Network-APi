const User = require('../models/User');
const Thought = require('../models/Thought');

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate('thoughts')
        .populate('friends')
        .select('-__v')
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400).json(err);
        });
},

getUserById({ params }, res) {
    User.findOne({ _id: params.id })
        .populate('thoughts')
        .populate('friends')
        .select('-__v')
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
},

createUser({ body }, res) {
    User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
  },

  updateUser({params, body}, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No user found'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err));
},

deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
},

addFriend({params}, res){
    User.findOneAndUpdate({ _id: params.userId}, {$addToSet: {friends: params.friendId}}, {new:true})
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({message: 'Cannot add friend. User not found with this id'});
                    return;
                }
            res.json(dbUserData);
            })
            .catch(err => res.json(err));
},

deleteFriend({params}, res){
    User.findOneAndUpdate(
        { _id: params.userId},
        { $pull: {friends: params.friendId}},
        { new: true}
    )
    .then(dbUserData => res.json(dbUserData))
    .catch(err => res.json(err));
},
    
};

module.exports = userController;