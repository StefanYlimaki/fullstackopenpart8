const Author = require("./models/Author");
const Book = require("./models/Book");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "NEED_HERE_A_SECRET_KEY";
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser;
    },
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allAuthors: async () => {
      console.log('kaikki kirjailijat')
      return Author.find({});
    },
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author });
        return Book.find({
          $and: [
            { author: { $in: author.id } },
            { genres: { $in: args.genre } },
          ],
        }).populate("author");
      }

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        return Book.find({ author: { $in: author.id } }).populate("author");
      }

      if (args.genre) {
        return Book.find({ genres: { $in: args.genre } }).populate("author");
      }

      return Book.find({}).populate("author");
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({});
      return books.filter((b) => String(b.author) === String(root.id)).length;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });

        try {
          await author.save();
        } catch (error) {
          throw new UserInputError(error.message, { invalidArgs: args });
        }
      }

      const book = new Book({ ...args, author });

      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      const author = await Author.findOne({ name: args.name });

      if (!author) return null;

      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }

      return author;
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
