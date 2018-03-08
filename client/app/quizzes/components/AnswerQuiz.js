/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../quizzical/elements/Modal';
import BackButton from '../../quizzical/elements/BackButton';
import { Quiz } from '../reducers/answerQuiz';
import style from './AnswerQuiz.scss';

type Props = {
  quiz?: Quiz,
  match: { params: { quizId: string } },
  fetchQuiz: (number) => void,
};

class AnswerQuiz extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);

    this.state = {
      userChoices: {},
      score: 0,
      showModal: false,
    };

    this.handleChoiceChanged = this.handleChoiceChanged.bind(this);
    this.handleFormSubmitted = this.handleFormSubmitted.bind(this);
    this.maxScore = this.maxScore.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidMount() {
    this.fetchQuiz();
  }

  fetchQuiz() {
    const { fetchQuiz, match } = this.props;

    fetchQuiz(parseInt(match.params.quizId, 10))
      .then(action => {
        const userChoices = {};
        action.quiz.questions.forEach(question => {
          userChoices[question.id] = null;
        });
        this.setState({ userChoices });

        return action;
      });
  }

  handleChoiceChanged(questionId, choiceId) {
    const userChoices = { ...this.state.userChoices, [questionId]: choiceId };

    this.setState({ userChoices });
  }

  handleFormSubmitted(e) {
    e.preventDefault();

    this.setState({
      score: this.getScore(this.props.quiz.questions, this.state.userChoices),
      showModal: true,
    });
  }

  getScore(questions, userChoices) {
    let score = 0;

    questions.forEach(question => {
      question.choices.forEach(choice => {
        if (choice.correct && userChoices[question.id] === choice.id) {
          score += 1;
        }
      });
    });

    return score;
  }

  maxScore() {
    return this.props.quiz
      && this.props.quiz.questions
      && this.props.quiz.questions.length;
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  modalFooterContent() {
    return (
      <span>
        <button
          type="button"
          className="button is-text is-wide"
          onClick={this.hideModal}
        >
          Try again
        </button>

        <Link className="button is-primary is-wide" to="/">
          Done
        </Link>
      </span>
    );
  }

  render() {
    // TODO: Refactor
    return (
      <div className="page--padding-top">
        <div className="container">

          <BackButton />

          <h1 className="title has-text-centered">{this.props.quiz.title}</h1>

          <form onSubmit={this.handleFormSubmitted}>
            {
              this.props.quiz && this.props.quiz.questions &&
              this.props.quiz.questions.map(question => (
                <div
                  className={`card ${style.question}`}
                  key={question.id}
                >
                  <h2 className="subtitle">{question.text}</h2>

                  {question.choices.map(choice => (
                    <p
                      key={choice.id}
                      className={`control ${style.choiceControl}`}
                    >
                      <input
                        type="radio"
                        id={`choice-${choice.id}`}
                        name={`question-${question.id}`}
                        value={choice.id}
                        onChange={() => this.handleChoiceChanged(question.id, choice.id)}
                        className={style.radio}
                      />
                      <label
                        htmlFor={`choice-${choice.id}`}
                        className="radio"
                      >
                        {choice.text}
                      </label>
                    </p>
                  ))}
                </div>
              ))
            }

            <div className="has-text-centered">
              <button
                type="submit"
                className="button is-primary  button--main-action"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        <Modal
          isActive={this.state.showModal}
          title="You have finished this quiz!"
          footerContent={this.modalFooterContent()}
        >
          <p className="subtitle is-size-1 is-marginless">
            {this.state.score} / {this.maxScore()}
          </p>
          <p>Correct</p>
        </Modal>

      </div>
    );
  }
}
AnswerQuiz.defaultProps = {
  quiz: null,
};

export default AnswerQuiz;

