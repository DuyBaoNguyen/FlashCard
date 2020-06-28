import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';
import uploadImageIcon from '@iconify/icons-uil/image-upload';
import deleteImageIcon from '@iconify/icons-uil/image-slash';

import CardFrontForm from '../../../components/User/CardFrontForm/CardFrontForm';
import CardBackForm from '../../../components/User/CardBackForm/CardBackForm';
import withErrorHandler from '../../../hoc/withErrorHandler';
import Back from '../../../components/User/Back/Back';
import DropDown from '../../../components/Shared/DropDown/DropDown';
import DropDownItem from '../../../components/Shared/DropDownItem/DropDownItem';
import Button from '../../../components/Shared/Button/Button';
import * as actions from '../../../store/actions';
import './EditCard.css';

class EditCard extends Component {
  constructor(props) {
    super(props);
    this.uploadImageInput = React.createRef();
  }

  UNSAFE_componentWillMount() {
    this.backUrl = this.props.location.state?.backUrl || '/';
  }

  componentDidMount() {
    this.cardId = this.props.match.params.cardId;
    this.props.onGetCard(this.cardId);
  }

  componentWillUnmount() {
    if (this.props.card.backs.length === 0) {
      this.props.onDeleteCard(this.props.card.id);
    }
    this.props.onResetStateInCardReducer();
  }

  handleEditFront = () => {
    this.props.onToggleCardFrontForm(true);
  }

  handleCloseCardFrontForm = () => {
    this.props.onToggleCardFrontForm(false);
    this.props.onClearUpdateFrontError();
  }

  handleEditBack = (backId) => {
    this.props.onSelectBack(backId);
    this.props.onToggleCardBackForm(true);
  }

  handleCloseCardBackForm = () => {
    this.props.onUnselectBack();
    this.props.onToggleCardBackForm(false);
    this.props.onClearUpdateBackError();
  }

  handleDeleteCard = () => {
    this.props.onDeleteCard(this.props.card.id);
  }

  handleDeleteBack = (backId) => {
    this.props.onDeleteBack(this.props.card.id, backId);
  }

  handleDeleteImage = (backId) => {
    this.props.onDeleteImage(this.props.card.id, backId);
  }

  handleAddBack = () => {
    this.props.onToggleCardBackForm(true);
  }

  handleUploadImage = (backId) => {
    this.props.onSelectBack(backId);
    this.uploadImageInput.current.click();
  }

  handleImageChange = (event) => {
    if (event.target.files.length > 0) {
      const { card, selectedBack, onUpdateImage } = this.props;
      onUpdateImage(card.id, selectedBack.id, event.target.files[0]);
    }
  }

  render() {
    const { card, cardFrontFormOpened, selectedBack, cardBackFormOpened } = this.props;

    return (
      <div className="edit-card">
        {/* <Prompt
          when={card?.backs.length === 0}
          message="Card must have at least a back!"
           /> */}
        <div className="back-feature">
          <Link to={this.backUrl || '/cards'}>
            Back
          </Link>
        </div>
        <div className="card-front">
          <div className="front-wrapper">
            <DropDown
              rightSide
              label={(
                <span className="front" onClick={this.handleEditFront}>
                  {card?.front}
                </span>
              )}
              mouseEnterToOpen
              mouseLeaveToClose
              className="options-dropdown">
              <DropDownItem
                type="button"
                icon={<Icon icon={editIcon} color="#535353" />}
                label="Edit front"
                onClick={this.handleEditFront} />
              <DropDownItem
                className="delete-card-btn"
                type="button"
                icon={<Icon icon={deleteIcon} color="red" />}
                label="Delete card"
                onClick={this.handleDeleteCard} />
            </DropDown>
          </div>
        </div>
        <div className="card-back">
          {card?.backs && card.backs.map(back => {
            return (
              <div className="back-wrapper" key={back.id}>
                <DropDown
                  leftSide
                  label={(
                    <div className="back-content" onClick={() => this.handleEditBack(back.id)}>
                      <Back key={back.id} back={back} />
                    </div>
                  )}
                  mouseEnterToOpen
                  mouseLeaveToClose
                  className="options-dropdown">
                  <DropDownItem
                    type="button"
                    icon={<Icon icon={editIcon} color="#535353" />}
                    label="Edit back"
                    onClick={() => this.handleEditBack(back.id)} />
                  <DropDownItem
                    className="delete-back-btn"
                    type="button"
                    icon={<Icon icon={deleteIcon} color="red" />}
                    label="Delete back"
                    onClick={() => this.handleDeleteBack(back.id)} />
                  <DropDownItem type="line" />
                  <DropDownItem
                    type="button"
                    icon={<Icon icon={uploadImageIcon} color="#535353" />}
                    label={back.imageUrl ? "Change image" : "Upload Image"}
                    onClick={() => this.handleUploadImage(back.id)} />
                  {back.imageUrl && (
                    <DropDownItem
                      type="button"
                      icon={<Icon icon={deleteImageIcon} color="#535353" />}
                      label="Delete image"
                      onClick={() => this.handleDeleteImage(back.id)} />
                  )}
                </DropDown>
              </div>
            );
          })}
          <input
            type="file"
            id="upload-image-input"
            ref={this.uploadImageInput}
            onChange={this.handleImageChange} />
          {card?.backs.length < 2 && (
            <Button
              type="button"
              className="add-back-btn"
              onClick={this.handleAddBack}>
              Add fact
            </Button>
          )}
        </div>
        <CardFrontForm
          card={card}
          isOpen={cardFrontFormOpened}
          onClose={this.handleCloseCardFrontForm} />
        <CardBackForm
          card={card}
          back={selectedBack}
          isOpen={cardBackFormOpened}
          onClose={this.handleCloseCardBackForm} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    card: state.card.card,
    cardFrontFormOpened: state.card.cardFrontFormOpened,
    selectedBack: state.card.selectedBack,
    cardBackFormOpened: state.card.cardBackFormOpened
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetCard: (cardId) => dispatch(actions.getCard(cardId)),
    onDeleteCard: (cardId) => dispatch(actions.deleteCard(cardId)),
    onDeleteBack: (cardId, backId) => dispatch(actions.deleteBack(cardId, backId)),
    onDeleteImage: (cardId, backId) => dispatch(actions.deleteImage(cardId, backId)),
    onUpdateImage: (cardId, backId, image) => dispatch(actions.updateImage(cardId, backId, image)),
    onToggleCardFrontForm: (opened) => dispatch(actions.toggleCardFrontForm(opened)),
    onToggleCardBackForm: (opened) => dispatch(actions.toggleCardBackForm(opened)),
    onClearUpdateFrontError: () => dispatch(actions.clearUpdateFrontError()),
    onClearUpdateBackError: () => dispatch(actions.clearUpdateBackError()),
    onSelectBack: (backId) => dispatch(actions.selectBack(backId)),
    onUnselectBack: () => dispatch(actions.unselectBack()),
    onResetStateInCardReducer: () => dispatch(actions.resetStateInCardReducer())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(EditCard));