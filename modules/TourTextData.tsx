import { Icon } from "@react-native-material/core"
import { ReactNode } from "react"
import SessionIcon from '@icons/SessionIcon.svg'
import { Text, View } from "react-native"

type TextSegment = {
  text?: string,
  bold?: boolean,
  italic?: boolean,
  color?: string,
  icon?: ReactNode,
}

const tourTextData: { [key: string]: TextSegment[] } = {
  homeScreenModalText: [
    { text: 'Welcome to the ' },
    { text: 'Home Screen', bold: true },
    { text: '.\n\n' },
    { text: 'This is the default screen of the application.\n\n' },
    { text: 'From this screen you can:\n' },
    { text: '-  View your active programs\n', bold: true },
    { text: '-  Check your weekly progress\n', bold: true },
    { text: '-  Browse all available\n   programs or exercises', bold: true },
  ],
  programsListScreenModalText: [
    { text: 'This is the ' },
    { text: 'Program Browser', bold: true },
    { text: '.\n\n' },
    { text: 'Here you can view and subscribe to any of the available programs.\n\n' },
    { text: 'You can sort programs by\n' },
    { text: '- Type (orientation)\n', bold: true },
    { text: '- Completion difficulty', bold: true },
  ],
  hubScreenModalText: [
    { text: 'This is your ' },
    { text: 'Hub Screen', bold: true },
    { text: '.\n\n' },
    { text: 'On this screen you can view details about your weekly routine by browsing your assigned ' },
    { text: 'exercise sessions', bold: true },
    { text: '.' },
  ],
  activeSessionScreenModalText: [
  ],
  endSessionScreenModalText: [
  ],
  copilotStepText1: [
    { text: "Let's start by browsing existing programs." },
  ],
  copilotStepText2: [
    { text: 'This is one of the program cards.\n\n' },
    { text: "Let's " },
    { text: 'Subscribe', color: 'green', bold: true },
    { text: ' to to this program.' },
  ],
  copilotStepText3: [
    { text: "Here is where you will see all currently active programs that you've subscribed to.\n\n" },
    { text: 'If you want to create a custom program, you can press ', icon: <Icon name="plus" size={20} color="#121212" /> },
    { text: ' in the top right corner.\n\n' },
    { text: 'Notice that ' },
    { text: 'Your First Exercise Program', bold: true },
    { text: ' now appears in the list of the Active Programs.' },
  ],
  copilotStepText4: [
    { text: 'This is the ' },
    { text: 'Progress Tracker', bold: true },
    { text: '.\n\n' },
    { text: 'Each letter represents the day of the current week. The current day will be highlighted in ' },
    { text: 'red', bold: true, color: 'red' },
    { text: '.\n\n' },
    { text: 'If there are any exercise sessions assigned to a specific day of the week you will see this day circled with a border ', icon: <Icon name="square-rounded-outline" size={20} color="#121212" />},
    { text: '.\n\n' },
    { text: "Notice that there is an exercise session assigned on Sunday. Let's view more details." },
  ],
  copilotStepText5: [
    { text: "You can select any day of the week from this " },
    { text: 'Progress Tracker', bold: true },
    { text: '.\n\n' },
    { text: "The currently selected day is highlighted by parenthesis.\n\n" },
    { text: "If you have any sessions assigned to a given day, you will see:\n\n" },
    { icon: <SessionIcon height={20} width={10} fill='#121212' className="mt-2" /> },
    { text: " for upcoming session\n" },
    { icon: <SessionIcon height={20} width={10} fill='#74AC5D' /> },
    { text: " for completed session\n" },
    { icon: <SessionIcon height={20} width={10} fill='#F4533E' /> },
    { text: " for missed session\n\n" },
    { text: "You can have multiple sessions a day from different programs." },
  ],
  copilotStepText6: [
    { text: 'This is one of the ' },
    { text: 'Session Cards', bold: true },
    { text: '.\n\n' },
    { text: "It shows all the relevant information as well as the status of the session and the list of included exercises." },
  ],
  copilotStepText7: [
    { text: "Let's start this session and go through the exercises." },
  ],
  copilotStepText8: [
  ],
  copilotStepText9: [
  ],
  copilotStepText10: [
  ],
}

export default tourTextData
