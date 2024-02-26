import fs from "fs"
import path from "path"

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
