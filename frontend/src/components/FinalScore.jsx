// Paliwanag kung paano gumagana ang FinalScore component:
// - Tinatanggap nito ang mga sumusunod na props:
//   * score - ang final score ng player sa quiz
//   * playerName - ang pangalan ng player
//   * leaderboard - array ng top scores na naitala
//   * onRestart - function para magsimula ulit ng bagong quiz
//   * onShare - function para i-share ang score sa iba
//
// - Nagpapakita ito ng:
//   * "Quiz Completed!" message at final score ng player
//   * Leaderboard na may listahan ng top scores
//   * Dalawang button:
//     - Share Score button para i-share ang score
//     - Restart Quiz button para maglaro ulit
//
// - May accessibility features para sa screen readers:
//   * aria-label sa mga button para malinaw ang function

import PropTypes from "prop-types";

const FinalScore = ({ score, playerName, leaderboard, onRestart, onShare }) => {
  return (
    <div className="final-score">
      <h2>Quiz Completed!</h2>
      <p className="player-name">Well done, {playerName}!</p>
      <p className="score-text">Your final score: {score}</p>

      <div className="leaderboard">
        <h3>Top Scores</h3>
        {leaderboard.map((entry, index) => (
          <div key={index} className="leaderboard-item">
            #{index + 1}: {entry.name} - {entry.score} points
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button
          onClick={onShare}
          className="share-button"
          aria-label="Share score"
        >
          Share Score
        </button>
        <button
          onClick={onRestart}
          className="restart-button"
          aria-label="Restart quiz"
        >
          Restart Quiz
        </button>
      </div>
    </div>
  );
};

FinalScore.propTypes = {
  score: PropTypes.number.isRequired,
  playerName: PropTypes.string.isRequired,
  leaderboard: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
    })
  ).isRequired,
  onRestart: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
};

export default FinalScore;
