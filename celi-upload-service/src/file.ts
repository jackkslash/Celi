import { S3 } from "aws-sdk";
import fs from "fs"
import path from "path"
import 'dotenv/config'

export const getFiles = (fPath: string) => {
    let res: string[] = []

    const allFilesAndFolders = fs.readdirSync(fPath);

    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(fPath, file)
        console.log(fullFilePath)
        if (fs.statSync(fullFilePath).isDirectory()) {
            res = res.concat(getFiles(fullFilePath))
            console.log("dir")
        } else {
            console.log("dir")
            res.push(fullFilePath)
        }
    })
    console.log(res)
    return res

}

const s3 = new S3({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRECTACCESSKEY,
    endpoint: process.env.ENDPOINT
})

export const uploadFiles = async (flieName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath)
    const res = await s3.upload({
        Body: fileContent,
        Bucket: "celi",
        Key: flieName
    }).promise();
    console.log(res)
}
