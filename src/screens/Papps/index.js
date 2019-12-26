import React, { PureComponent } from 'react';
import { getPappList } from '@src/services/api/papp';
import { ExHandler } from '@src/services/exception';
import { CONSTANT_COMMONS } from '@src/constants';
import Papps from './Papps';

class PappsContainer extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      papps: [],
      isGettingPapps: false,
    };
  }

  componentDidMount() {
    this.getPappList();
  }

  getPappList = async () => {
    try {
      this.setState({ isGettingPapps: true });
      const allPapps = await getPappList();
      const approvedPapps = allPapps?.filter(papp => papp?.status === CONSTANT_COMMONS.PAPP.STATUS.APPROVED) || [];

      this.setState({ papps: approvedPapps });
    } catch (e) {
      new ExHandler(e).showErrorToast();
    } finally {
      this.setState({ isGettingPapps: false });
    }
  }

  render() {
    const { papps, isGettingPapps } = this.state;

    return (
      <Papps
        {...this.props}
        isGettingPapps={isGettingPapps}
        onReload={this.getPappList}
        papps={papps}
      />
    );
  }
}

export default PappsContainer;