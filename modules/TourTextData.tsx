import { Icon } from "@react-native-material/core"
import { ReactNode } from "react"
import SessionIcon from '@icons/SessionIcon.svg'

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
  { text: '-  Browse all available\n   programs and exercises', bold: true },
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
  { text: 'This is the ' },
  { text: 'Active Session Screen', bold: true },
  { text: '.\n\n' },
  { text: 'This screen guides you through the session by showing:\n' },
  { text: '- Current exercise to complete\n', bold: true },
  { text: '- Relevant Rest timers\n\n', bold: true },
  { text: 'Each exercise will have all\nthe relevant information\nshown including:\n' },
  { text: '- Timer (if exercise is timed)\n', bold: true },
  { text: '- Video of how to perform\n   the exercise\n', bold: true },
  { text: '- Step by step text guide', bold: true },
  ],
  endSessionScreenModalText: [
  { text: 'This is the ' },
  { text: 'Completion Screen', bold: true },
  { text: '.\n\n' },
  { text: 'You will see this screen whenever you finish any of your ' },
  { text: 'Exercise Sessions', bold: true },
  { text: '.\n\n' },
  { text: 'Here you can:\n' },
  { text: '-  View the total\n   completion time\n', bold: true },
  { text: '-  View all the activated\n   muscle groups\n', bold: true },
  { text: '-  Mark session as completed', bold: true },
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
  { 
    text: 'If there are any exercise sessions assigned to a specific day of the week you will see this day circled with a border ',
    icon: <Icon name="square-rounded-outline" size={20} color="#121212" />
  },
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
  { text: "At the top of the screen you will see the " },
  { text: 'Session Timer', bold: true },
  { text: " and the " },
  { text: 'Progress Bar', bold: true },
  { text: '.\n\n' },
  { text: "Both help you get a general idea of the session's progress.\n\n" },
  { text: "Below that is the " },
  { text: 'Activity Tracker', bold: true },
  { text: '.\n\n' },
  { text: "The current activity will always be centered and enclosed in " },
  { text: 'red', color: 'red' },
  { text: " parenthesis.\n\n" },
  { text: "Completed activity will be to the left and highlighted in " },
  { text: 'green', color: 'green' },
  { text: ".\n\n" },
  { text: "The upcoming activity will be to the right." },
  ],
  copilotStepText9: [
  { text: "Here you can view more details about the " },
  { text: 'Exercise', bold: true },
  { text: " or the " },
  { text: 'Rest Timer', bold: true },
  { text: " depending on the\n" },
  { text: 'Currently Activity', bold: true },
  { text: "." },
  ],
  copilotStepText10: [
  { text: "Depending on the status of the sessions in the related exercise program you will be presented by different actions.\n\n" },
  { text: "Because this tutorial program only has one session, you can either:\n" },
  { text: '-  Keep the session in your routine for the next week\n(' },
  { text: 'Stay On This Phase', bold: true },
  { text: ').\n' },
  { text: '-  Change the status of the program to complete and remove it from your routine\n(' },
  { text: 'Complete Program', bold: true },
  { text: ').' },
  ],
}

export default tourTextData
