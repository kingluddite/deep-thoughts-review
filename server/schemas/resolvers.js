const { User, Thought } = require('../models');

const resolvers = {
  Query: {
    // get all users
    users: async () => User.find().select('-__v -password').populate('friends').populate('friends'),
    // get a user by username
    user: async (parent, { username }) =>
      User.findOne({ username }).select('-__v -password').populate('friends').populate('thoughts'),
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => Thought.findOne({ _id }),
  },
};

module.exports = resolvers;
