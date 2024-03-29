const tourNavigationMap = {
  toHomeScreenThenHub: {
    screenName: "Home",
    screenProps: {
      isFirstTime: true,
      copilotStep: 'activePrograms',
    },
  },
  toHubScreen: {
    screenName: "Hub",
    screenProps: {
      isFirstTime: true,
    },
  },
  toEditProgramScreen: {
    screenName: "EditProgram",
    screenProps: {
      programId: 1,
      newProgram: false,
    },
  },
  toEditPhaseScreen: { screenName: "EditPhase" },
  toEditSessionScreen: { screenName: "EditSession" },
  toBrowseProgramsScreen: {
    screenName: "ProgramsList",
    screenProps: {
      isFirstTime: true,
    },
  },
};

export default tourNavigationMap;
