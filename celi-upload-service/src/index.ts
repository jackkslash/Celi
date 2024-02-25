import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import simpleGit from "simple-git";

const app = express();
app.use(cors())
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const UUID = randomUUID();
    await simpleGit().clone(repoUrl, `output/${UUID}`)
    res.json({
        UUID: UUID
    })
});

app.listen(3000);