// Paliwanag kung paano gumagana ang Timer component:
// - Tinatanggap nito ang timeLeft prop na number type para sa natitirang oras
// - Nagpapakita ito ng div na may:
//   * "timer" class para sa styling
//   * role="timer" para sa accessibility
//   * aria-label na nagsasabi ng natitirang oras para sa screen readers
//   * Text na nagpapakita ng natitirang oras sa seconds
// - Ginagamit ito sa App component para ipakita ang countdown timer

import PropTypes from "prop-types";

const Timer = ({ timeLeft }) => {
  return (
    <div
      className="timer"
      role="timer"
      aria-label={`${timeLeft} seconds remaining`}
    >
      Time remaining: {timeLeft}s
    </div>
  );
};

Timer.propTypes = {
  timeLeft: PropTypes.number.isRequired,
};

export default Timer;
