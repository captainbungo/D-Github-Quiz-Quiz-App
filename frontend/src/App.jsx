import { useState, useEffect } from "react";
import Question from "./components/Question";
import Feedback from "./components/Feedback";
import FinalScore from "./components/FinalScore";
import Timer from "./components/Timer";
import questions from "./data/questions";
import "./App.css";

const TIMER_DURATION = 20;
const BONUS_POINTS_THRESHOLD = 10;

// Paliwanag kung paano ginagamit ang useState at conditional rendering sa Quiz App:
// - Ang useState hooks ay ginagamit para mag-store ng data na nagbabago tulad ng
//   score, current question, at timer:
//   * const [currentQuestion, setCurrentQuestion] = useState(0) - para sa current question number
//   * const [score, setScore] = useState(0) - para sa score ng player
//   * const [timer, setTimer] = useState(TIMER_DURATION) - para sa countdown timer
//   * const [showFeedback, setShowFeedback] = useState(false) - para ipakita ang feedback
//   * const [quizCompleted, setQuizCompleted] = useState(false) - para malaman kung tapos na
//
// - Ang conditional rendering ay ginagamit para magpakita ng ibat-ibang components
//   base sa current state:
//   * if (quizCompleted) {
//       return <FinalScore ... />  - Kapag tapos na ang quiz
//     }
//   * return (
//       <div className="quiz-container">  - Kapag hindi pa tapos ang quiz
//         <Question ... />
//         {showFeedback && <Feedback ... />}  - Optional na feedback
//     )

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [showHint, setShowHint] = useState(false);
  const [leaderboard, setLeaderboard] = useState(() => {
    try {
      const saved = localStorage.getItem("quizLeaderboard");
      if (!saved) return [];

      const parsedData = JSON.parse(saved);

      // Validate the data structure
      if (!Array.isArray(parsedData)) return [];

      // Ensure each entry has the correct shape
      const validData = parsedData.filter(
        (entry) =>
          entry &&
          typeof entry === "object" &&
          typeof entry.name === "string" &&
          typeof entry.score === "number"
      );

      return validData;
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      // Clear invalid data from localStorage
      localStorage.removeItem("quizLeaderboard");
      return [];
    }
  });
  const [showWelcome, setShowWelcome] = useState(true);
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    let interval;
    if (!quizCompleted && !showFeedback) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            handleAnswer(-1);
            return TIMER_DURATION;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentQuestion, quizCompleted, showFeedback]);

  // Paliwanag kung paano gumagana ang handleAnswer function:
  // - Tinatanggap nito ang sagot ng user (selectedOption)
  // - Chincheck kung tama ang sagot sa pamamagitan ng pagkumpara sa tamang sagot
  // - Kapag tama, magdadagdag ng points:
  //   * 10 points para sa tamang sagot
  //   * +5 bonus points kung mabilis sumagot (timer > threshold)
  // - Pagkatapos ng 1.5 seconds:
  //   * Tatanggalin ang feedback at hint
  //   * Ire-reset ang timer
  //   * Kapag huling tanong na, tatapusin ang quiz
  //   * Kung hindi pa huling tanong, lilipat sa susunod
  const handleAnswer = (selectedOption) => {
    const currentQuestionData = questions[currentQuestion];
    if (!currentQuestionData) return;

    const correct = selectedOption === currentQuestionData.correct;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      const timeBonus = timer > BONUS_POINTS_THRESHOLD ? 5 : 0;
      setScore((prev) => prev + 10 + timeBonus);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setShowHint(false);
      setTimer(TIMER_DURATION);

      if (currentQuestion === questions.length - 1) {
        setQuizCompleted(true);
        updateLeaderboard(score);
      } else {
        setCurrentQuestion((prev) => prev + 1);
      }
    }, 1500);
  };

  // Paliwanag kung paano gumagana ang updateLeaderboard function:
  // - Tinatanggap nito ang final score ng user
  // - Ginagawa ang mga sumusunod:
  //   * Kinokopya ang kasalukuyang leaderboard at dinadagdag ang bagong score
  //   * Inaayos ang scores mula sa pinakamataas hanggang pinakamababa
  //   * Kinukuha lang ang top 5 scores
  //   * Sine-save ang bagong leaderboard sa localStorage para hindi mawala
  const updateLeaderboard = (finalScore) => {
    // Ensure we're working with the current score
    const currentScore = finalScore + (timer > BONUS_POINTS_THRESHOLD ? 5 : 0);

    const newEntry = {
      name: playerName,
      score: currentScore,
    };

    const newLeaderboard = [...leaderboard];
    const existingIndex = newLeaderboard.findIndex(
      (entry) => entry.name === playerName
    );

    if (existingIndex >= 0) {
      if (currentScore > newLeaderboard[existingIndex].score) {
        newLeaderboard[existingIndex] = newEntry;
      }
    } else {
      newLeaderboard.push(newEntry);
    }

    const updatedLeaderboard = newLeaderboard
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setLeaderboard(updatedLeaderboard);
    try {
      localStorage.setItem(
        "quizLeaderboard",
        JSON.stringify(updatedLeaderboard)
      );
    } catch (error) {
      console.error("Error saving leaderboard:", error);
    }
  };

  // Paliwanag kung paano gumagana ang handleRestart function:
  // - Ginagamit ito para i-reset ang quiz at magsimula ulit
  // - Ginagawa ang mga sumusunod:
  //   * Binabalik sa unang tanong (setCurrentQuestion(0))
  //   * Binabawi ang score (setScore(0))
  //   * Tinatanggal ang feedback at hint
  //   * Binabago ang quiz status para hindi na completed
  //   * Binabalik ang timer sa original na duration
  const handleRestart = () => {
    setShowWelcome(true);
    setPlayerName("");
    setCurrentQuestion(0);
    setScore(0);
    setShowFeedback(false);
    setQuizCompleted(false);
    setTimer(TIMER_DURATION);
    setShowHint(false);
  };

  // Paliwanag kung paano gumagana ang handleShare function:
  // - Ginagamit ito para i-share ang score ng user sa ibang tao
  // - Ginagawa ang mga sumusunod:
  //   * Gumagawa ng text message na may score ng user
  //   * Tinitingnan kung supported ang Web Share API sa browser
  //   * Kung supported, magpapakita ng share dialog na may title, text at URL
  //   * Kung hindi supported, magpapakita ng alert message
  const handleShare = () => {
    const text = `I scored ${score} points in the Quiz App!`;
    if (navigator.share) {
      navigator.share({
        title: "Quiz App Score",
        text: text,
        url: window.location.href,
      });
    } else {
      alert("Sharing is not supported on this browser");
    }
  };

  // Add new handler for starting the quiz
  const handleStartQuiz = (e) => {
    e.preventDefault();
    if (playerName.trim().length < 2) return;
    setShowWelcome(false);
  };  

  // Add welcome page conditional render
  if (showWelcome) {
    return (
      <div className="quiz-container welcome-screen">
        <h1>Quiz Whiz</h1>
        <form onSubmit={handleStartQuiz} className="welcome-form">
          <div className="input-group">
            <label htmlFor="playerName">Please enter your name:</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Type your name here"
              aria-label="Player name"
              className="name-input"
              minLength={2}
              required
            />
          </div>
          <button
            type="submit"
            className="action-button"
            aria-label="Start quiz"
          >
            Start Quiz
          </button>
        </form>
      </div>
    );
  }

  // Paliwanag kung paano gumagana ang main quiz interface:
  // - Nagpapakita ng container para sa quiz
  // - May Timer component na nagpapakita ng natitirang oras
  // - May score display na nagpapakita ng kasalukuyang puntos
  // - May Question component na naglalaman ng:
  //   * Ang tanong mismo
  //   * Mga pagpipilian para sa sagot
  //   * Hint feature na pwedeng ipakita
  //   * Mga event handlers para sa pagsagot at pagpakita ng hint
  //   * Disabled state kapag may feedback na nagpapakita
  // - May conditional na Feedback component na lumalabas kung
  //   may sagot na at nagpapakita kung tama o mali
  if (quizCompleted) {
    return (
      <FinalScore
        score={score}
        playerName={playerName}
        leaderboard={leaderboard}
        onRestart={handleRestart}
        onShare={handleShare}
      />
    );
  }

  // Add safety check for questions array
  if (!questions || !questions[currentQuestion]) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="quiz-container">
      <Timer timeLeft={timer} />
      <div className="score">Score: {score}</div>

      <Question
        question={questions[currentQuestion].question}
        options={questions[currentQuestion].options}
        hint={questions[currentQuestion].hint}
        showHint={showHint}
        onShowHint={() => setShowHint(true)}
        onAnswer={handleAnswer}
        disabled={showFeedback}
      />

      {showFeedback && <Feedback isCorrect={isCorrect} />}
    </div>
  );
};

export default App;
