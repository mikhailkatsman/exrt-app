import PropTypes from 'prop-types';
import React, { PureComponent } from "react";
import { View } from "react-native";
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

export default class Hatch extends PureComponent {

  static propTypes = {
    pattern: PropTypes.func.isRequired,
    space: PropTypes.number,
    backgroundColor: PropTypes.string,
    lineColor: PropTypes.string,
    lineWidth: PropTypes.number,
    rotation: PropTypes.number
  }

  static defaultProps = {
    pattern: () => { },
    space: 5,
    lineColor: "#D5F2E3",
    lineWidth: 2,
    rotation: 45
  }

  render() {
    const transform = `rotate(${this.props.rotation})`
    return <View style={{
      flex: 1,
      flexDirection: "row",
      height: "100%",
      width: "100%",
      position: "absolute",
      top: 0,
      start: 0,
      backgroundColor: this.props.backgroundColor
    }}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern
            id="linePattern"
            patternUnits="userSpaceOnUse"
            patternTransform={transform}
            width={this.props.space}
            height={this.props.space}>
            <Line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              stroke={this.props.lineColor}
              strokeWidth={this.props.lineWidth}
            />
          </Pattern>
        </Defs>

        <Rect
          fill="url(#linePattern)"
          x="0"
          y="0"
          width="100%"
          height="100%"
        />
      </Svg>
    </View>
  }
}

