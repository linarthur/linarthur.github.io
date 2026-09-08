// data/roomLabels.js — bilingual, human-readable location names for every
// room id. Used by the save/load menu (engine/ui.js via engine/main.js) so
// a save slot shows WHERE the player was, not just when they saved — the
// same roomId already stored in every save (see engine/save.js / gameState),
// just given a name a player recognizes instead of an internal id.

export const ROOM_LABELS = {
  gallery: "Barnett Hall Gallery\n巴奈特廳畫廊",
  stacks: "The Stacks\n書庫",
  boiler: "The Boiler Room\n鍋爐室",
  cellar: "The Root Cellar\n地窖",
  subbasement: "The Sub-Basement\n地下室",
  lisbonAlley: "Lisbon — The Alfama Alley\n里斯本——阿爾法瑪巷",
  hypogeum: "Malta — The Hypogeum\n馬爾他——地下墓穴",
  harborBar: "Malta — The Harbour Bar\n馬爾他——港口酒吧",
  donanaPartners: "Doñana Marshes (Partners)\n多尼亞納沼澤(夥伴路線)",
  saharaPartners: "The Richat Structure (Partners)\n理查特結構(夥伴路線)",
  biminiPartners: "Bimini, Bahamas (Partners)\n巴哈馬比米尼(夥伴路線)",
  donanaCunning: "Doñana Marshes (Cunning)\n多尼亞納沼澤(詭計路線)",
  saharaCunning: "The Richat Structure (Cunning)\n理查特結構(詭計路線)",
  biminiCunning: "Bimini Dockyard (Cunning)\n比米尼船塢(詭計路線)",
  biminiCunningDive: "The Bimini Wreck (Cunning)\n比米尼沉船(詭計路線)",
  donanaNerve: "Doñana Marshes (Nerve)\n多尼亞納沼澤(膽識路線)",
  saharaNerve: "The Richat Structure (Nerve)\n理查特結構(膽識路線)",
  biminiNerve: "Bimini Dockyard (Nerve)\n比米尼船塢(膽識路線)",
  biminiNerveDive: "The Bimini Wreck (Nerve)\n比米尼沉船(膽識路線)",
  calderaApproach: "The Caldera — Approach\n火山口——入口",
  calderaChamber: "The Caldera — The Flooded Chamber\n火山口——淹水密室",
};

export function locationLabelFor(roomId) {
  return ROOM_LABELS[roomId] || null;
}
