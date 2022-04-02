import { copy } from "./deps.ts";

console.log("Guess game.\n")

const conn = await Deno.connect({port: 8080});
console.log("connected on 0.0.0.0:8080");
copy(conn, Deno.stdout);
await copy(Deno.stdin, conn);
conn.close();