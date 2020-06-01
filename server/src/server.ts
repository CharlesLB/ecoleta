import express from 'express';

const app = express();

app.get('/', (request, response) => {
    console.log('Hello');

    response.json([
        "Charles",
        "Gabi"
    ]);
});

app.listen(3333);