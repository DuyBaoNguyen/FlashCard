import React, { PureComponent } from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { AutoSizer } from 'react-virtualized';

import './AmountRememberedCardsChart.css';

const minAmount = 0.02;
const tempData = [
  { day: "Mon", amount: minAmount },
  { day: "Tue", amount: minAmount },
  { day: "Wed", amount: minAmount },
  { day: "Thu", amount: minAmount },
  { day: "Fri", amount: minAmount },
  { day: "Sat", amount: minAmount },
  { day: "Sun", amount: minAmount }
];

const isToday = ({ indexValue }) => indexValue === new Date().toString().substr(0, 3);
const getColor = bar => isToday(bar) ? '#ffb922' : '#eee';

class AmountRememberedCardsChart extends PureComponent {
  render() {
    let minValue = minAmount;
    let maxValue = minAmount;
    let data = this.props.data || tempData;

    for (let item of data) {
      if (item.amount > maxValue) {
        maxValue = item.amount;
      }
    }

    if (maxValue === minAmount) {
      maxValue = 20;
    }
    minValue = maxValue / 100;

    data = data.map(item => {
      return {
        day: item.day,
        amount: item.amount || minValue
      };
    });

    return (
      <div className="chart-wrapper">
        <AutoSizer style={{ width: '100%', height: '100%' }}>
          {({ width, height }) => (
            <div className="chart" style={{ width: width, height: height }}>
              <ResponsiveBar
                data={data}
                minValue={minValue}
                maxValue={maxValue}
                keys={['amount']}
                indexBy="day"
                margin={{ top: 0, right: 0, bottom: 20, left: 0 }}
                padding={0.15}
                colors={getColor}
                theme={{
                  fontSize: 13,
                  fontFamily: 'inherit',
                  textColor: '#808080',
                  axis: {
                    ticks: {
                      text: {
                        fontWeight: 400
                      }
                    }
                  }
                }}
                borderRadius={4}
                axisBottom={{
                  tickSize: 0,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'day',
                  legendPosition: 'middle',
                  legendOffset: 32
                }}
                enableGridY={false}
                label={d => `${d.value}`}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#535353"
                isInteractive={false}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
              />
            </div>
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default AmountRememberedCardsChart;