import React from 'react'
import { Prompt } from 'react-router-dom'

import Confirm from '../Confirm/Confirm';

export class RouteLeavingGuard extends React.Component {
  state = {
    confirmOpen: false,
    lastLocation: null,
    confirmedNavigation: false,
  }

  showConfirm = (location) => {
    this.setState({ confirmOpen: true, lastLocation: location });
  }

  closeConfirm = (callback) => {
    this.setState({ confirmOpen: false }, callback);
  }

  handleBlockedNavigation = (nextLocation) => {
    const { confirmedNavigation } = this.state
    const { shouldBlockNavigation } = this.props

    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      this.showConfirm(nextLocation)
      return false
    }
    return true
  }

  handleConfirmNavigationClick = () => this.closeConfirm(() => {
    const { navigate } = this.props
    const { lastLocation } = this.state
    if (lastLocation) {
      this.setState({
        confirmedNavigation: true
      }, () => {    
        navigate(lastLocation.pathname)
      })
    }
  })

  render() {
    const { when } = this.props
    const { confirmOpen } = this.state
    return (
      <>
        <Prompt
          when={when}
          message={this.handleBlockedNavigation} />
        <Confirm
          isOpen={confirmOpen}
          header="Exit"
          message="Are you sure you want to leave this page?"
          confirmLabel="OK"
          confirmColor="#fe656d"
          onCancel={() => this.closeConfirm(() => {})}
          onConfirm={this.handleConfirmNavigationClick} />
      </>
    )
  }
}
export default RouteLeavingGuard