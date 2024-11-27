'use strict';

const express  = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');

app.use(express.json());
app.use(cors());

const USERS_FILE = "users.json";
const BOARDS_FILE = "boards.json";
const SCOREBOARD_FILE = "scoreboard.json";

/**
 * GET Request to check if the server is running
 */
app.get('/', (req, res) => {
    res.status(200).send('The server is running');
});

/**
 * Get the user ID using the email
 * @param {*} filename name of the file to read
 * @param {*} userId the email of the user
 * @returns the email of the user otherwise null if it does not exist
 */
function getUserEmail(filename, userId) {
    let users = [];

    if (fs.existsSync(filename)) {
        users = read(filename);
    }

    if (users === null || users === undefined || users.length <= 0) { // 404 object not found
        return null;
    } else {
        const user = users.find((u) => u.email === userId);

        if (!user) { // 404 object not found
            return null;
        } else {
            return user.email;
        }
    }
}

/**
 * Verify the user using the email and check if the password matches the user input
 * @param {*} filename name of the file to read
 * @param {*} email the email of the user
 * @param {*} password the password of the user
 * @returns the email of the user otherwise null if it does not exist
 */
function verifyUser(filename, email, password) {
    let users = [];

    if (fs.existsSync(filename)) {
        users = read(filename);
    }

    if (users === null || users === undefined || users.length <= 0) { // 404 object not found
        return null;
    } else {
        const user = users.find((u) => u.email === email);

        if (!user || password != user.password) { // 404 object not found
            console.log("User does not exist");
            return null;
        } else {
            console.log("User exists");
            return user.email;
        }
    }
}

/**
 * Add a user to the save file
 * @param {*} filename name of the file to write
 * @param {*} user the user to add to the save file
 * @returns the user that was added to the save file
 */
function addUser(filename, user) {
    let users = [];

    if (fs.existsSync(filename)) {
        users = read(filename);
    }

    users.push(user);
    write(users, filename);
    return user;
}

/**
 * Get the list of saved games by the user id
 * @param {*} filename the name of the file to read
 * @param {*} userId the email of the user
 * @returns the list of saved games by the user id otherwise null if it does not exist
 */
function getBoards(filename, userId) {
    let boards = [];

    if (fs.existsSync(filename)) {
        boards = read(filename);
    }

    if (boards === null || boards === undefined || boards.length <= 0) { // 404 object not found
        return null;

    } else {
        if (boards.find((u) => u.userId === userId)) {
            const user = boards.find((u) => u.userId === userId);
            return user.games;
        } else {
            return null;
        }
    }
}

/**
 * Add a board to the save file
 * @param {*} filename the name of the file to write
 * @param {*} board the board to add to the save file
 * @returns the board that was added to the save file
 */
function addBoard(filename, board) {
    let boards = [];

    let userId = board.userId;
    let gameId = board.gameId;
    let userExists = true;

    if (fs.existsSync(filename)) {
        boards = read(filename);
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
    return board;
}

/**
 * Delete a saved game from the save file
 * @param {*} filename the name of the file to update
 * @param {*} board the board to add to the save file
 */
function deleteBoard(filename, userId, gameId) {
    let boards = [];

    if (fs.existsSync(filename)) {
        boards = read(filename);
    }

    // Check if the user id exists
    let user = boards.find((b) => b.userId === userId);

    if (user) {
        // Delete the game by index
        let index = user.games.findIndex((g) => g.gameId === gameId);
        user.games.splice(index, 1);
        write(boards, "boards.json");
    }
}

/**
 * Add a score to the save file
 * @param {*} filename the name of the file to write
 * @param {*} score the score to add to the save file
 * @returns the score that was added to the save file
 */
function addScore(filename, score) {
    let scoreboard = [];

    if (fs.existsSync(filename)) {
        scoreboard = read(filename);
    }

    scoreboard.push(score);
    write(scoreboard, filename);
    return score;
}

/**
 * Get the list of scores from the save file
 * @param {*} filename the name of the file to read
 * @returns the list of scores otherwise null if it does not exist
 */
function getScores(filename) {
    let scoreboard = [];

    if (fs.existsSync(filename)) {
        scoreboard = read(filename);
    }
    
    if (scoreboard === null || scoreboard === undefined || scoreboard.length <= 0) { // 404 object not found
        return null;
    } else {
        return scoreboard;
    }
}

/**
 * GET Request Get the user by the email
 */
app.get('/api/users/:email', (req, res) => {
    res.send(getUserEmail(USERS_FILE, req.params.email));
});

/**
 * GET Request Get the user by the email
 */
app.get('/api/verify_user/:email/:password', (req, res) => {
    res.send(verifyUser(USERS_FILE, req.params.email, req.params.password));
});

/**
 * POST Request Save a user to the save file
 */
app.post('/api/users', (req, res) => {
    const result = addUser(USERS_FILE, req.body);
    res.send({result});
});

/**
 * GET Request Get the saved games by userId
 */
app.get('/api/boards/:email', (req, res) => {
    res.send(getBoards(BOARDS_FILE, req.params.email));
});

/**
 * POST Request Save a game to the save file
 */
app.post('/api/boards', (req, res) => {
    const result = addBoard(BOARDS_FILE, req.body);
    res.send({result});
});

app.delete('/api/boards', (req, res) => {
    deleteBoard(BOARDS_FILE, req.body.email, req.body.gameId);
    console.log(req.body.email);
    console.log(req.body.gameId);
    res.sendStatus(200);
});

/**
 * POST Request Save a completed chess game to the save file
 */
app.post('/api/scores', (req, res) => {
    const result = addScore(SCOREBOARD_FILE, req.body);
    res.send({result});
});

/**
 * GET Request Get a list of scores from the save file
 */
app.get('/api/scores', (req, res) => {
    res.send(getScores(SCOREBOARD_FILE));
});

/**
 * Read the save file to get the list
 * of users and saved notes
 * @return {*} The list of users and their notes
 */
function read(file) {
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
function write(notes, file) {
    fs.writeFile(file, JSON.stringify(notes), function(err) {
        if (err) throw err;
    });
};

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}\nThe Server is running`)
});

// export { getUserEmail, verifyUser, getBoards, getScores };
