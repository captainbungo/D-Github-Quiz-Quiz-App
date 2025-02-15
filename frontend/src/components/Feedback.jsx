// Paliwanag kung paano gumagana ang Feedback component:
// - Tinatanggap nito ang isang prop na 'isCorrect' na boolean type
// - Nagpapakita ito ng feedback message sa user:
//   * Kapag tama ang sagot (isCorrect = true), magpapakita ng "Correct!"
//   * Kapag mali ang sagot (isCorrect = false), magpapakita ng "Incorrect!"
// - Gumagamit ng dynamic class para magbago ang style base sa sagot:
//   * May 'correct' class kapag tama
//   * May 'incorrect' class kapag mali
// - May accessibility features para sa screen readers:
//   * role="alert" para ipaalam na may bagong feedback
//   * aria-live="polite" para basahin ang feedback

import PropTypes from "prop-types";

const Feedback = ({ isCorrect }) => {
  return (
    <div
      className={`feedback ${isCorrect ? "correct" : "incorrect"}`}
      role="alert"
      aria-live="polite"
    >
      {isCorrect ? "Correct!" : "Incorrect!"}
    </div>
  );
};

Feedback.propTypes = {
  isCorrect: PropTypes.bool.isRequired,
};

export default Feedback;
