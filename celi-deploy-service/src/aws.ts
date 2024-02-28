import { S3 } from "aws-sdk";
import fs from "fs";
import path from "path";
import 'dotenv/config'

const s3 = new S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRECTACCESSKEY,
    endpoint: process.env.ENDPOINT
})

export async function dls3Folder(prefix: string) {
    const allFiles = await s3.listObjectsV2({
        Bucket: "celi",
        Prefix: prefix
    }).promise();

    const allPromises = allFiles.Contents?.map(async ({ Key }) => {
        return new Promise(async (resolve) => {
            if (!Key) {
                resolve("");
                return;
            }

            const finalOutputPath = path.join(__dirname, Key)
            const outputFile = fs.createWriteStream(finalOutputPath)
            const dir = path.dirname(finalOutputPath)

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }
            s3.getObject({
                Bucket: "celi",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve("")
            })
        })
    }) || []
    console.log("awaiting")

    await Promise.all(allPromises?.filter(x => x !== undefined))
} 