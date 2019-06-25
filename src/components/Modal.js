import React from "react";
import "../../style.css";
import "../../modalStyle.css";


export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    let visible = this.props.show ? "block" : "hide";
    this.state = { visible, showModal: false };
  }

  componentDidMount() {
    //this.setState({ visible: "block" });
  }

  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const { header, body } = this.props;
    return (
      <div
        id="myModal"
        className="modal"
        style={{ display: `${this.state.visible}` }}
      >
        {/*<!-- Modal content --> */}
        <div className="modal-content">
          <div className="modal-header" onClick={this.close}>
            <span onClick={this.close} className="close">
              &times;
            </span>
            <h2>{header}</h2>
          </div>
          <div className="modal-body">{body}</div>
        </div>
      </div>
    );
  }
}