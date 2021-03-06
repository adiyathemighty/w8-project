import React, { Component } from "react";
import { withRouter } from "react-router";
import EditIcon from "../../assets/edit.svg";

import api from "../utils/api";

class CardShowAndCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      new: false,
      title: "",
      blocker: false,
      ticketType: "",
      id: null,
      description: "",
      estimation: 0,
      ticketType: "",
      titleInputFieldShown: false,
      estimationInputFieldShown: false,
      ticketTypeInputFieldShown: false,
      descriptionTypeInputFieldShown: false,
      oneFieldShown: false,
      errorMessage: ""
    };
  }

  render() {
    return (
      <div
        className="modal"
        onClick={event => this.handleModalQuitClick(event)}
      >
        <div className="card-details">
          {/* Here come the editable fields made with RIE */}
          <div className="editable-fields">
            <div className="row row-one">
              <label htmlFor="title">Title</label>
              {this.state.titleInputFieldShown ||
              !this.state.title ||
              this.state.new ? (
                <input
                  className="active-input input"
                  required
                  type="text"
                  id="title"
                  onChange={e =>
                    this.handleInputChange("title", e.target.value)
                  }
                  value={this.state.title}
                />
              ) : (
                <p
                  className="input"
                  onClick={() => {
                    this.toggleInputField("title");
                  }}
                >
                  {this.state.title}
                </p>
              )}
            </div>

            <div className="row row-two">
              <div className="row-column">
                <label htmlFor="ticketType">Issue type:</label>

                {this.state.ticketTypeInputFieldShown ||
                !this.state.ticketType ||
                this.state.new ? (
                  <select
                    className="active-input select"
                    onChange={e =>
                      this.handleInputChange("ticketType", e.target.value)
                    }
                    name="ticketType"
                    id="ticketType"
                  >
                    <option
                      className="active-input option"
                      value=""
                      selected
                      disabled
                      hidden
                    >
                      {this.state.ticketType
                        ? this.state.ticketType
                        : "User Story"}
                    </option>
                    <option className="active-input option" value="User Story">
                      User Story
                    </option>
                    <option className="active-input option" value="Bug">
                      Bug
                    </option>
                    <option className="active-input option" value="Action Item">
                      Action Item
                    </option>
                  </select>
                ) : (
                  <p
                    onClick={() => {
                      this.toggleInputField("ticketType");
                    }}
                  >
                    {this.state.ticketType}
                  </p>
                )}
              </div>

              <div className="row-column">
                <label htmlFor="estimation">Estimation</label>

                {this.state.estimationInputFieldShown ||
                !this.state.estimation ||
                this.state.new ? (
                  <input
                    className="active-input input"
                    onChange={e =>
                      this.handleInputChange("estimation", e.target.value)
                    }
                    type="number"
                    min="0"
                    id="estimation"
                    value={this.state.estimation}
                  />
                ) : (
                  <p
                    onClick={() => {
                      this.toggleInputField("estimation");
                    }}
                  >
                    {this.state.estimation}
                  </p>
                )}
              </div>
            </div>

            <div className="row row-three">
              <label htmlFor="description">Description</label>

              {this.state.descriptionInputFieldShown ||
              !this.state.description ||
              this.state.new ? (
                <textarea
                  className="active-input textarea"
                  onChange={e =>
                    this.handleInputChange("description", e.target.value)
                  }
                  value={this.state.description}
                  id="description"
                />
              ) : (
                <p
                  className=" textarea"
                  onClick={() => {
                    this.toggleInputField("description");
                  }}
                >
                  {this.state.description}
                </p>
              )}
            </div>
            {/* action handlers for cancel and submit */}
          </div>
          {this.state.errorMessage}
          <div className="action-btns">
            <button
              onClick={this.handleInputSubmit}
              className="text-btn   btn-md confirm"
            >
              {/* so that the user is not confused and I don't want to use any too generic button text */}
              {this.state.new ? "Create Issue" : "Save changes"}
            </button>
            <button
              className="text-btn marg-left-md btn-md cancel"
              onClick={() => {
                this.props.history.push(
                  `/b/${this.props.match.params.boardId}`
                );
              }}
            >
              Back to board
            </button>
          </div>
        </div>
      </div>
    );
  }

  toggleInputField = type => {
    const field = `${type}InputFieldShown`;
    this.setState((prevState, props) => {
      return { [field]: !prevState[field], oneFieldShown: true };
    });
  };

  componentDidMount = () => {
    if (this.props.match.path.indexOf("new") > 0) {
      this.setState((prevState, props) => {
        return { new: true, title: "" };
      });
    }
    const ticketId = this.props.match.params.ticketId;
    api.get(`/api/t/show/${ticketId}`).then(ticket => {
      const {
        title,
        blocker,
        ticketType,
        description,
        _id,
        estimation
      } = ticket;

      const newState = {
        id: _id,
        title,
        blocker,
        ticketType,
        description,
        estimation
      };

      this.setState((prevState, props) => {
        return newState;
      });
    });
  };

  handleModalQuitClick = e => {
    if (e.target.className === "modal") {
      this.props.history.push(`/b/${this.props.match.params.boardId}`);
    }
  };

  handleInputChange = (key, value) => {
    this.setState((prevState, props) => {
      return { [key]: value };
    });
  };

  handleInputSubmit = () => {
    const { title, ticketType, estimation, description } = this.state;

    const submitableFields = {};
    if (title) {
      submitableFields["title"] = title;
    }
    if (ticketType) {
      submitableFields["ticketType"] = ticketType;
    }
    if (estimation) {
      submitableFields["estimation"] = Number(estimation);
    }
    if (description) {
      submitableFields["description"] = description;
    }
    submitableFields["boardId"] = this.props.match.params.boardId;

    if (!this.state.new) {
      api
        .post(`/api/t/update/${this.state.id}`, submitableFields)
        .then(result => {
          console.log(result);
          this.props.ticketDetailViewOpenHandler();
          this.props.getBoardData();
          this.props.history.push(`/b/${this.props.match.params.boardId}`);
        });
    } else {
      api.post(`/api/t/new`, submitableFields).then(result => {
        if (result.error) {
          console.log("error!", result);
          this.setState({
            errorMessage: "Please create at least one column first"
          });
        } else {
          this.props.getBoardData();
          this.props.history.push(`/b/${this.props.match.params.boardId}`);
        }
      });
    }
  };
}

export default withRouter(CardShowAndCreate);
