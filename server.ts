import { readLines, writeAll } from "./deps.ts";

const listener = Deno.listen({port: 8080});
console.log("listening on 0.0.0.0:8080");

class Game {
    number = 0;
    constructor() {
        this.number = Math.floor(Math.random() * 300);
    }
    guess(num: number) {
        if (isNaN(num)) return "not a number";
        if (num < this.number) return "less";
        if (num > this.number) return "more";
        return "correct";
    }
}

const encoder = new TextEncoder();


for await (const conn of listener) {
    const game = new Game();
    console.log(`Got connection: ${conn.rid}`);
    console.log(`Number to guess: ${game.number}`);
    for await (const line of readLines(conn)) {
        if (!/.+\ .+$/.test(line)) {
            writeAll(conn, encoder.encode("<command> <arg>\n"));
            continue;
        }
        const [command, arg] = line.split(' ');
        if (command.toLowerCase() === 'guess') {
            const answer = game.guess(Number(arg));
            console.log(`${conn.rid}: ${answer}`);
            writeAll(conn, encoder.encode(answer+'\n'));
        }
    }
    console.log(`Disconnected: ${conn.rid}`);
    conn.close();
}