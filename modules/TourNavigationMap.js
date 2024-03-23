const tourNavigationMap = {
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
