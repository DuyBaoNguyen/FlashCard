import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { AutoSizer } from 'react-virtualized';

import './Chart.css';

const tempData = [
  { day: "Mon", percent: 0 },
  { day: "Tue", percent: 0 },
  { day: "Wed", percent: 0 },
  { day: "Thu", percent: 0 },
  { day: "Fri", percent: 0 },
  { day: "Sat", percent: 0 },
  { day: "Sun", percent: 0 }
];

const isToday = ({ indexValue }) => indexValue === new Date().toString().substr(0, 3);
const getColor = bar => isToday(bar) ? '#ffb922' : '#eee';

const chart = props => {
  const data = props.data || tempData;
  // const data = tempData;
  for (let item of data) {
    item.percent = item.percent || 1;
  }

  return (
    <div className="chart-wrapper">
      <AutoSizer>
        {({ width, height }) => (
          <div className="chart" style={{ width: width, height: height }}>
            <ResponsiveBar
              data={data}
              minValue={0}
              maxValue={100}
              keys={['percent']}
              indexBy="day"
              margin={{ top: 0, right: 0, bottom: 20, left: 0 }}
              padding={0.15}
              colors={getColor}
              theme={{
                fontSize: 13,
                fontFamily: 'inherit',
                textColor: '#555',
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
  )
};

export default chart;