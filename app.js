import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path";
import User from "./User.js";
dotenv.config();

const app = express();


const port = process.env.PORT || 5050;

mongoose.connect(process.env.MONGO_URI).then(() => {
  // console.log("Mongo Connected");
  app.listen(port, () => {
    console.log(`Server @ ${port}`);
  });
});

const __dirname = path.resolve();

app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

const generateToken = (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expires in 1 day
  });
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    return null; // Token verification failed
  }
};

const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/user"); // Redirect to login page if no token
  }

  const userId = verifyToken(token);
  if (!userId) {
    return res.redirect("/user"); // Redirect to login page if token is invalid
  }

  req.body.userId = userId;
  next();
};

app.get("/", requireAuth, (req, res) => {
  // res.send("Home Route");
  res.redirect("/game");
});

app.get("/user", (req, res) => {
  res.render("login");
});

app.get("/game", requireAuth, (req, res) => {
  res.render("game");
});

// Route for user signup
app.post("/signup", async (req, res) => {
  try {
    // Extract data from the request body
    const { username, password } = req.body;

    // Ensure all required fields are present in the request
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required information." });
    }

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists. Please choose a different one.",
      });
    }

    // Hash the password securely using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user object with the hashed password
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with the newly created user object
    res.status(201).json(newUser);
  } catch (error) {
    // Handle any errors that occurred during the signup process
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "An error occurred during signup. Please try again later.",
    });
  }
});

// Route for user Login
app.post("/login", async (req, res) => {
  // res.send("Login Successful");
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new Error("Enter All Details");
    }

    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User Not Found");
    }

    const cmp = await bcrypt.compare(password, user.password);

    if (!cmp) {
      throw new Error("Wrong Password");
    }

    const token = generateToken(user);

    res.cookie("token", token);

    res.status(200).send({ message: "Login Success", token });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// app.get("/list", async (req, res) => {
//   const users = await User.find({});
//   const pUsers = users.map((user) => {
//     return {
//       username: user.username,
//       UserHighScore: user.UserHighScore,
//       ComputerHighScore: user.ComputerHighScore,
//     };
//   });
//   res.send(pUsers);
// });

app.get("/user/score", requireAuth, async (req, res) => {
  const { userId } = req.body;
  // console.log(userId);
  const user = await User.findOne({ _id: userId });
  // console.log(user);
  res.status(200).json({
    user: user.UserHighScore,
    computer: user.ComputerHighScore,
  });
});

// app.get("/user/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     const user = await User.findOne({ _id: id });
//     console.log(user);
//     if (!user) {
//       throw new Error("User Not Existed");
//     }
//     res.status(200).json({
//       username: user.username,
//       score: user.UserHighScore,
//       computer: user.ComputerHighScore,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ message: error.message });
//   }
// });

app.post("/user/modify", requireAuth, async (req, res) => {
  const { userScore, computerScore, round, userId } = req.body;
  const user = await User.findOne({ _id: userId });

  console.log(userScore, computerScore);

  if (userScore >= computerScore) {
    if (userScore > user.UserHighScore[round]) {
      user.UserHighScore[round] = userScore;
      user.ComputerHighScore[round] = computerScore;
    } else if (userScore === user.UserHighScore[round]) {
      user.UserHighScore[round] = userScore;
      user.ComputerHighScore[round] = Math.min(
        computerScore,
        user.ComputerHighScore[round]
      );
    }
  }

  await user.save();

  res.json({ message: "Scores Updated" });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  // res.send("Logout Successful");
  res.redirect("/user");
});

app.get("/top", async (req, res) => {
  try {
    const users = await User.find({});
    const game5 = users.map((el) => {
      return {
        username: el.username,
        userScore: el.UserHighScore[0],
        computerScore: el.ComputerHighScore[0],
      };
    });
    const game10 = users.map((el) => {
      return {
        username: el.username,
        userScore: el.UserHighScore[1],
        computerScore: el.ComputerHighScore[1],
      };
    });
    const game15 = users.map((el) => {
      return {
        username: el.username,
        userScore: el.UserHighScore[2],
        computerScore: el.ComputerHighScore[2],
      };
    });

    const cmp = (a, b) => {
      if (a.userScore === b.userScore) {
        return a.computerScore - b.computerScore;
      } else {
        return b.userScore - a.userScore;
      }
    };

    game5.sort((a, b) => cmp(a, b));
    game10.sort((a, b) => cmp(a, b));
    game15.sort((a, b) => cmp(a, b));

    // res.send([game5, game10, game15]);
    res.render("top", { scores: [game5, game10, game15] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use((req, res) => {
  res.render("404");
});
