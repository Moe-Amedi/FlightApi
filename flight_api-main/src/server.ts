import { App } from "./app";

async function main() {
    const app = new App(3970);
    await app.listen();
}

main();