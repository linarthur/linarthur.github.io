// data/rooms/index.js — the room registry. Adding a room means adding one
// import + one line here; the engine never needs to change.

import { gallery } from "./gallery.js";
import { stacks } from "./stacks.js";
import { boiler } from "./boiler.js";
import { cellar } from "./cellar.js";
import { subbasement } from "./subbasement.js";
import { lisbonAlley } from "./lisbonAlley.js";
import { hypogeum } from "./hypogeum.js";
import { harborBar } from "./harborBar.js";
import { donanaPartners } from "./donanaPartners.js";
import { saharaPartners } from "./saharaPartners.js";
import { biminiPartners } from "./biminiPartners.js";
import { donanaCunning } from "./donanaCunning.js";
import { saharaCunning } from "./saharaCunning.js";
import { biminiCunning } from "./biminiCunning.js";
import { biminiCunningDive } from "./biminiCunningDive.js";
import { donanaNerve } from "./donanaNerve.js";
import { saharaNerve } from "./saharaNerve.js";
import { biminiNerve } from "./biminiNerve.js";
import { biminiNerveDive } from "./biminiNerveDive.js";
import { calderaApproach } from "./calderaApproach.js";
import { calderaChamber } from "./calderaChamber.js";

export const ROOMS = {
  gallery,
  stacks,
  boiler,
  cellar,
  subbasement,
  lisbonAlley,
  hypogeum,
  harborBar,
  donanaPartners,
  saharaPartners,
  biminiPartners,
  donanaCunning,
  saharaCunning,
  biminiCunning,
  biminiCunningDive,
  donanaNerve,
  saharaNerve,
  biminiNerve,
  biminiNerveDive,
  calderaApproach,
  calderaChamber,
};

export default ROOMS;
