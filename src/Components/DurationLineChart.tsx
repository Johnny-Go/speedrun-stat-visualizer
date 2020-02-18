import React, { ReactElement } from 'react'
import { Attempt } from '../types'

import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory'

//component for rendering the vertical line on the line chart
class Cursor extends React.Component<any> {
  //todo: define props instead of using any
  render() {
    const { x, scale } = this.props
    const range = scale.y.range()
    return (
      <line
        style={{
          stroke: 'black',
          strokeWidth: 0.5
        }}
        x1={x}
        x2={x}
        y1={Math.max(...range)}
        y2={Math.min(...range)}
      />
    )
  }
}

function millisecondsToString(milliseconds: number): string {
  let workingVar = milliseconds

  const hours = Math.trunc(workingVar / 3600000)
  workingVar = workingVar % 3600000
  const minutes = Math.trunc(workingVar / 60000)
  workingVar = workingVar % 60000
  const seconds = Math.trunc(workingVar / 1000)

  if (hours > 0) {
    if (minutes < 10) {
      if (seconds < 10) {
        return `${hours}:0${minutes}:0${seconds}`
      } else {
        return `${hours}:0${minutes}:${seconds}`
      }
    } else {
      if (seconds < 10) {
        return `${hours}:${minutes}:0${seconds}`
      } else {
        return `${hours}:${minutes}:${seconds}`
      }
    }
  } else {
    if (seconds < 10) {
      return `${minutes}:0${seconds}`
    } else {
      return `${minutes}:${seconds}`
    }
  }
}

function findDomain(data: number[]): { min: number; max: number } {
  let min = data[0]
  let max = data[0]

  for (let i = 1, length = data.length; i < length; i++) {
    let v: number = data[i]
    min = v < min ? v : min
    max = v > max ? v : max
  }

  return { min, max }
}

function getTimeTicks(min: number, max: number, numTicks: number): number[] {
  if (numTicks <= 2) {
    return [min, max]
  }

  const range = max - min
  const step = Math.ceil(range / (numTicks - 2) / 5000) * 5000 //round up to nearest 5000ms (5 seconds)
  const lower = Math.trunc(min / step) * step //get the lower boundry

  let ticks = [lower] //add the lower boundry

  //add the ticks
  for (let i = 1; i <= numTicks - 1; i++) {
    ticks.push(lower + step * i)
  }

  return ticks
}

type DurationLineChartProps = {
  chartTitle: string
  data: Attempt[]
  xAxisLabel: string
  yAxisLabel: string
}

const DurationLineChart: React.FC<DurationLineChartProps> = ({
  chartTitle,
  data,
  xAxisLabel,
  yAxisLabel
}): ReactElement => {
  //if there's no data return nothing
  if (!data || data.length <= 0) {
    return <React.Fragment></React.Fragment>
  }

  //get the domain for the x-axis
  const xDomain = findDomain(
    data.map((item: Attempt) => {
      return item.x
    })
  )

  //get the domain for the y-axis
  const yDomain = findDomain(
    data.map((item: Attempt) => {
      return item.y
    })
  )

  //get the ticks for the y-axis
  const yTicks = getTimeTicks(yDomain.min, yDomain.max, 6)

  return (
    <VictoryChart //container for the chart
      containerComponent={
        //used for the tooltip, and the vertical indicator line
        <VictoryVoronoiContainer
          //only use the x-axis to determine which tooltip shows
          voronoiDimension="x"
          //labels expects a string so we need to return one here instead of just using an empty function () => {}
          labels={() => {
            return ''
          }}
          //draws the vertical indicator line
          labelComponent={<Cursor />}
        />
      }
      //max height of the graph
      height={200}
      //use the material theme instead of the grayscale theme (may be able to remove this once we add custom styling)
      theme={VictoryTheme.material}
    >
      <VictoryLabel //table title
        //center label horizontally in the container
        dx="50%"
        //style the title
        style={{
          fill: 'black',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
        //use the middle of the label as the anchor point
        textAnchor="middle"
        //use the top of the label as the anchor point
        verticalAnchor="start"
        //label text
        text={chartTitle}
        //dy isn't working for positioning so we are using y, will probably file a bug
        y={15}
      />
      <VictoryAxis //the x-axis
        //the min and max values of the x-axis
        domain={[0, xDomain.max]}
        //label text for the x-axis
        label={xAxisLabel}
        //style the x-axis
        style={{
          //style the label
          axisLabel: {
            fontSize: 10,
            padding: 20, //changes distance from axis of label
            fill: 'black'
          },
          //style the gridlines
          grid: {
            strokeWidth: 0 //removes lines
          },
          //style the tick labels
          tickLabels: {
            fontSize: 7,
            padding: 5, //changes distance from axis of ticks
            fill: 'black'
          }
        }}
      />
      <VictoryAxis //the y-axis
        //spcifies it's the y-axis
        dependentAxis
        //the min and max values of the y-axis
        domain={[yTicks[0], yTicks[yTicks.length - 1]]}
        //the label text for the y-axis
        label={yAxisLabel}
        //style the y-axis
        style={{
          //style the label
          axisLabel: {
            fontSize: 10,
            padding: 36, //changes distance from axis of label
            fill: 'black'
          },
          //style the tick labels
          tickLabels: {
            fontSize: 7,
            padding: 5, //changes distance from axis of ticks
            fill: 'black'
          }
        }}
        //how the ticks display
        tickFormat={y => {
          return millisecondsToString(y)
        }}
        //values for the ticks
        tickValues={yTicks}
      />
      <VictoryLine //the data line
        //data to draw the line
        data={data}
        //min and max values for the x and y axis
        domain={{
          x: [0, xDomain.max],
          y: [yDomain.min, yDomain.max]
        }}
        //curves the line
        interpolation={'monotoneX'}
        //enable the tooltip
        labelComponent={<VictoryTooltip />}
        //tooltip text
        labels={({ datum }: any) =>
          `Attempt: ${datum.x},\nRun Duration:${millisecondsToString(datum.y)}`
        }
        //styling for the line and tooltiips
        style={{
          labels: { fill: 'blue', fontSize: 5 },
          data: { stroke: 'red', strokeWidth: 0.5 }
        }}
      />
      <VictoryScatter //use if you want symbols on the data points
        //data to draw the scatter points
        data={data}
        //size of the symbol for the scatter points
        size={0.5}
        //styling for the scater points
        style={{
          data: { fill: 'blue' },
          labels: { fill: 'transparent' } //remove labels on data points
        }}
      />
    </VictoryChart>
  )
}

export default DurationLineChart
