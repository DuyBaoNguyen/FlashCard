import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { AutoSizer } from 'react-virtualized';

import './Chart.css';

const data = [
  {
    "day": "Mon",
    "score": 36
  },
  {
    "day": "Tue",
    "score": 6
  },
  {
    "day": "Wed",
    "score": 74
  },
  {
    "day": "Thu",
    "score": 70
  },
  {
    "day": "Fri",
    "score": 15
  },
  {
    "day": "Sat",
    "score": 100
  },
  {
    "day": "Sun",
    "score": 34
  }
];

const chart = props => (
  <div className="chart-wrapper">
    <AutoSizer>
      {({ width, height }) => (
        <div className="chart" style={{ width: width, height: height }}>
          <ResponsiveBar
            data={props.data || data}
            minValue={0}
            maxValue={100}
            keys={['score']}
            indexBy="day"
            margin={{ top: 0, right: 0, bottom: 20, left: 0 }}
            padding={0.15}
            colors="#9eacf4"
            theme={{
              fontSize: 12,
              fontFamily: 'inherit',
              textColor: '#888',
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
            labelTextColor="#fff"
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

export default chart;