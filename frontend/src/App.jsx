import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AddNote from "./pages/AddNote";
import UpdateNote from "./pages/UpdateNote";
import DeletedNote from "./pages/DeletedNote";
import ViewNote from "./pages/ViewNote";
import DeletedNotesList from "./pages/DeletedNotesList";
import RemoveNote from "./components/RemoveNote";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addnote" element={<AddNote />} />
        <Route path="/updatenote/:id" element={<UpdateNote />} />
        <Route path="/deletednote" element={<DeletedNotesList />} />
        <Route path="/deletednote/:id" element={<DeletedNote />} />
        <Route path="/removenote" element={<RemoveNote />} />
        <Route path="/viewnote/:id" element={<ViewNote />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
