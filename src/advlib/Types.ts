export type Category =
  | "Solo"
  | "Bruiser"
  | "Minion"
  | "Horde"
  | "Standard"
  | "Support"
  | "Social"
  | "Leader"
  | "Ranged"
  | "Skulk";
export type FeatureType = "Passive" | "Action" | "Reaction";
export interface KeyList {
  [key: string]: any;
}
export type Distance = "Melee" | "Very Close" | "Close" | "Far" | "Very Far";
export type DamageType = "phy" | "mag" | "phy/mag";
export type Die = 0 | 4 | 6 | 8 | 10 | 12 | 20;
