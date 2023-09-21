const express = require("express");
const mysql = require("mysql");
const path = require("path");

const app = express();
const port = 3000;

const staticFilesPath = path.join(__dirname);

app.use(express.static(staticFilesPath));
app.use(express.json());
app.use("/newquiz2", express.static(path.join(__dirname, "newquiz2")));
const dbConfig = {
    host: "localhost",
    user: "haidaradmin",
    password: "Haidarganteng",
    database: "dbquiz",
    port: 3306,
};
app.use(express.static(path.join(__dirname, "newquiz2")));
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to the database");
    }
});
app.get("/styles.css", (req, res) => {
    res.setHeader("Content-Type", "text/css");
    res.sendFile(path.join(__dirname, "quiz", "styles.css"));
});
app.get("/bekgron.jpg", (req, res) => {
    res.sendFile(path.join(__dirname, "quiz", "bekgron.jpg"));
});
app.get("/", (req, res) => {
    res.sendFile(path.join(staticFilesPath, "/index.html"));
});
app.get("/quiz/quiz.html", (req, res) => {
    res.sendFile(__dirname + "/newquiz2");
});
app.get("/quiz", (req, res) => {
    res.sendFile(__dirname + "/quiz/quiz.html");
});
app.get("/quiz", (req, res) => {
    res.sendFile(__dirname + "/exit-page.html");
});
app.get("/quiz", (req, res) => {
    res.sendFile(__dirname + "/newquiz2/quiz/quiz.html");
});
app.get("/quiz", (req, res) => {
    res.sendFile(__dirname + "/newquiz2/leaderboard.html");
});
app.get("/newquiz2", (req, res) => {
    res.sendFile(__dirname + "/quiz");
});
app.get("/quiz.html", (req, res) => {
    res.sendFile(path.join(staticFilesPath, "quiz", "quiz.html"));
});

app.post("/api/register", (req, res) => {
    const { userName } = req.body;

    connection.query("INSERT INTO users (username, score) VALUES (?, 0) ON DUPLICATE KEY UPDATE score = score", [userName], (err, result) => {
        if (err) {
            console.error("Error registering/updating user:", err);
            res.status(500).json({ success: false });
        } else {
            console.log("User registered/updated successfully");
            res.json({ success: true });
        }
    });
});

app.get("/api/check-username/:username", (req, res) => {
    const username = req.params.username;

    connection.query("SELECT COUNT(*) AS count FROM users WHERE username = ?", [username], (err, result) => {
        if (err) {
            console.error("Error checking username:", err);
            res.status(500).json({ error: "Error checking username" });
        } else {
            const count = result[0].count;
            res.json({ exists: count > 0 });
        }
    });
});




app.post("/api/submit-score", (req, res) => {
    const { userName, score } = req.body;

    connection.query("UPDATE users SET score = ? WHERE username = ?", [score, userName], (err, result) => {
        if (err) {
            console.error("Error updating score:", err);
            res.status(500).json({ success: false });
        } else {
            console.log("Score updated successfully");
            res.json({ success: true });
        }
    });
});


app.get("/api/question/:id", (req, res) => {
    const currentQuestionId = req.params.id;

    connection.query("SELECT * FROM questions WHERE id = ?", [currentQuestionId], (err, result) => {
        if (err) {
            console.error("Error fetching question:", err);
            res.status(500).json({ error: "Error fetching question" });
        } else {
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ error: "Question not found" });
            }
        }
    });
});

app.get("/api/leaderboard", (req, res) => {
    connection.query("SELECT username, score FROM users ORDER BY score DESC", (err, result) => {
        if (err) {
            console.error("Error fetching leaderboard data:", err);
            res.status(500).json({ error: "Error fetching leaderboard data" });
        } else {
            res.json(result);
        }
    });
});
app.get("/newquiz2/quiz.html", (req, res) => {
    res.sendFile(path.join(__dirname, "newquiz2", "quiz", "quiz.html"));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

