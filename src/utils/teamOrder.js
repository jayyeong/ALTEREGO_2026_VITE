export const TEAM_ORDER = [
  "limbo",
  "unskinned",
  "dreamscape",
  "tiny-lodge",
  "eleven-eleven",
  "thorn-bloom",
  "rei",
];

const TEAM_ALIASES = {
  Limbo: "limbo",
  "(Un)skinned": "unskinned",
  Dreamscape: "dreamscape",
  "Tiny Lodge": "tiny-lodge",
  "11:11": "eleven-eleven",
  "TEAM 11:11": "eleven-eleven",
  "가시:화(花)": "thorn-bloom",
  "Thorn Bloom": "thorn-bloom",
  "TEAM RE:I": "rei",
  "RE:I": "rei",
};

export const getTeamOrderKey = (team) => {
  if (!team) return "";
  return team.pageKey || team.teamPageUrl || (typeof team.id === "string" ? team.id : "") || TEAM_ALIASES[team.name] || TEAM_ALIASES[team.teamName] || "";
};

export const getTeamOrderIndex = (team) => {
  const index = TEAM_ORDER.indexOf(getTeamOrderKey(team));
  return index === -1 ? TEAM_ORDER.length : index;
};

export const sortByTeamOrder = (items) => (
  [...items].sort((a, b) => getTeamOrderIndex(a) - getTeamOrderIndex(b))
);
