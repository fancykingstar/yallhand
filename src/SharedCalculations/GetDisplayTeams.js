const teamID2Friendly = (tagID, allTags) => {
  const selectedTag = allTags.filter(tag => tag.teamID === tagID)[0];
  return selectedTag.label;
};

export const getDisplayTeams = (team, structure) => {
  let displayTeams = team;
  if (displayTeams !== "") {
    displayTeams = teamID2Friendly(team, structure);
  }
  else {displayTeams = "Global"}
  return displayTeams;
};
