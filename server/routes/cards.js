import express from 'express';
import {
    data
} from '../../data.js';

const cardsRouter = express.Router();

/*Get is to read the data from the database, you shouldn't use a body, you mainly pass a parameter*/
cardsRouter.get('/', (req, res) => {
    res.json(data);
});
const count = 0;

/*Post can be used to check if the body being sent is valid, duplicate, etc.*/

// Route to get all category names, using /cards/categories from the categoryRouter
cardsRouter.route('/categories/').get((req, res) => {
    //const categoryNames = data.categories.map((category) => category.category);
    const categoryID = data.categories.map((category, ID) => ({ID, category: category.category}));

    res.json(categoryID);
}).post((req, res) => { //Post to add a new category

    const {category} = req.body;
    if (!category) {
        res.status(400).json({
            error: "Category name is required. category: string"
        });
        return;
    }

    const newCategory = {
        category: category,
        flashcards: [],
    };

    data.categories.push(newCategory);
    res.status(201).json({message: "New category added " + newCategory.category});
});

// Route to get all cards for a specific category, update category name, post new cards to the category
cardsRouter.route('/categories/:categoryID/').get((req, res) => {
    const categoryID = parseInt(req.params.categoryID);

    if (categoryID >= 0 && categoryID < data.categories.length) {
        const category = data.categories[categoryID];

        res.json({
            [categoryID]: category.category,
            flashcards: category.flashcards
        });
    }
    else{
        res.status(404).json({
            error: "Category not found"
        });
    }

}).put((req, res) => { //Update a category name
  const { categoryID } = req.params; //object destructuring
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ error: "New category name is required. category: string" });
  }

  if (categoryID >= 0 && categoryID < data.categories.length) {
    const category = data.categories[categoryID];
    res.status(201).json({message: category.category + " name updated to: " + category.name});
    data.categories[categoryID].category = category;
  }
  else{
    return res.status(404).json({ error: "Category ID not found" });
  } 
}).delete((req, res) => { //Delete a category by ID
  const { categoryID } = req.params;

  if (categoryID >= 0 && categoryID < data.categories.length) { 
    const deletedCategory = data.categories.splice(categoryID, 1);
    res.json({
      message: "Deleted category: " + deletedCategory[0].category
    });
  } else {
    res.status(404).json({
      error: "Category not found"
    });
  }
}).post((req, res) => { //To post a new card to a category
    const { categoryID } = req.params; 
    const { question, options, answer } = req.body;
    if (!question || !answer) {
        res.status(400).json({
          error: "Flashcard must have a question and an answer"
        });
        return;
    }

    if (categoryID >= 0 && categoryID < data.categories.length) {
        const category = data.categories[categoryID];
        const newFlashcard = {
            id: category.flashcards.length,
            question,
            options,
            answer
        };
        category.flashcards.push(newFlashcard);
        res.status(201).json({message: "New flashcard added to " + data.categories[categoryID].category, newFlashcard: newFlashcard});
    }
    else{
        return res.status(404).json({ error: "Category ID not found" });
    }
});

//only to update (put) [return the body and 201 request] and delete a specific card
cardsRouter.route('/categories/:categoryID/:flashcardID').delete((req, res) => { //Delete a specific flashcard
    const { categoryID } = req.params;
    const flashcardID = parseInt(req.params.flashcardID);  

    if (categoryID >= 0 && categoryID < data.categories.length) {
        const category = data.categories[categoryID];
        const flashcardIndex = category.flashcards.findIndex(
            (flashcard) => flashcard.id === flashcardID
            //search for the flashcard ID and delete the object entirely
        );

        if (flashcardIndex !== -1) {
            const deletedCard = category.flashcards.splice(flashcardIndex, 1);
            res.json({
                message: "Deleted card",
                deletedCard
            });
        } else {
            res.status(404).json({
                error: "Flashcard not found"
            });
        }
    } else {
        res.status(404).json({
            error: "Category not found"
        });
    }
}).put((req, res) => { //Update a flashcard
    const { categoryID } = req.params;
    const flashcardID = parseInt(req.params.flashcardID);

    if (categoryID >= 0 && categoryID < data.categories.length) {
        const category = data.categories[categoryID];
        const flashcard = category.flashcards.find((flashcard) => flashcard.id === flashcardID);

        if (flashcard) {
            flashcard.question = req.body.question || flashcard.question;
            flashcard.options = req.body.options || flashcard.options;
            flashcard.answer = req.body.answer || flashcard.answer;

            res.json({message: "Updated card", flashcard});
        } else {
            res.status(404).json({
                error: 'Flashcard not found'
            });
        }
    } else {
        res.status(404).json({
            error: 'Category not found'
        });
    }
});

export default cardsRouter;