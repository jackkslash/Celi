import express from "express";
import { S3 } from "aws-sdk";
import 'dotenv/config'

const app = express();

const s3 = new S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRECTACCESSKEY,
    endpoint: process.env.ENDPOINT
})
//sudo nano /etc/hosts

app.get("/*", async (req, res) => {
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path
    console.log(id)
    const contents = await s3.getObject({
        Bucket: "celi",
        Key: `dist/${id}${filePath}`
    }).promise();

    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);
    res.send(contents.Body)

})

app.listen(3001)