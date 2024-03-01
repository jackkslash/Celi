import { commandOptions, createClient } from "redis";
import { dls3Folder, uploadFinalBuild } from "./aws";
import { build } from "./utils";

const subscriber = createClient();
subscriber.connect();


(async function () {
    while (1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
        )
        const id = res!.element
        console.log(res)
        console.log(id)
        await dls3Folder(`output/${id}`)
        await build(id)
        uploadFinalBuild(id);
    }
})();

