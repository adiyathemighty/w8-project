import React, { Component } from "react";
import api from "../utils/api";
import Tooltip from "../Component/Tooltip";

class ColumnCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnTitle: ""
    };
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput = (key, value) => {
    this.setState((prevState, props) => {
      return { [key]: value };
    });
  };

  handleEnter = e => {
    if (e.key === "Enter") {
      this.handleSubmit();
    }
  };

  handleSubmit = e => {
    api
      .post("/api/c/new", {
        boardId: this.props.boardId,
        columnTitle: this.state.columnTitle
      })
      .then(result => {
        this.setState((prevState, props) => {
          return { columnTitle: "" };
        });
        this.props.getBoardData();
      });
  };

  render() {
    const createColumnBtn = (
      <button
        disabled={this.state.columnTitle.length === 0}
        type="submit"
        className="confirm btn-md icon-text-btn"
        onClick={e => this.handleSubmit(e)}
      >
        {/* this span is needed for the tooltip to work on hover */}
        <span>Create new column</span>
      </button>
    );
    return (
      <div className="column">
        <div className="new">
          <input
            value={this.state.columnTitle}
            onChange={event =>
              this.handleInput("columnTitle", event.target.value)
            }
            placeholder="New column name"
            className="create-input"
            type="text"
            onKeyPress={e => this.handleEnter(e)}
          />

          {this.state.columnTitle.length === 0 ? (
            <Tooltip
              tooltipText="Title is required"
              element={createColumnBtn}
            />
          ) : (
            createColumnBtn
          )}
        </div>
      </div>
    );
  }
}

export default ColumnCreate;
