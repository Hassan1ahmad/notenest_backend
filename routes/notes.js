import express from 'express';
const router = express.Router();

import { body, validationResult } from 'express-validator';
import fetchUser from '../middleware/fetchUser';
import Notes from '../models/Notes';




//  Route 1: add a note using POST  "/api/notes/addnotes". login required
router.post('/addnotes',[ 
    // validation
    body('title','Type a title').exists(),
    body('description','type  description of more than 2 words').isLength({min: 2})
 ],fetchUser, async ( req , res)=>{
    // for error
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
     //handle body errors
       return res.status(400).json({ errors : errors.array() })
    }
    try {
        // creating notes
        const notes = await Notes.create({
            title : req.body.title,
            description : req.body.description,
            tag : req.body.tag || 'General',
            user : req.user.id  
        })
        res.send(notes)
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

//  Route 2: get all note using get  "/api/notes/allnotes". login required

router.get('/allnotes',fetchUser,async(req,res)=>{
    try {
        const allnotes = await Notes.find({user : req.user.id});
        res.json(allnotes)
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
})

//  Route 3: update note using put  "/api/notes/updatenotes". login required

router.put('/updatenotes/:id',fetchUser,async(req,res)=>{
    const {title,description,tag} = req.body;
    // create updatted note
    const newnote={} 
    if(title){newnote.title = title}
    if(description){newnote.description = description}
    if(tag){newnote.tag = tag}
    // find note to be updates
    const note = await Notes.findById(req.params.id)
    if(!note){ return res.status(404).json({ error: "Note not found " })}
    if(note.user.toString() !== req.user.id){return res.status(403).json({ error: "Not authorized to update this note" })}
     try {
         const updatednote = await Notes.findByIdAndUpdate(req.params.id,{$set : newnote},{new: true})
         res.json(updatednote)
     } catch (error) {
        return res.status(500).json({ error: "Error updating the note" });
     }
})

//  Route 4: delete note using delete  "/api/notes/deletenotes". login required

router.delete('/deletenotes/:id',fetchUser,async(req,res)=>{
     // find note to be delete
    const note = await Notes.findById(req.params.id)
    if(!note){ return res.status(404).json({ error: "Note not found " })}
    if(note.user.toString() !== req.user.id){return res.status(403).json({ error: "Not authorized to delete this note" })}
     try {
        // delete note
           const deletednote= await Notes.findByIdAndDelete(req.params.id)
         res.json({'Sucess': 'Note deleted',deletednote})
     } catch (error) {
        return res.status(500).json({ error: "Error updating the note" });
     }
})
export default router;
