import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import arrowLeftIcon from '@iconify/icons-uil/angle-left';

import StatisticsInfo from '../../../components/User/StatisticsInfo/StatisticsInfo';
import StatisticsDetailInfo from '../../../components/User/StatisticsDetailInfo/StatisticsDetailInfo';
import './StatisticsDetail.css';

class StatisticsDetail extends Component {
  render() {
    const { location } = this.props;

    return (
      <div className="statistics-detail">
        <section className="left-section">
          <div className="back-feature">
            <Link to={location.state?.backUrl || '/'}>
              <span className="back-feature-icon">
                <Icon icon={arrowLeftIcon} />
              </span>
              <span className="back-feature-label"> Back</span>
            </Link>
          </div>
          <StatisticsInfo />
        </section>
        <section className="right-section">
          <StatisticsDetailInfo />
        </section>
      </div>
    );
  }
}

export default StatisticsDetail;