import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import simpleGit from "simple-git";
import { getFiles, uploadFiles } from "./file";
import path from "path";
import { createClient } from "redis";

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(cors())
app.use(express.json());

app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const UUID = randomUUID();
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${UUID}`))
    console.log(__dirname)
    console.log(path.join(__dirname, `output/${UUID}`))

    const files = getFiles(path.join(__dirname, `output/${UUID}`))

    const promiseUpload = files.map(async file => {
        await uploadFiles(file.slice(__dirname.length + 1), file);
    })
    await Promise.all(promiseUpload)
    publisher.lPush("build-queue", UUID);

    publisher.hSet("status", UUID, "uploaded");

    res.json({
        UUID: UUID
    })
});

app.get("/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string)
    res.json({
        status: response
    })
})

app.listen(3000);