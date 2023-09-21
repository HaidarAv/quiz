document.addEventListener("DOMContentLoaded", () => {
    const questionElement = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const resultElement = document.getElementById("result");
    const submitButton = document.getElementById("submit");
    const exitButton = document.getElementById("exit");
    const scoreElement = document.getElementById("score");

    let isFetching = false;
    let isAnswerChecked = true;
    let userScore = 0;
    let currentQuestionId = 1;

    if (!questionElement || !answerInput || !resultElement || !submitButton || !exitButton || !scoreElement) {
        console.error("Could not find required elements.");
        return;
    }

    submitButton.addEventListener("click", () => {
        if (isAnswerChecked) {
            const userAnswer = answerInput.value;
            checkAnswer(userAnswer);
        }
    });

    answerInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (isAnswerChecked) {
                submitButton.click();
            }
        }
    });

    exitButton.addEventListener("click", () => {
        // Update the user's score in the database and then redirect to the exit page
        updateScoreAndRedirect(userScore);
    });

    function fetchNextQuestion() {
        if (isFetching) return;
        isFetching = true;
    
        fetch(`/api/question/${currentQuestionId}`)
            .then(response => response.json())
            .then(question => {
                if (question && question.question_text) {
                    // Question available, display it
                    currentQuestionId++;
                    questionElement.textContent = question.question_text;
                    resultElement.textContent = "";
                    answerInput.value = "";
                    isFetching = false;
                    isAnswerChecked = true;
                } else {
                    // No more questions left, submit final score and redirect
                    updateScoreAndRedirect(userScore);
                }
            })
            .catch(error => {
                console.error("Error fetching next question:", error);
                isFetching = false;
            });
    }
    

function checkAnswer(userAnswer) {
    isAnswerChecked = false;
    fetch(`/api/question/${currentQuestionId - 1}`)
        .then(response => response.json())
        .then(question => {
            const correctAnswer = question.correct_answer;

            if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                resultElement.textContent = "Correct!";
                userScore++;
            } else {
                resultElement.textContent = `Incorrect. The correct answer is: ${correctAnswer}`;
                currentQuestionId++;
            }

            scoreElement.textContent = `Score: ${userScore}`;
            setTimeout(() => {
                resultElement.textContent = "";
                fetchNextQuestion();
            }, 2000); // Adjust the delay as needed
        })
        .catch(error => {
            console.error("Error fetching question:", error);
            isAnswerChecked = true;
        });
}

    function updateScoreAndRedirect(score) {
        const userName = getUserNameFromURL();
        const data = {
            userName: userName,
            score: score
        };

        fetch("/api/submit-score", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    console.log("Score updated successfully");
                    // Redirect to the exit page after updating the score
                    window.location.href = "/exit-page.html";
                } else {
                    console.error("Error updating score");
                }
            })
            .catch(error => {
                console.error("Error updating score:", error);
            });
    }

    function getUserNameFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("username");
    }

    fetchNextQuestion();
});