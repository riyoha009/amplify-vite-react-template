import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean().default(false),
//    })
      }).authorization((allow) => [allow.owner()]),
//    .authorization((allow) => [allow.publicApiKey()]),

  Meal: a
    .model({
      name: a.string().required(),
      date: a.datetime().required(),
      foods: a.hasMany("FoodItem", "mealId"),
    })
    .authorization((allow) => [allow.owner()]),

  FoodItem: a
    .model({
      name: a.string().required(),
      servings: a.float().required(),
      calories: a.float().required(),
      carbohydrates: a.float().required(),
      protein: a.float().required(),
      fats: a.float().required(),
      mealId: a.id().required(),
      meal: a.belongsTo("Meal", "mealId"),
    })
    .authorization((allow) => [allow.owner()]),

  WorkoutSession: a
    .model({
      workoutType: a.string().required(),
      date: a.string().required(),
      muscleGroup: a.string(),
      exercises: a.hasMany("Exercise", "workoutSessionId"),
    })
    .authorization((allow) => [allow.owner()]),

  Exercise: a
    .model({
      name: a.string().required(),
      muscleGroup: a.string().required(),
      workoutSessionId: a.id().required(),
      workoutSession: a.belongsTo("WorkoutSession", "workoutSessionId"),
      sets: a.hasMany("WorkoutSet", "exerciseId"),
    })
    .authorization((allow) => [allow.owner()]),

  WorkoutSet: a
    .model({
      setNumber: a.integer().required(),
      reps: a.integer().required(),
      weight: a.float().required(),
      exerciseId: a.id().required(),
      exercise: a.belongsTo("Exercise", "exerciseId"),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool", //"apiKey",
    // API Key is used for a.allow.public() rules
    //apiKeyAuthorizationMode: {
      //expiresInDays: 30,
    //},
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
