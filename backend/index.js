//import required modules
const express = require("express");
//initialize express app
const app = express();
const db = require("./db");
const cors = require("cors");

const NoteRoutes = require("./routes/noteRoutes");

const {
  getCategory,
  deleteCategory,
  getOneCategryData,
} = require("./controller/categoryController");
const {
  getDynamicNoteData,
  DeleteInActiveNotes,
  AutoHardDeleteNotes,
} = require("./controller/noteController");

// Middleware to parse incoming requests with JSON
app.use(express.json());

//middleware to handle cors policy
app.use(cors());
/* app.use(cors({
    origin: "https://note-taking-approntend.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
})); */

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Note API" });
});

app.use("/note", NoteRoutes);

//manually create routes because of casting issues
app.get("/search", getDynamicNoteData);
app.delete("/remove", DeleteInActiveNotes);
app.get("/category", getCategory);
app.get("/category/:id", getOneCategryData);
app.delete("/category/:id", deleteCategory);

const PORT = 3030;
 //app listning port
 app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
  });