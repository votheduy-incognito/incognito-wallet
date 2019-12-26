import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { submitPapp } from '@src/services/api/papp';
import PappSubmit from './PappSubmit';

class PappSubmitContainer extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  handleSubmit = (data) => {
    return submitPapp({
      title: data?.title,
      link: data?.link,
      shortDescription: data?.shortDescription,
      fullDescription: data?.fullDescription,
      logoFile: data?.logoFile,
      imageFiles: data?.imageFiles,
      contactWebsite: data?.contactWebsite,
      contactEmail: data?.contactEmail,
      contactPhone: data?.contactPhone
    });
  }

  render() {
    return <PappSubmit {...this.props} onSubmit={this.handleSubmit} />;
  }
}

PappSubmitContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default PappSubmitContainer;
