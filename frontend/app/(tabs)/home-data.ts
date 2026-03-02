export type PlayerProfile = {
  id?: string | number;
  email?: string;
  displayName?: string | null;
  credits?: number | null;
  creditsMax?: number | null;
  energy?: number | null;
  energyMax?: number | null;
  health?: number | null;
  healthMax?: number | null;
  radiation?: number | null;
  radiationMax?: number | null;
  thug?: number | null;
  thief?: number | null;
  grifter?: number | null;
  pilot?: number | null;
  medic?: number | null;
  hacker?: number | null;
  technician?: number | null;
  chemist?: number | null;
  physicist?: number | null;
  scavenger?: number | null;
  mechanic?: number | null;
  smuggler?: number | null;
  itemSpd1?: number | null;
  itemMed1?: number | null;
  itemRadx?: number | null;
};

export type StatItem = {
  key: 'credits' | 'energy' | 'health' | 'radiation';
  label: string;
  value: number;
  max: number;
};

export const getStatItems = (player: PlayerProfile | null): StatItem[] => {
  if (!player) {
    return [];
  }

  return [
    { key: 'credits', label: 'Credits', value: player.credits ?? 0, max: player.creditsMax ?? 1000000 },
    { key: 'energy', label: 'Energy', value: player.energy ?? 0, max: player.energyMax ?? 10 },
    { key: 'health', label: 'Health', value: player.health ?? 0, max: player.healthMax ?? 100 },
    { key: 'radiation', label: 'Radiation', value: player.radiation ?? 0, max: player.radiationMax ?? 100 },
  ];
};

export type SkillKey =
  | 'thug'
  | 'thief'
  | 'grifter'
  | 'pilot'
  | 'medic'
  | 'hacker'
  | 'technician'
  | 'chemist'
  | 'physicist'
  | 'scavenger'
  | 'mechanic'
  | 'smuggler';

export type SkillItem = {
  key: SkillKey;
  label: string;
  tip: string;
};

export const skillItems: SkillItem[] = [
  { key: 'thug', label: 'Thug', tip: 'Physical, combat, defence' },
  { key: 'thief', label: 'Thief', tip: 'Physical, agile, nimble' },
  { key: 'grifter', label: 'Grifter', tip: 'Skill, crime, cunning' },
  { key: 'pilot', label: 'Pilot', tip: 'Skill, courage, speed' },
  { key: 'medic', label: 'Medic', tip: 'Skill, intelligence, healer' },
  { key: 'hacker', label: 'Hacker', tip: 'Skill, intelligence, technical' },
  { key: 'technician', label: 'Technician', tip: 'Skill, intelligence, mechanical, biotech' },
  { key: 'chemist', label: 'Chemist', tip: 'Skill, compounds, toxins, antidotes' },
  {
    key: 'physicist',
    label: 'Physicist',
    tip: 'Skill, control radiation effects and mutations caused by Nekrosol solar radiation',
  },
  { key: 'scavenger', label: 'Scavenger', tip: 'Physical, salvage, field survival' },
  { key: 'mechanic', label: 'Mechanic', tip: 'Skill, repair systems, maintain rigs and vehicles' },
  { key: 'smuggler', label: 'Smuggler', tip: 'Skill, stealth logistics, route contraband safely' },
];

export type MissionItem = {
  id: string;
  title: string;
  summary: string;
  details: string;
  action: 'BEG' | null;
};

export const missionItems: MissionItem[] = [
  {
    id: 'street-begging',
    title: 'Street Begging',
    summary: 'Work the markets and alleyways for quick credits.',
    details:
      'A repeatable mission where you ask around settlements for spare credits. This consumes energy and rewards variable credits.',
    action: 'BEG',
  },
  {
    id: 'solar-fringe-patrol',
    title: 'Patrol the Solar Fringe',
    summary: 'Scout unstable outskirts for threats and salvage.',
    details: 'Patrol routes across the fringe to discover hazards, contacts, and future mission hooks.',
    action: null,
  },
  {
    id: 'rust-belt-salvage',
    title: 'Salvage Run: Rust Belt',
    summary: 'Recover parts and scrap from collapsed industrial sectors.',
    details: 'Navigate dangerous ruins to collect valuable components for upgrades and trade.',
    action: null,
  },
  {
    id: 'convoy-escort',
    title: 'Escort the Convoy',
    summary: 'Protect trade convoys through contested routes.',
    details: 'Take contracts to defend cargo movement between settlements while managing risk and supply timing.',
    action: null,
  },
];

export type InventoryAction = 'SPD-1' | 'MED-1' | 'RAD-X';

export type InventoryItem = {
  action: InventoryAction;
  label: string;
  description: string;
  buttonLabel: string;
};

export const inventoryItems: InventoryItem[] = [
  {
    action: 'SPD-1',
    label: 'SPD-1 Stim',
    description: 'Stimulant for rapid response and movement.',
    buttonLabel: 'Use',
  },
  {
    action: 'MED-1',
    label: 'MED-1 Medkit',
    description: 'Emergency treatment pack for stabilizing wounds.',
    buttonLabel: 'Use',
  },
  {
    action: 'RAD-X',
    label: 'RAD-X Shield',
    description: 'Anti-radiation dose to reduce exposure impact.',
    buttonLabel: 'Use',
  },
];

export type LocationItem = {
  id: string;
  name: string;
  summary: string;
  details: string;
};

export const locationItems: LocationItem[] = [
  {
    id: 'dustline-tavern',
    name: 'Dustline Tavern',
    summary: 'Crowded neutral den for rumors and jobs.',
    details: 'A key social hub where factions exchange intel, mercenaries gather, and contracts circulate.',
  },
  {
    id: 'ember-bank',
    name: 'Ember Bank',
    summary: 'Primary credit exchange and debt registry.',
    details: 'Handles account settlements, loan ledgers, and high-value escrow under strict armed oversight.',
  },
  {
    id: 'blackglass-market',
    name: 'Blackglass Market',
    summary: 'Open bazaar for rare salvage and contraband.',
    details: 'You can source uncommon components and broker risky trades through intermediaries and fixers.',
  },
  {
    id: 'reactor-district',
    name: 'Reactor District',
    summary: 'Industrial zone with heavy radiation influence.',
    details: 'Core power infrastructure region with high hazard levels, technical opportunities, and restricted access.',
  },
];
