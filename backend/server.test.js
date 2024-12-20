import { describe, it, expect } from "vitest";
import { getUserEmail, verifyUser, getBoards, getScores } from "./server.js";

describe('Test of getUserEmail function', () => {
    it('User should not exist', () => {
        expect(getUserEmail("./test/users_test.json", "test12@gmail.com")).toBe(null);
    })

    it('User should exist', () => {
        expect(getUserEmail("./test/users_test.json", "test@gmail.com")).toBe("test@gmail.com");
    })
});

describe('Test of verifyUser function', () => {
    it('Verify that the email and password does not match', () => {
        expect(verifyUser("./test/users_test.json", "test@gmail.com", "12")).toBe(null);
    })

    it('Verify that the email and password matches', () => {
        expect(verifyUser("./test/users_test.json", "test@gmail.com", "123")).toBe("test@gmail.com");
    })
});

describe('Test of getBoards function', () => {
    it('Verify that the board does not exist', () => {
        expect(getBoards("./test/boards_test.json", "test12@gmail.com")).toBe(null);
    })

    it('Verify that the board exist', () => {
        expect(getBoards("./test/boards_test.json", "test@gmail.com")[0].gameId).toBe("Game 1");
    })
});

describe('Test of getBoards function', () => {
    it('Verify that the score does not exist', () => {
        expect(getScores("./test/scores_empty.json", "test12@gmail.com")).toBe(null);
    })

    it('Verify that the score exist', () => {
        expect(getScores("./test/scores_test.json", "test12@gmail.com").length).toBe(5);
    })
});
