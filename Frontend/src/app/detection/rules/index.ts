import { atomicRules } from "./atomicRules";
import { chainRules } from "./chainRules";
import { persistenceRules } from "./persistenceRules";
import { temporalRules } from "./temporalRules";

export const RULES = [
  ...atomicRules,
  ...chainRules,
  ...persistenceRules,
  ...temporalRules,
];