import express from "express";
import cors from "cors";
import { taskRouter } from "./routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));
app.use(cors());

app.use("/task", taskRouter);

const PORT = process.env.PORT || 8989;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
