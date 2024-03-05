import express from "express";

const app = express();

//sudo nano /etc/hosts
//local.localhost

app.get("/*", async (req, res) => {
    const host = req.hostname;
    console.log(host)
    const id = host.split(".")[0];
    console.log(id)
})

app.listen(3000)