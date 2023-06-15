import express from "express"; /*ES6 syntax vs require*/
import userRouter from "./routes/cards.js"; /*const userRouter = require("./routes/cards");*/
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.use('/cards', userRouter); /*rerouting to the userRouter*/

app.listen(3000);