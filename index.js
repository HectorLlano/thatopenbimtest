import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const dirName = dirname(fileURLToPath(import.meta.url));

// initiate simple server
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.static(path.join(dirName, "public")));

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

// add get request
app.get("/", (req, res) => {
    res.sendFile(dirName + "/index.html")
})