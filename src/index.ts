import { Elysia, t } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .post("/add", ({body}) => {
    console.log(body.username);
    return JSON.stringify(body);
  })
  .post("/validatebody", ({body}) => body , {    
    body: t.Object({
      id: t.Number(),
      username: t.String()
    })
  })
  .get("id/:id", (context) => {
    console.log("You are the id:", context.params.id);
    return {
      "id": context.params.id
    }
  })
  .get("/query", ({query}) => {
    return {
      "id": query.id,
      "name": query.name
    }
  })
  .post("/transform", ({body}) => body, {
    transform: ({body}) => {
      body.id = body.id + 1
    }
  })
  .decorate("youDecor", () => Date.now())
  .state("counter", 10)
  .get("/mystate", ({
    youDecor,
    store: {counter}
  }) => `${counter} ${youDecor()}`)  
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
