import express from "express";
import { PORT } from "./constants.js";
import cors from "cors";
import searchRouter  from "./routes/search.routes.js";

// Making express app
const app = express();
// Allowing json
app.use(express.json());
// Allowing Cors from all origin
app.use(cors());

// Routing
app.use("/search", searchRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});