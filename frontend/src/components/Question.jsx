// Paliwanag kung paano gumagana ang Question component:
// - Tinatanggap nito ang mga sumusunod na props:
//   * question - ang tanong na ipapakita
//   * options - array ng mga posibleng sagot
//   * hint - clue para sa tamang sagot
//   * showHint - boolean kung ipapakita ba ang hint
//   * onShowHint - function para ipakita ang hint
//   * onAnswer - function na tatawagin kapag pumili ng sagot
//   * disabled - boolean kung pwede bang pumili ng sagot
//
// - Nagpapakita ito ng:
//   * Tanong sa h2 heading
//   * Hint button o hint text depende sa showHint value
//   * Grid ng mga option buttons na pwedeng piliin
//
// - May accessibility features para sa screen readers:
//   * role="alert" sa hint para ipaalam na may bagong info
//   * aria-label sa mga button para malinaw ang function

import PropTypes from "prop-types";

const Question = ({
  question,
  options,
  hint,
  showHint,
  onShowHint,
  onAnswer,
  disabled,
}) => {
  return (
    <div className="question-container">
      <h2>{question}</h2>

      {showHint ? (
        <div className="hint" role="alert">
          {hint}
        </div>
      ) : (
        <button
          onClick={onShowHint}
          className="hint-button"
          aria-label="Show hint"
        >
          Show Hint
        </button>
      )}

      <div className="options-grid">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            disabled={disabled}
            className="option-button"
            aria-label={option}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

Question.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  hint: PropTypes.string.isRequired,
  showHint: PropTypes.bool.isRequired,
  onShowHint: PropTypes.func.isRequired,
  onAnswer: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default Question;
