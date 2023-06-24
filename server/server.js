import express from "express"; /*ES6 syntax vs require*/
import cardsRouter from "./routes/cards.js"; /*const userRouter = require("./routes/cards");*/

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.use('/cards', cardsRouter); // Use the userRouter for "/cards" route


app.listen(3000);