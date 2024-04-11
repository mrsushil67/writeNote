//imported required modules
const mongoose = require('mongoose')
const Note = require("../models/notemodels")
const Category = require("../models/category")
const cron = require('node-cron');



//get all notes from db
const getAllNoteData = async(req, res) => {
    try {
        //all data assign to notes variable and sort by created date 
        const notes = await Note.find({}).sort({ createdAt: -1 })
            //return success response and pass data and number of notes using JSON format
        return res.status(200).json({
            count: notes.length,
            data: notes
        })
    } catch (error) {
        //error handling
        return res.status(500).json({ message: error.message });
    }
}

//get all active data
const getActiveNoteData = async(req, res) => {
    try {
        // Find all notes where isActive is true and sort by createdAt date
        const notes = await Note.find({ isActive: true }).sort({ createdAt: -1 });

        // Return success response and pass data and number of notes using JSON format
        return res.status(200).json({
            count: notes.length,
            data: notes
        });
    } catch (error) {
        // Error handling
        return res.status(500).json({ message: error.message });
    }
};


//get inactive data
const getInActiveNoteData = async(req, res) => {
    try {
        // Find all notes where isActive is true and sort by createdAt date
        const notes = await Note.find({ isActive: false }).sort({ createdAt: -1 });

        // Return success response and pass data and number of notes using JSON format
        return res.status(200).json({
            count: notes.length,
            data: notes
        });
    } catch (error) {
        // Error handling
        return res.status(500).json({ message: error.message });
    }
};

//get dynamicly search data
const getDynamicNoteData = async(req, res) => {
    try {
        const searchTerm = req.query.term;
        const notes = await Note.find({
            $and: [{

                    $or: [
                        { title: { $regex: searchTerm, $options: 'i' } },
                        { content: { $regex: searchTerm, $options: 'i' } }
                    ]
                },
                { isActive: true }
            ]
        });
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

}


//add new note
const addNewNote = async(req, res) => {
    try {

        const { title, content, category } = req.body;

        if (!title || !content) {
            return res.status(400).send({ message: "Please fill out all input fields" })
        }

        let categoryObj = await Category.findOne({ name: category });

        if (!categoryObj) {
            categoryObj = new Category({ name: category });
            await categoryObj.save();

        }
        const newNote = {
            title: req.body.title,
            content: req.body.content,
            color: req.body.color,
            category: categoryObj.id
            
        }

        const note = await Note.create(newNote)
        return res.status(200).send({ data: note, message: "New Note added successfully" })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
        
    }
}


//get specific note based on id
const getOneNoteData = async(req, res) => {

    const { id } = req.params;
    try {
        //find the note by id and assign it into notes variable if requested data exsist
        const notes = await Note.findById({ _id: id })

        //if no data found then send not found status else pass success status
        if (!notes) {
            return res.status(400).json({ message: "No user found" });
        } else {
            return res.status(200).json(notes);
        }
    } catch (error) {
        //error handling
        return res.status(500).json({ message: error.message });
    }
}



//update exsist note
const updateNote = async(req, res) => {
    try {
        if (!req.body.title || !req.body.content) {
            return res.status(400).send("Complete all the empty spaces")
        }

        const { id } = req.params;

        let categoryObj = await Category.findOne({ name: req.body.category });

        if (!categoryObj) {
            categoryObj = new Category({ name: category });
            await categoryObj.save();
        }

        const updatedNote = await Note.findByIdAndUpdate(id, {...req.body, category: categoryObj }, { new: true });

        if (!updatedNote) {
            return res.send("No such note found!").status(400)
        } else {
            return res.send("Update Completed Successfully!").status(400)
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//soft delete
const softDeleteNote = async(req, res) => {
    try {
        const { id } = req.params;

        const note = await Note.findById(id);

        if (!note) {
            return res.send("No such note found!").status(400)
        } else {
            note.isActive = !note.isActive;
            await note.save()
            return res.send("Delete Note Completed Successfully!").status(400)
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//hard delete
const deleteNote = async(req, res) => {
    try {
        const { id } = req.params;
        const delNote = await Note.findByIdAndDelete(id);

        if (!delNote) {
            return res.status(400).send("No Note Found with this ID");
        } else {
            return res.status(200).send("Note Deleted Successfully")
        }


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


//hard delete for all inactive data

const DeleteInActiveNotes = async(req, res) => {
    try {
        const result = await Note.deleteMany({ isActive: false });

        if (result.deletedCount > 0) {
            res.json({ message: 'Inactive notes deleted successfully' });
        } else {
            res.status(404).json({ message: 'No inactive notes found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

}


//shadule the hard delete process
const AutoHardDeleteNotes = () => {
    cron.schedule('0 0 * * *', async() => {
        try {
            const thirtyDaysAgo = new Date();
            //delete automatically after 30 days from user last updated time
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            await Note.deleteMany({ isActive: false, updatedAt: { $lt: thirtyDaysAgo } });
            console.log('Inactive documents older than 30 days deleted successfully.');
        } catch (error) {
            console.error('Error occurred during document deletion:', error);
        }
    });
}

//export the functions
module.exports = { getAllNoteData, getOneNoteData, addNewNote, updateNote, deleteNote, softDeleteNote, getActiveNoteData, getInActiveNoteData, getDynamicNoteData, DeleteInActiveNotes, AutoHardDeleteNotes }