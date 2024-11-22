const express  = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('The server is running');
});

/**
 * GET Request Get the user by the email
 */
app.get('/api/users/:email', (req, res) => {
    let users = [];

    if (fs.existsSync("users.json")) {
        users = read("users.json");
    }

    if (users === null || users === undefined || users.length <= 0) { // 404 object not found
        res.send(null);
    } else {
        const user = users.find((u) => u.email === req.params.email);

        if (!user) { // 404 object not found
            res.send(null);
        } else {
            res.send(user.email);
        }
    }
});

/**
 * GET Request Get the user by the email
 */
app.get('/api/verify_user/:email/:password', (req, res) => {

    let users = [];

    if (fs.existsSync("users.json")) {
        users = read("users.json");
    }

    if (users === null || users === undefined || users.length <= 0) { // 404 object not found
        res.send(null);
    } else {
        const user = users.find((u) => u.email === req.params.email);

        if (!user || req.params.password != user.password) { // 404 object not found
            res.send(null);
        } else {
            res.send(user.email);
        }
    }
});

/**
 * POST Request Save a user to the save file
 */
app.post('/api/users', (req, res) => {
    let users = [];
    let user = req.body;

    if (fs.existsSync("users.json")) {
        users = read("users.json");
    }

    users.push(user);
    write(users, "users.json");
    res.send({user});
});

/**
 * GET Request Get the saved games by userId
 */
app.get('/api/boards/:email', (req, res) => {

    let boards = [];

    if (fs.existsSync("boards.json")) {
        boards = read("boards.json");
    }

    if (boards === null || boards === undefined || boards.length <= 0) { // 404 object not found
        res.send(null);
    } else {
        const user = boards.find((u) => u.userId === req.params.email);

        res.send(user.games);
    }
});

/**
 * POST Request Save a game to the save file
 */
app.post('/api/boards', (req, res) => {
    let boards = [];
    let board = req.body;

    let userId = board.userId;
    let gameId = board.gameId;
    let userExists = true;

    if (fs.existsSync("boards.json")) {
        boards = read("boards.json");
    }

    // Check if the user id exists
    let user = boards.find((b) => b.userId === userId);
    if (!user) {
        userExists = false;
        user = {
            userId: userId,
            games: []
        }
    }

    // Check if the game id exists
    let game = user.games.find((g) => g.gameId === gameId);

    if (!game) {
        let data = {
            gameId: gameId,
            player1: board.player1,
            player2: board.player2,
            gameTime: board.gameTime,
            gameDate: board.gameDate,
            boardState: board.boardState
        }
        user.games.push(data);
    } else {
        game.boardState = board.boardState;
        game.gameTime = board.gameTime;
        game.gameDate = board.gameDate;
    }

    if (!userExists) {
        boards.push(user);
    }
    write(boards, "boards.json");
    res.send({board});
});

/**
 * POST Request Save a completed chess game to the save file
 */
app.post('/api/scores', (req, res) => {
    let scoreboard = [];
    let score = req.body;

    if (fs.existsSync("scoreboard.json")) {
        scoreboard = read("scoreboard.json");
    }

    scoreboard.push(score);
    write(scoreboard, "scoreboard.json");
    res.send({score});
});

/**
 * GET Request Get a list of scores from the save file
 */
app.get('/api/scores', (req, res) => {
    let scoreboard = [];

    if (fs.existsSync("scoreboard.json")) {
        scoreboard = read("scoreboard.json");
    }
    
    if (scoreboard === null || scoreboard === undefined || scoreboard.length <= 0) { // 404 object not found
        res.send(null);
    } else {
        res.send(scoreboard);
    }
});

/**
 * Read the save file to get the list
 * of users and saved notes
 * @return {*} The list of users and their notes
 */
const read = (file) => {
    try {
      const data = fs.readFileSync(file, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error(err);
    }
  };
  
/**
 * Overwrite the existing save file, or create a
 * new save file if it does not exists with the save data
 * @param {*} notes The user and their notes to save to the save file.
 */
const write = (notes, file) => {
    fs.writeFile(file, JSON.stringify(notes), function(err) {
        if (err) throw err;
    });
};

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}\nThe Server is running`)
});