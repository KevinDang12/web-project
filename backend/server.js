const express  = require('express');
const app = express();

app.get('/', (req, res) => {
    res.status(200).send('The server is running');
});

/**
 * GET Request to check if the user is authenticated
 */
// app.get('/api/user/profile', (req, res) => {
//     if (req.isAuthenticated()) {
//         // The user is authenticated, send the profile stored in the session
//         res.json(req.user);
//     } else {
//         // If the user is not authenticated, send an empty object or an error message
//         res.json(null);
//     }
// });

/**
 * GET Request when the user clicks the logout button
 */
// app.get('/logout', async (req, res) => {
//     req.logout((err) => {
//         if (err) {
//             console.error('Logout failed:', err);
//             return res.status(500).json({ message: 'Logout failed' });
//         }
//     });
//     res.redirect(`/signin`);
// });

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

/**
 * GET Request to get the game by id
 */
app.get('/api/games/:id', (req, res) => {
    const notes = read(GAME_FILE);
    // const user = notes.find((b) => b.id === req.params.id);

    // if (user === null || typeof user === 'undefined') { // 404 object not found
    //     res.status(404).send('The user with the given ID was not found.');
    // } else {
    //     user.title = decryptData(user.title, user.id);
    //     user.note = decryptData(user.note, user.id);
    //     res.send(user);
    // }
});

/**
 * GET Request Get the list of games
 */
app.get('/api/games', (req, res) => {
    const boards = read(MINESWEEPER_FILE);
    res.send(boards);
});

/**
 * POST Request Save a game to the save file
 */
app.post('/api/games', (req, res) => {
    let notes = [];
    let user = req.body;

    // if (fs.existsSync(NOTE_FILE)) {
    //     notes = read(NOTE_FILE);
    // }

    // user.title = encryptData(user.title, user.id);
    // user.note = encryptData(user.note, user.id);
    // notes.push(user);
    // write(notes, NOTE_FILE);
    // res.send(notes);
});

/**
 * PUT Request update the game by id
 */
app.put('/api/notes/:id', (req, res) => {
    const notes = read(NOTE_FILE);
    // const user = notes.find((b) => b.id === req.params.id);

    // if (!user) { // 404 object not found
    //     res.status(404).send('The board with the given ID was not found.');
    // } else {
    //     user.title = encryptData(req.body.title, user.id);
    //     user.note = encryptData(req.body.note, user.id);
    //     write(notes, NOTE_FILE);
    //     res.send(user);
    // }
});

/**
 * GET Request Get the list of scores from users
 */
app.get('/api/scores', (req, res) => {
    // const boards = read(MINESWEEPER_FILE);
    // res.send(boards);
});

/**
 * POST Request Save a score to the save file
 */
app.post('/api/scores', (req, res) => {
    let notes = [];
    let user = req.body;

    // if (fs.existsSync(NOTE_FILE)) {
    //     notes = read(NOTE_FILE);
    // }

    // user.title = encryptData(user.title, user.id);
    // user.note = encryptData(user.note, user.id);
    // notes.push(user);
    // write(notes, NOTE_FILE);
    // res.send(notes);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}\nThe Server is running`)
});