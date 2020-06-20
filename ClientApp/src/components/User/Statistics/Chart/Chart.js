import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { AutoSizer } from 'react-virtualized';

import './Chart.css';

const tempData = [
  { day: "Mon", gradePointAverage: 0 },
  { day: "Tue", gradePointAverage: 0 },
  { day: "Wed", gradePointAverage: 0 },
  { day: "Thu", gradePointAverage: 0 },
  { day: "Fri", gradePointAverage: 0 },
  { day: "Sat", gradePointAverage: 0 },
  { day: "Sun", gradePointAverage: 0 }
];

const isToday = ({ indexValue }) => indexValue === new Date().toString().substr(0, 3);
const getColor = bar => isToday(bar) ? '#ffb922' : '#eee';

const chart = props => {
  const data = props.data || tempData;
  for (let item of data) {
    item.gradePointAverage = item.gradePointAverage || 1;
  }

  return (
    <div className="chart-wrapper">
      <AutoSizer style={{ width: '100%', height: '100%' }}>
        {({ width, height }) => (
          <div className="chart" style={{ width: width, height: height }}>
            <ResponsiveBar
              data={data}
              minValue={0}
              maxValue={100}
              keys={['gradePointAverage']}
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
  )
};

export default chart;