import { Dimensions } from "react-native"
import { Circle, Svg } from "react-native-svg"

type Props = { 
	duration: number,
	remainingSeconds: number 
}

const { width } =  Dimensions.get("window")
const size = width - 64 
const mainStrokeWidth = 5
const bgStrokeWidth = 3
const radius = (size - mainStrokeWidth) / 2
const circum = radius * 2 * Math.PI 

const RemainingTimeIndicator: React.FC<Props> = ({ duration, remainingSeconds }) => {
	const offset = (1 - (remainingSeconds / duration)) * circum;

	return (
		<Svg width={size} height={size}>
			<Circle 
				stroke="#606060"
				fill="none"
				cy={size / 2}
				cx={size / 2}
				r={radius}
				strokeWidth={bgStrokeWidth}
			/>
			<Circle 
				stroke={remainingSeconds > 10 ? `#F5F6F3` : '#F4533E'}
				fill="none"
				cy={size / 2}
				cx={size / 2}
				r={radius}
				strokeDasharray={`${circum} ${circum}`}
				strokeDashoffset={offset}
				strokeLinecap="round"
				transform={`
					translate(${size / 2}, ${size / 2})
					rotate(-90)
					scale(1, -1)
					translate(-${size / 2}, -${size / 2})
				`}
				strokeWidth={mainStrokeWidth}
			/>
		</Svg>
	)
}

export default RemainingTimeIndicator
