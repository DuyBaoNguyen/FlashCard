import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Icon } from '@iconify/react';
import editIcon from '@iconify/icons-uil/edit';
import deleteIcon from '@iconify/icons-uil/trash-alt';
import uploadImageIcon from '@iconify/icons-uil/image-upload';
import deleteImageIcon from '@iconify/icons-uil/image-slash';
import backIcon from '@iconify/icons-uil/angle-left';

import CardFrontForm from '../../../components/User/CardFrontForm/CardFrontForm';
import CardBackForm from '../../../components/User/CardBackForm/CardBackForm';
import withErrorHandler from '../../../hoc/withErrorHandler';
import Back from '../../../components/User/Back/Back';
import DropDown from '../../../components/Shared/DropDown/DropDown';
import DropDownItem from '../../../components/Shared/DropDownItem/DropDownItem';
import Button from '../../../components/Shared/Button/Button';
import Confirm from '../../../components/Shared/Confirm/Confirm';
import * as actions from '../../../store/actions';
import './EditCard.css';

class EditCard extends Component {
  constructor(props) {
    super(props);
    this.uploadImageInput = React.createRef();
    this.state = {
      cardDeletingConfirmOpen: false,
      deletedBackId: null,
      deletedImageBackId: null
    };
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
    this.setState({ cardDeletingConfirmOpen: false });
  }

  handleDeleteBack = () => {
    this.props.onDeleteBack(this.props.card.id, this.state.deletedBackId);
    this.setState({ deletedBackId: null });
  }

  handleDeleteImage = () => {
    this.props.onDeleteImage(this.props.card.id, this.state.deletedImageBackId);
    this.setState({ deletedImageBackId: null });
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
      event.target.value = null;
    }
  }

  handleOpenCardDeletingConfirm = () => {
    this.setState({ cardDeletingConfirmOpen: true });
  }

  handleCloseCardDeletingConfirm = () => {
    this.setState({ cardDeletingConfirmOpen: false });
  }

  handleOpenBackDeletingConfirm = (backId) => {
    this.setState({ deletedBackId: backId });
  }

  handleCloseBackDeletingConfirm = () => {
    this.setState({ deletedBackId: null });
  }

  handleOpenBackImageDeletingConfirm = (backId) => {
    this.setState({ deletedImageBackId: backId });
  }

  handleCloseBackImageDeletingConfirm = () => {
    this.setState({ deletedImageBackId: null });
  }

  render() {
    const { card, cardFrontFormOpened, selectedBack, cardBackFormOpened } = this.props;
    const { cardDeletingConfirmOpen, deletedBackId, deletedImageBackId } = this.state;

    return (
      <div className="edit-card">
        <div className="back-feature">
          <Link to={this.backUrl || '/cards'}>
            <span className="back-feature-icon">
              <Icon icon={backIcon} />
            </span>
            <span className="back-feature-label"> Back</span>
          </Link>
          <Link to={{ pathname: '/cards/create', state: { backUrl: this.backUrl } }}>
            Create card
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
                icon={<Icon icon={editIcon} color="#646464" />}
                label="Edit front"
                onClick={this.handleEditFront} />
              <DropDownItem
                className="delete-card-btn"
                type="button"
                icon={<Icon icon={deleteIcon} color="red" />}
                label="Delete card"
                onClick={this.handleOpenCardDeletingConfirm} />
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
                    icon={<Icon icon={editIcon} color="#646464" />}
                    label="Edit back"
                    onClick={() => this.handleEditBack(back.id)} />
                  <DropDownItem
                    className="delete-back-btn"
                    type="button"
                    icon={<Icon icon={deleteIcon} color="red" />}
                    label="Delete back"
                    onClick={() => this.handleOpenBackDeletingConfirm(back.id)} />
                  <DropDownItem type="line" />
                  <DropDownItem
                    type="button"
                    icon={<Icon icon={uploadImageIcon} color="#646464" />}
                    label={back.imageUrl ? "Change image" : "Upload image"}
                    onClick={() => this.handleUploadImage(back.id)} />
                  {back.imageUrl && (
                    <DropDownItem
                      type="button"
                      icon={<Icon icon={deleteImageIcon} color="#646464" />}
                      label="Delete image"
                      onClick={() => this.handleOpenBackImageDeletingConfirm(back.id)} />
                  )}
                </DropDown>
              </div>
            );
          })}
          <input
            type="file"
            id="upload-image-input"
            accept="image/*"
            ref={this.uploadImageInput}
            onChange={this.handleImageChange} />
          {card?.backs.length < 2 && (
            <Button
              type="button"
              className="add-back-btn"
              onClick={this.handleAddBack}>
              Add back
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
        <Confirm
          isOpen={cardDeletingConfirmOpen}
          header="Delete"
          message="Are you sure you want to delete this card?"
          confirmLabel="Delete"
          confirmColor="#fe656d"
          onCancel={this.handleCloseCardDeletingConfirm}
          onConfirm={this.handleDeleteCard}>
        </Confirm>
        <Confirm
          isOpen={!!deletedBackId}
          header="Delete"
          message="Are you sure you want to delete this back?"
          confirmLabel="Delete"
          confirmColor="#fe656d"
          onCancel={this.handleCloseBackDeletingConfirm}
          onConfirm={this.handleDeleteBack}>
        </Confirm>
        <Confirm
          isOpen={!!deletedImageBackId}
          header="Delete"
          message="Are you sure you want to delete the image of this back?"
          confirmLabel="Delete"
          confirmColor="#fe656d"
          onCancel={this.handleCloseBackImageDeletingConfirm}
          onConfirm={this.handleDeleteImage}>
        </Confirm>
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