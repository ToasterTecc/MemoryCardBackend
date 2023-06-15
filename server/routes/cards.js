import express from 'express';
import {data} from '../../data.js';

const router = express.Router();

/*Get is to read the data from the database, you shouldn't use a body, you mainly pass a parameter*/
router.get('/', (req, res) => {
  res.json(data);
});

/*Post can be used to check if the body being sent is valid, duplicate, etc.*/
/*needs to specify a body to do logic*/
router.post('/', (req, res) => {
    res.send('Create a new card');
});

//globally unique id GUID
//call tables for each category
router.route('/:id').get((req, res) => {
    res.json({cards:req.cards, message:'Get card by id' + req.params.id});
    console.log(req.cards);
})
.put((req, res) => { 
    res.send('Update card by id ');
})
.delete((req, res) => {   
    res.send('Delete card by id');
})

router.param('id', (req, res, next, id) => {
    /*loop through, if id == id from url then assign variable to req.cards*/
    req.cards = data.categories[0].flashcards[(id)-1];
    next();
});

export default router;
