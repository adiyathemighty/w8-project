import React, { Component } from "react";
import Card from "../Card";
import DeleteColumnDialog from "./DeleteColumnDialog";
import ArrowLeft from "../../assets/arrLeft.svg";
import PlusIcon from "../../assets/plus.svg";
import ArrowRight from "../../assets/arrRight.svg";
import { Droppable } from "react-beautiful-dnd";
import { RIEInput } from "riek";
import api from "../utils/api";
import DeleteIcon from "../../assets/trash.svg";
import { withRouter } from "react-router";

import Modal from "../Component/Modal";

class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: "",
      deleteModalOpen: false
    };
  }

  openModal = type => {
    this.setState((prevState, props) => {
      const newStatus = {};
      newStatus[`${type}ModalOpen`] = !prevState[`${type}ModalOpen`];
      return newStatus;
    });
  };

  handleInputChange = field => {
    field.limit = Number(field.limit);
    api
      .post("/api/c/update", { id: this.props.id, limit: field.limit })
      .then(() => {
        this.props.getBoardData();
      });
  };

  render() {
    const { title, tickets, id, boardId, columns } = this.props;

    const ticketsList = tickets.map((ticket, ind) => {
      return (
        <Card
          ticketDetailViewOpenHandler={this.props.ticketDetailViewOpenHandler}
          key={ind}
          index={ind}
          ticket={ticket}
        />
      );
    });

    return (
      <div className="column">
        {/* column header with title and delete button */}
        <div className="column-header">
          <div className="limit">
            <label htmlFor="">Column limit: </label>
            <RIEInput
              className="limit"
              value={this.state.limit}
              change={this.handleInputChange}
              propName="limit"
            />
          </div>

          {this.props.first ? null : (
            <button
              onClick={() =>
                this.props.columnMoveHandler("left", this.props.ind)
              }
              className="icon-button"
            >
              <img className="icon" src={ArrowLeft} alt="" />
            </button>
          )}
          <p className="column-title">{title}</p>
          <p>
            {this.props.limit
              ? `${this.props.tickets.length}/${this.props.limit}`
              : null}
          </p>

          <button
            onClick={() => {
              this.openModal("delete");
            }}
            className="icon-button "
          >
            <img className="icon" src={DeleteIcon} alt="" />
          </button>

          {this.state.deleteModalOpen ? (
            <DeleteColumnDialog
              sourceColumnId={id}
              columnHasTickets={tickets.length > 0 ? true : false}
              getBoardData={this.props.getBoardData}
              boardId={boardId}
              columns={columns}
              openModal={this.openModal}
            />
          ) : null}

          {this.props.last ? null : (
            <button
              onClick={() =>
                this.props.columnMoveHandler("right", this.props.ind)
              }
              className="icon-button"
            >
              <img className="icon" src={ArrowRight} alt="" />
            </button>
          )}
        </div>

        {/* this is necessary for the drag and drop to work so that after dnd we know which is the source and destination column. KEY IS IMPORTANT! DON'T DELETE, MOVE OR WHATEVER! OTHERWISE DRAG AND FUCKING DROP WILL NOT FUCKING MOVE! */}
        <Droppable key={id} droppableId={title}>
          {(provided, snapshot) => (
            <div
              className="column-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="column-tickets">
                {ticketsList}
                {/* the placeholder is there so that the space from which a card is dragged  doesn't collapse */}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

export default withRouter(Column);
