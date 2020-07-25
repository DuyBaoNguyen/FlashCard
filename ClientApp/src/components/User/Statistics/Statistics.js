import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Icon } from '@iconify/react';
import leftArrowIcon from '@iconify/icons-uil/angle-right';
import rightArrowIcon from '@iconify/icons-uil/angle-left';

import PercentPracticedCardsChart from './PercentPracticedCardsChart/PercentPracticedCardsChart';
import AmountRememberedCardsChart from './AmountRememberedCardsChart/AmountRememberedCardsChart';
import Button from '../../Shared/Button/Button';
import './Statistics.css';

class Statistics extends PureComponent {
  state = {
    left: true
  }

  handleSlideCharts = () => {
    this.setState(prevState => {
      return { left: !prevState.left };
    });
  }

  render() {
    const { 
      amountRememberedCardsChartData, 
      percentPracticedCardsChartData, 
      className,
      location
    } = this.props;
    const { left } = this.state;

    const statisticsClasses = ['statistics-wrapper'];
    if (className) {
      statisticsClasses.push(className);
    }

    let path = {
      pathname: `${location.pathname}/statistics`.replace('//', '/'),
      state: { backUrl: location.pathname }
    };

    let chartName = (
      <p className="chart-name">
        Remembered cards
        <Link to={path}> (more)</Link>
      </p>
    );
    const chartClasses = ['charts-container'];
    if (!left) {
      chartClasses.push('right');
      chartName = (
        <p className="chart-name">
          Percent practiced cards
          <Link to={path}> (more)</Link>
        </p>
      );
    }

    return (
      <div className={statisticsClasses.join(' ')}>
        <div className="statistics-header">
          <p className="header">Statistics</p>
          {chartName}
        </div>
        <div className={chartClasses.join(' ')}>
          <div className="chart-content">
            <AmountRememberedCardsChart data={amountRememberedCardsChartData} />
          </div>
          <div className="chart-content">
            <PercentPracticedCardsChart data={percentPracticedCardsChartData} />
          </div>
          <Button
            type="button"
            className="control-btn"
            icon={<Icon icon={left ? leftArrowIcon : rightArrowIcon} style={{ fontSize: 24 }} />}
            onClick={this.handleSlideCharts}>
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(Statistics);