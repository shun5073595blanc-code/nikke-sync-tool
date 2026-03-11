export type MaterialKey = "battle_data" | "credit" | "core_dust";

export const MATERIAL_KEYS: MaterialKey[] = [
  "battle_data",
  "credit",
  "core_dust",
];

export const MATERIAL_LABELS: Record<MaterialKey, string> = {
  battle_data: "バトルデータ",
  credit: "クレジット",
  core_dust: "コアダスト",
};

export type MaterialMap = Record<MaterialKey, number>;

export interface CaseCountMap {
  case1h: number;
  case2h: number;
  case4h: number;
  case8h: number;
  case12h: number;
  case24h: number;
}

export type MaterialCaseCountMap = Record<MaterialKey, CaseCountMap>;

export type GrowthSupplyBoxMode = "fixed" | "days_priority";

export interface GrowthSupplyBoxInput {
  enabled: boolean;
  mode: GrowthSupplyBoxMode;
  fixedTarget: MaterialKey;
}

export interface SyncLevelPlanInput {
  currentSyncLevel: number;
  targetSyncLevel: number;
  baseDefenseLevel: number;
  wipeoutCount: number;

  enableDailyPlayReward: boolean;

  ownedDirectMaterials: MaterialMap;
  ownedCaseCounts: MaterialCaseCountMap;

  growthSupplyBox: GrowthSupplyBoxInput;
  selectedShopItemIds: string[];
}

export interface LevelRequirementRow {
  /**
   * level=201 は 201 -> 202 に必要な素材量を表す
   */
  level: number;
  battle_data: number;
  credit: number;
  core_dust: number;
}

export interface BaseDefenseIncomeRow {
  level: number;
  battle_data_per_hour: number;
  credit_per_hour: number;
  core_dust_per_hour: number;
}

export interface MasterData {
  levelRequirements: LevelRequirementRow[];
  baseDefenseIncome: BaseDefenseIncomeRow[];
}

export interface GoalDayInfo {
  days: number | null;
  reachable: boolean;
}

export interface GrowthSupplyBoxResult {
  enabled: boolean;
  mode: GrowthSupplyBoxMode;
  selectedMaterial: MaterialKey | null;
  addedHours: number;
  addedMaterials: number;
}

export interface MaterialResult {
  required: number;
  ownedDirect: number;
  ownedCaseHours: number;
  ownedConvertedFromCases: number;
  effectiveOwned: number;
  remaining: number;

  autoHourly: number;
  baseDaily: number;
  wipeoutDaily: number;
  shopDirect: number;

  shopCaseHoursDaily: number;
  shopDaily: number;
  dailyPlayRewardHours: number;
  dailyPlayRewardDaily: number;

  growthSupplyBoxHours: number;
  growthSupplyBoxDaily: number;

  totalDaily: number;
  daysToGoal: number | null;
  reachable: boolean;
}

export type MaterialResultMap = Record<MaterialKey, MaterialResult>;

export interface SummaryResult {
  overallDaysToGoal: number | null;
  overallReachable: boolean;
  bottleneckMaterials: MaterialKey[];
  growthSupplyBox: GrowthSupplyBoxResult;
}

export interface SyncLevelPlanResult {
  materials: MaterialResultMap;
  summary: SummaryResult;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface CalculationFailure {
  ok: false;
  errors: ValidationError[];
}

export interface CalculationSuccess {
  ok: true;
  result: SyncLevelPlanResult;
}

export type CalculationResponse = CalculationFailure | CalculationSuccess;

export interface DisplayMaterialRow {
  key: MaterialKey;
  label: string;
  required: number;
  ownedDirect: number;
  ownedCaseHours: number;
  ownedConvertedFromCases: number;
  effectiveOwned: number;
  remaining: number;
  autoHourly: number;
  baseDaily: number;
  wipeoutDaily: number;
  dailyPlayRewardHours: number;
  dailyPlayRewardDaily: number;
  shopDirect: number;
  shopCaseHoursDaily: number;
  shopDaily: number;
  growthSupplyBoxHours: number;
  growthSupplyBoxDaily: number;
  totalDaily: number;
  daysToGoal: number | null;
  daysToGoalText: string;
  roundedUpDaysToGoal: number | null;
  roundedUpPeriodText: string;
  reachable: boolean;
}

export interface DisplaySummary {
  overallDaysToGoal: number | null;
  overallDaysToGoalText: string;
  overallRoundedUpDaysToGoal: number | null;
  overallPeriodText: string;
  overallReachable: boolean;
  bottleneckMaterials: MaterialKey[];
  bottleneckLabels: string[];
  growthSupplyBox: {
    enabled: boolean;
    modeLabel: string;
    selectedLabel: string;
    addedHoursText: string;
    addedMaterialsText: string;
    usedBoxCountText: string;
  };
}

export interface DisplayResult {
  rows: DisplayMaterialRow[];
  summary: DisplaySummary;
}

export const DAILY_PLAY_REWARD_HOURS: MaterialMap = {
  battle_data: 47.14,
  credit: 38.4,
  core_dust: 49.15,
};

export const DAILY_PLAY_REWARD_DESCRIPTION = `
内訳：クレジット38.4時間分、バトルデータ47.14時間分、コアダスト49.15時間分<br>
デイリープレイ報酬とは、各コンテンツによる収入の見込みを一日当たりに均したものです。<br>
含むコンテンツは以下。
<ul>
<li>シミュレーションルームlv5</li>
<li>アカデミー全開放</li>
<li>デイリーミッション</li>
<li>ウィークリーミッション</li>
<li>イベントデイリーログイン</li>
<li>イベントショップ</li>
<li>イベントステージ報酬</li>
<li>協同作戦ショップ</li>
</ul>
※nikke.gg参照
`;

export const GROWTH_SUPPLY_BOX_HOURS_CHOICES: MaterialMap = {
  battle_data: 10,
  credit: 30,
  core_dust: 10,
};

export function getMaterialKeys(): MaterialKey[] {
  return [...MATERIAL_KEYS];
}

export function createEmptyMaterialMap(): MaterialMap {
  return {
    battle_data: 0,
    credit: 0,
    core_dust: 0,
  };
}

export function createEmptyCaseCountMap(): CaseCountMap {
  return {
    case1h: 0,
    case2h: 0,
    case4h: 0,
    case8h: 0,
    case12h: 0,
    case24h: 0,
  };
}

export function createEmptyMaterialCaseCountMap(): MaterialCaseCountMap {
  return {
    battle_data: createEmptyCaseCountMap(),
    credit: createEmptyCaseCountMap(),
    core_dust: createEmptyCaseCountMap(),
  };
}

export function createDefaultSyncLevelPlanInput(): SyncLevelPlanInput {
  return {
    currentSyncLevel: 201,
    targetSyncLevel: 202,
    baseDefenseLevel: 1,
    wipeoutCount: 0,
    enableDailyPlayReward: false,
    ownedDirectMaterials: createEmptyMaterialMap(),
    ownedCaseCounts: createEmptyMaterialCaseCountMap(),
    growthSupplyBox: {
      enabled: false,
      mode: "fixed",
      fixedTarget: "core_dust",
    },
    selectedShopItemIds: [],
  };
}

export function mapMaterials(
  fn: (material: MaterialKey) => number,
): MaterialMap {
  return {
    battle_data: fn("battle_data"),
    credit: fn("credit"),
    core_dust: fn("core_dust"),
  };
}

export function validateFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function addMaterialMaps(a: MaterialMap, b: MaterialMap): MaterialMap {
  return mapMaterials((material) => a[material] + b[material]);
}

export function subtractMaterialMaps(a: MaterialMap, b: MaterialMap): MaterialMap {
  return mapMaterials((material) => a[material] - b[material]);
}

export function maxMaterialMapWithZero(materialMap: MaterialMap): MaterialMap {
  return mapMaterials((material) => Math.max(0, materialMap[material]));
}

export function sumMaterialMaps(...maps: MaterialMap[]): MaterialMap {
  return maps.reduce((acc, current) => addMaterialMaps(acc, current), createEmptyMaterialMap());
}

export function convertBaseDefenseRowToMaterialMap(
  row: BaseDefenseIncomeRow,
): MaterialMap {
  return {
    battle_data: row.battle_data_per_hour,
    credit: row.credit_per_hour,
    core_dust: row.core_dust_per_hour,
  };
}

export function convertCaseCountsToHours(caseCounts: CaseCountMap): number {
  return (
    caseCounts.case1h * 1 +
    caseCounts.case2h * 2 +
    caseCounts.case4h * 4 +
    caseCounts.case8h * 8 +
    caseCounts.case12h * 12 +
    caseCounts.case24h * 24
  );
}

export function convertMaterialCaseCountsToHours(
  caseCounts: MaterialCaseCountMap,
): MaterialMap {
  return mapMaterials((material) => convertCaseCountsToHours(caseCounts[material]));
}

export function convertTimedHoursToMaterials(
  timedHours: MaterialMap,
  autoIncomePerHour: MaterialMap,
): MaterialMap {
  return mapMaterials(
    (material) => timedHours[material] * autoIncomePerHour[material],
  );
}

export function validateMaterialMap(
  materialMap: MaterialMap,
  fieldName: string,
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const material of MATERIAL_KEYS) {
    const value = materialMap[material];

    if (!validateFiniteNumber(value)) {
      errors.push({
        field: `${fieldName}.${material}`,
        message: `${fieldName}.${material} は有限数である必要があります`,
      });
      continue;
    }

    if (value < 0) {
      errors.push({
        field: `${fieldName}.${material}`,
        message: `${fieldName}.${material} は0以上である必要があります`,
      });
    }
  }

  return errors;
}

export function validateCaseCountMap(
  caseCountMap: CaseCountMap,
  fieldName: string,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const entries = Object.entries(caseCountMap) as Array<[keyof CaseCountMap, number]>;

  for (const [key, value] of entries) {
    if (!validateFiniteNumber(value)) {
      errors.push({
        field: `${fieldName}.${key}`,
        message: `${fieldName}.${key} は有限数である必要があります`,
      });
      continue;
    }

    if (value < 0) {
      errors.push({
        field: `${fieldName}.${key}`,
        message: `${fieldName}.${key} は0以上である必要があります`,
      });
    }
  }

  return errors;
}

export function validateMaterialCaseCountMap(
  materialCaseCountMap: MaterialCaseCountMap,
  fieldName: string,
): ValidationError[] {
  return MATERIAL_KEYS.flatMap((material) =>
    validateCaseCountMap(materialCaseCountMap[material], `${fieldName}.${material}`),
  );
}

export function validateInput(
  input: SyncLevelPlanInput,
  masterData: MasterData,
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!validateFiniteNumber(input.currentSyncLevel)) {
    errors.push({
      field: "currentSyncLevel",
      message: "currentSyncLevel は有限数である必要があります",
    });
  }

  if (!validateFiniteNumber(input.targetSyncLevel)) {
    errors.push({
      field: "targetSyncLevel",
      message: "targetSyncLevel は有限数である必要があります",
    });
  }

  if (
    validateFiniteNumber(input.currentSyncLevel) &&
    validateFiniteNumber(input.targetSyncLevel) &&
    input.currentSyncLevel >= input.targetSyncLevel
  ) {
    errors.push({
      field: "targetSyncLevel",
      message: "目標のシンクロレベルは現在のシンクロレベルより大きい必要があります",
    });
  }

  if (!validateFiniteNumber(input.baseDefenseLevel)) {
    errors.push({
      field: "baseDefenseLevel",
      message: "基地防衛レベルは有限数である必要があります",
    });
  }

  if (!validateFiniteNumber(input.wipeoutCount)) {
    errors.push({
      field: "wipeoutCount",
      message: "まとめて殲滅回数は有限数である必要があります",
    });
  } else {
    if (!Number.isInteger(input.wipeoutCount)) {
      errors.push({
        field: "wipeoutCount",
        message: "まとめて殲滅回数は整数である必要があります",
      });
    }

    if (input.wipeoutCount < 0 || input.wipeoutCount > 11) {
      errors.push({
        field: "wipeoutCount",
        message: "まとめて殲滅回数は0以上11以下である必要があります",
      });
    }
  }

  errors.push(...validateMaterialMap(input.ownedDirectMaterials, "ownedDirectMaterials"));
  errors.push(...validateMaterialCaseCountMap(input.ownedCaseCounts, "ownedCaseCounts"));

  const baseDefenseRow = masterData.baseDefenseIncome.find(
    (row) => row.level === input.baseDefenseLevel,
  );

  if (!baseDefenseRow) {
    errors.push({
      field: "baseDefenseLevel",
      message: `基地防衛レベル ${input.baseDefenseLevel} に対応するデータがありません`,
    });
  }

  if (
    validateFiniteNumber(input.currentSyncLevel) &&
    validateFiniteNumber(input.targetSyncLevel) &&
    input.currentSyncLevel < input.targetSyncLevel
  ) {
    for (let level = input.currentSyncLevel; level < input.targetSyncLevel; level += 1) {
      const requirementRow = masterData.levelRequirements.find((row) => row.level === level);
      if (!requirementRow) {
        errors.push({
          field: "levelRequirements",
          message: `レベル ${level} の必要素材データがありません`,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function calculateRequiredMaterials(
  input: SyncLevelPlanInput,
  masterData: MasterData,
): MaterialMap {
  const result = createEmptyMaterialMap();

  for (let level = input.currentSyncLevel; level < input.targetSyncLevel; level += 1) {
    const row = masterData.levelRequirements.find((item) => item.level === level);
    if (!row) {
      throw new Error(`レベル ${level} の必要素材データが見つかりません`);
    }

    for (const material of MATERIAL_KEYS) {
      result[material] += row[material];
    }
  }

  return result;
}

export function getAutoIncomePerHour(
  baseDefenseLevel: number,
  masterData: MasterData,
): MaterialMap {
  const row = masterData.baseDefenseIncome.find((item) => item.level === baseDefenseLevel);
  if (!row) {
    throw new Error(`基地防衛レベル ${baseDefenseLevel} の時給データが見つかりません`);
  }

  return convertBaseDefenseRowToMaterialMap(row);
}

export function convertHourlyToDaily(hourlyIncome: MaterialMap): MaterialMap {
  return mapMaterials((material) => hourlyIncome[material] * 24);
}

export function calculateWipeoutIncome(
  wipeoutCount: number,
  autoIncomePerHour: MaterialMap,
): MaterialMap {
  return mapMaterials((material) => autoIncomePerHour[material] * 2 * wipeoutCount);
}

export function calculateOwnedCaseHours(
  ownedCaseCounts: MaterialCaseCountMap,
): MaterialMap {
  return convertMaterialCaseCountsToHours(ownedCaseCounts);
}

export function calculateOwnedConvertedFromCases(
  ownedCaseCounts: MaterialCaseCountMap,
  autoIncomePerHour: MaterialMap,
): MaterialMap {
  return convertTimedHoursToMaterials(
    calculateOwnedCaseHours(ownedCaseCounts),
    autoIncomePerHour,
  );
}

export function calculateEffectiveOwnedMaterials(
  ownedDirectMaterials: MaterialMap,
  ownedCaseCounts: MaterialCaseCountMap,
  autoIncomePerHour: MaterialMap,
): MaterialMap {
  return addMaterialMaps(
    ownedDirectMaterials,
    calculateOwnedConvertedFromCases(ownedCaseCounts, autoIncomePerHour),
  );
}

export function calculateRemainingMaterials(
  required: MaterialMap,
  effectiveOwned: MaterialMap,
): MaterialMap {
  return maxMaterialMapWithZero(subtractMaterialMaps(required, effectiveOwned));
}

export function calculateDailyPlayRewardHours(enabled: boolean): MaterialMap {
  if (!enabled) {
    return createEmptyMaterialMap();
  }

  return { ...DAILY_PLAY_REWARD_HOURS };
}

export function calculateDailyPlayRewardDaily(
  enabled: boolean,
  autoIncomePerHour: MaterialMap,
): MaterialMap {
  return convertTimedHoursToMaterials(
    calculateDailyPlayRewardHours(enabled),
    autoIncomePerHour,
  );
}

export function calculateDaysToGoal(
  remaining: MaterialMap,
  totalDaily: MaterialMap,
): Record<MaterialKey, GoalDayInfo> {
  return {
    battle_data: calculateSingleGoalDayInfo(remaining.battle_data, totalDaily.battle_data),
    credit: calculateSingleGoalDayInfo(remaining.credit, totalDaily.credit),
    core_dust: calculateSingleGoalDayInfo(remaining.core_dust, totalDaily.core_dust),
  };
}

function calculateSingleGoalDayInfo(remaining: number, totalDaily: number): GoalDayInfo {
  if (remaining <= 0) {
    return { days: 0, reachable: true };
  }

  if (totalDaily <= 0) {
    return { days: null, reachable: false };
  }

  return {
    days: remaining / totalDaily,
    reachable: true,
  };
}

export function calculateGrowthSupplyBoxDaily(
  input: GrowthSupplyBoxInput,
  remaining: MaterialMap,
  autoIncomePerHour: MaterialMap,
  provisionalTotalDaily: MaterialMap,
): { daily: MaterialMap; result: GrowthSupplyBoxResult } {
  if (!input.enabled) {
    return {
      daily: createEmptyMaterialMap(),
      result: {
        enabled: false,
        mode: input.mode,
        selectedMaterial: null,
        addedHours: 0,
        addedMaterials: 0,
      },
    };
  }

  const selectedMaterial =
    input.mode === "fixed"
      ? input.fixedTarget
      : findMaterialWithLongestDays(remaining, provisionalTotalDaily);

  if (selectedMaterial == null) {
    return {
      daily: createEmptyMaterialMap(),
      result: {
        enabled: true,
        mode: input.mode,
        selectedMaterial: null,
        addedHours: 0,
        addedMaterials: 0,
      },
    };
  }

  const addedHours = GROWTH_SUPPLY_BOX_HOURS_CHOICES[selectedMaterial];
  const addedMaterials = addedHours * autoIncomePerHour[selectedMaterial];
  const daily = createEmptyMaterialMap();
  daily[selectedMaterial] = addedMaterials;

  return {
    daily,
    result: {
      enabled: true,
      mode: input.mode,
      selectedMaterial,
      addedHours,
      addedMaterials,
    },
  };
}

export function findMaterialWithLongestDays(
  remaining: MaterialMap,
  totalDaily: MaterialMap,
): MaterialKey | null {
  const dayInfo = calculateDaysToGoal(remaining, totalDaily);
  const candidates = MATERIAL_KEYS.filter((material) => remaining[material] > 0);

  if (candidates.length === 0) {
    return null;
  }

  return candidates.reduce((maxMaterial, current) => {
    const maxDays = dayInfo[maxMaterial].reachable
      ? (dayInfo[maxMaterial].days ?? 0)
      : Number.POSITIVE_INFINITY;
    const currentDays = dayInfo[current].reachable
      ? (dayInfo[current].days ?? 0)
      : Number.POSITIVE_INFINITY;

    return currentDays > maxDays ? current : maxMaterial;
  });
}

export function calculateTotalDailyIncome(
  baseDaily: MaterialMap,
  wipeoutDaily: MaterialMap,
  dailyPlayRewardDaily: MaterialMap,
  growthSupplyBoxDaily: MaterialMap,
): MaterialMap {
  return sumMaterialMaps(
    baseDaily,
    wipeoutDaily,
    dailyPlayRewardDaily,
    growthSupplyBoxDaily,
  );
}

export function calculateMaterialResults(params: {
  required: MaterialMap;
  ownedDirectMaterials: MaterialMap;
  ownedCaseHours: MaterialMap;
  ownedConvertedFromCases: MaterialMap;
  effectiveOwned: MaterialMap;
  remaining: MaterialMap;
  autoHourly: MaterialMap;
  baseDaily: MaterialMap;
  wipeoutDaily: MaterialMap;
  dailyPlayRewardHours: MaterialMap;
  dailyPlayRewardDaily: MaterialMap;
  shopDirectMaterials: MaterialMap;
  shopCaseHoursDaily: MaterialMap;
  shopDaily: MaterialMap;
  growthSupplyBoxResult: GrowthSupplyBoxResult;
  growthSupplyBoxDaily: MaterialMap;
  totalDaily: MaterialMap;
}): MaterialResultMap {
  const goalDays = calculateDaysToGoal(params.remaining, params.totalDaily);

  return {
    battle_data: buildMaterialResult("battle_data", params, goalDays),
    credit: buildMaterialResult("credit", params, goalDays),
    core_dust: buildMaterialResult("core_dust", params, goalDays),
  };
}

function buildMaterialResult(
  material: MaterialKey,
  params: {
    required: MaterialMap;
    ownedDirectMaterials: MaterialMap;
    ownedCaseHours: MaterialMap;
    ownedConvertedFromCases: MaterialMap;
    effectiveOwned: MaterialMap;
    remaining: MaterialMap;
    autoHourly: MaterialMap;
    baseDaily: MaterialMap;
    wipeoutDaily: MaterialMap;
    dailyPlayRewardHours: MaterialMap;
    dailyPlayRewardDaily: MaterialMap;
    shopDirectMaterials: MaterialMap;
    shopCaseHoursDaily: MaterialMap;
    shopDaily: MaterialMap;
    growthSupplyBoxResult: GrowthSupplyBoxResult;
    growthSupplyBoxDaily: MaterialMap;
    totalDaily: MaterialMap;
  },
  goalDays: Record<MaterialKey, GoalDayInfo>,
): MaterialResult {
  return {
    required: params.required[material],
    ownedDirect: params.ownedDirectMaterials[material],
    ownedCaseHours: params.ownedCaseHours[material],
    ownedConvertedFromCases: params.ownedConvertedFromCases[material],
    effectiveOwned: params.effectiveOwned[material],
    remaining: params.remaining[material],
    autoHourly: params.autoHourly[material],
    baseDaily: params.baseDaily[material],
    wipeoutDaily: params.wipeoutDaily[material],
    dailyPlayRewardHours: params.dailyPlayRewardHours[material],
    dailyPlayRewardDaily: params.dailyPlayRewardDaily[material],
    shopDirect: params.shopDirectMaterials[material],

    shopCaseHoursDaily: params.shopCaseHoursDaily[material],
    shopDaily: params.shopDaily[material],
    growthSupplyBoxHours:
      params.growthSupplyBoxResult.selectedMaterial === material
        ? params.growthSupplyBoxResult.addedHours
        : 0,
    growthSupplyBoxDaily: params.growthSupplyBoxDaily[material],
    totalDaily: params.totalDaily[material],
    daysToGoal: goalDays[material].days,
    reachable: goalDays[material].reachable,
  };
}

export function findBottleneckMaterials(
  materialResults: MaterialResultMap,
): MaterialKey[] {
  const unreachableMaterials = MATERIAL_KEYS.filter(
    (material) => !materialResults[material].reachable,
  );

  if (unreachableMaterials.length > 0) {
    return unreachableMaterials;
  }

  const maxDays = Math.max(
    ...MATERIAL_KEYS.map((material) => materialResults[material].daysToGoal ?? 0),
  );

  return MATERIAL_KEYS.filter(
    (material) => (materialResults[material].daysToGoal ?? 0) === maxDays,
  );
}

export function calculateSummary(
  materialResults: MaterialResultMap,
  growthSupplyBox: GrowthSupplyBoxResult,
): SummaryResult {
  const overallReachable = MATERIAL_KEYS.every(
    (material) => materialResults[material].reachable,
  );

  if (!overallReachable) {
    return {
      overallDaysToGoal: null,
      overallReachable: false,
      bottleneckMaterials: findBottleneckMaterials(materialResults),
      growthSupplyBox,
    };
  }

  const overallDaysToGoal = Math.max(
    ...MATERIAL_KEYS.map((material) => materialResults[material].daysToGoal ?? 0),
  );

  return {
    overallDaysToGoal,
    overallReachable: true,
    bottleneckMaterials: findBottleneckMaterials(materialResults),
    growthSupplyBox,
  };
}

export function buildResult(
  materialResults: MaterialResultMap,
  summary: SummaryResult,
): SyncLevelPlanResult {
  return {
    materials: materialResults,
    summary,
  };
}

export function calculateSyncLevelPlan(
  input: SyncLevelPlanInput,
  masterData: MasterData,
): SyncLevelPlanResult {
  const validation = validateInput(input, masterData);
  if (!validation.valid) {
    throw new Error(
      `入力エラー:
        ${validation.errors
        .map((error) => `- ${error.field}: ${error.message}`)
        .join("")}`,
    );
  }

  const required = calculateRequiredMaterials(input, masterData);
  const autoHourly = getAutoIncomePerHour(input.baseDefenseLevel, masterData);
  const baseDaily = convertHourlyToDaily(autoHourly);
  const wipeoutDaily = calculateWipeoutIncome(input.wipeoutCount, autoHourly);

  const shopDirectMaterials = calculateShopDirectMaterials(
    input.selectedShopItemIds,
  );
  const shopCaseHoursDaily = calculateShopCaseCounts1hDaily(
    input.selectedShopItemIds,
  );
  const shopDaily = convertTimedHoursToMaterials(
    shopCaseHoursDaily,
    autoHourly,
  );
  const ownedCaseHours = calculateOwnedCaseHours(input.ownedCaseCounts);
  const ownedConvertedFromCases = convertTimedHoursToMaterials(ownedCaseHours, autoHourly);
  const effectiveOwned = sumMaterialMaps(input.ownedDirectMaterials, ownedConvertedFromCases, shopDirectMaterials, );
  const remaining = calculateRemainingMaterials(required, effectiveOwned);

  const dailyPlayRewardHours = calculateDailyPlayRewardHours(input.enableDailyPlayReward);
  const dailyPlayRewardDaily = convertTimedHoursToMaterials(
    dailyPlayRewardHours,
    autoHourly,
  );

  const provisionalTotalDaily = calculateTotalDailyIncome(
    sumMaterialMaps(baseDaily, shopDaily),
    wipeoutDaily,
    dailyPlayRewardDaily,
    createEmptyMaterialMap(),
  );

  const growthSupplyBoxAllocation = calculateGrowthSupplyBoxDaily(
    input.growthSupplyBox,
    remaining,
    autoHourly,
    provisionalTotalDaily,
  );

  const totalDaily = calculateTotalDailyIncome(
    sumMaterialMaps(baseDaily, shopDaily),
    wipeoutDaily,
    dailyPlayRewardDaily,
    growthSupplyBoxAllocation.daily,
  );

  const materialResults = calculateMaterialResults({
    required,
    ownedDirectMaterials: input.ownedDirectMaterials,
    ownedCaseHours,
    ownedConvertedFromCases,
    effectiveOwned,
    remaining,
    autoHourly,
    baseDaily,
    wipeoutDaily,
    dailyPlayRewardHours,
    dailyPlayRewardDaily,
    shopDirectMaterials,
    shopCaseHoursDaily,
    shopDaily,
    growthSupplyBoxResult: growthSupplyBoxAllocation.result,
    growthSupplyBoxDaily: growthSupplyBoxAllocation.daily,
    totalDaily,
  });

  const summary = calculateSummary(
    materialResults,
    growthSupplyBoxAllocation.result,
  );

  return buildResult(materialResults, summary);
}

export function calculateSyncLevelPlanSafe(
  input: SyncLevelPlanInput,
  masterData: MasterData,
): CalculationResponse {
  const validation = validateInput(input, masterData);
  if (!validation.valid) {
    return {
      ok: false,
      errors: validation.errors,
    };
  }

  return {
    ok: true,
    result: calculateSyncLevelPlan(input, masterData),
  };
}

export function formatNumber(value: number, fractionDigits = 2): string {
  return new Intl.NumberFormat("ja-JP", {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatDays(value: number | null, fractionDigits = 2): string {
  if (value == null) {
    return "達成不可";
  }

  return `${formatNumber(value, fractionDigits)}日`;
}

export function roundUpDays(value: number | null): number | null {
  if (value == null) {
    return null;
  }
  return Math.ceil(value);
}

export function formatRoundedPeriod(value: number | null): string {
  if (value == null) {
    return "達成不可";
  }

  const totalDays = Math.ceil(value);
  const years = Math.floor(totalDays / 365);
  const remainingAfterYears = totalDays % 365;
  const months = Math.floor(remainingAfterYears / 30);
  const days = remainingAfterYears % 30;

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years}年`);
  }

  if (months > 0) {
    parts.push(`${months}か月`);
  }

  if (days > 0 || parts.length === 0) {
    parts.push(`${days}日`);
  }

  return parts.join("");
}

export function toDisplayMaterialRow(
  material: MaterialKey,
  result: MaterialResult,
): DisplayMaterialRow {
  return {
    key: material,
    label: MATERIAL_LABELS[material],
    required: result.required,
    ownedDirect: result.ownedDirect,
    ownedCaseHours: result.ownedCaseHours,
    ownedConvertedFromCases: result.ownedConvertedFromCases,
    effectiveOwned: result.effectiveOwned,
    remaining: result.remaining,
    autoHourly: result.autoHourly,
    baseDaily: result.baseDaily,
    wipeoutDaily: result.wipeoutDaily,
    dailyPlayRewardHours: result.dailyPlayRewardHours,
    dailyPlayRewardDaily: result.dailyPlayRewardDaily,
    shopDirect: result.shopDirect,
    shopCaseHoursDaily: result.shopCaseHoursDaily,
    shopDaily: result.shopDaily,
    growthSupplyBoxHours: result.growthSupplyBoxHours,
    growthSupplyBoxDaily: result.growthSupplyBoxDaily,
    totalDaily: result.totalDaily,
    daysToGoal: result.daysToGoal,
    daysToGoalText: formatDays(result.daysToGoal),
    roundedUpDaysToGoal: roundUpDays(result.daysToGoal),
    roundedUpPeriodText: formatRoundedPeriod(result.daysToGoal),
    reachable: result.reachable,
  };
}

export function toDisplaySummary(summary: SummaryResult): DisplaySummary {
  return {
    overallDaysToGoal: summary.overallDaysToGoal,
    overallDaysToGoalText: formatDays(summary.overallDaysToGoal),
    overallRoundedUpDaysToGoal: roundUpDays(summary.overallDaysToGoal),
    overallPeriodText:
      summary.overallDaysToGoal == null
        ? "達成不可"
        : `${roundUpDays(summary.overallDaysToGoal)}日（${formatRoundedPeriod(summary.overallDaysToGoal)}）`,
    overallReachable: summary.overallReachable,
    bottleneckMaterials: [...summary.bottleneckMaterials],
    bottleneckLabels: summary.bottleneckMaterials.map(
      (material) => MATERIAL_LABELS[material],
    ),
    growthSupplyBox: {
      enabled: summary.growthSupplyBox.enabled,
      modeLabel:
        summary.growthSupplyBox.mode === "fixed"
          ? "選択した素材に固定"
          : "到達日数が最も長い素材へ配分",
      selectedLabel:
        summary.growthSupplyBox.selectedMaterial == null
          ? "なし"
          : MATERIAL_LABELS[summary.growthSupplyBox.selectedMaterial],
      addedHoursText: `${formatNumber(summary.growthSupplyBox.addedHours, 2)}時間`,
      addedMaterialsText: formatNumber(summary.growthSupplyBox.addedMaterials, 2),
      usedBoxCountText:
        !summary.growthSupplyBox.enabled ||
        summary.growthSupplyBox.selectedMaterial == null
          ? "0個"
          : `${formatNumber(
              summary.growthSupplyBox.addedHours /
                GROWTH_SUPPLY_BOX_HOURS_CHOICES[summary.growthSupplyBox.selectedMaterial],
              0,
            )}個`,
    },
  };
}

export function toDisplayResult(result: SyncLevelPlanResult): DisplayResult {
  return {
    rows: MATERIAL_KEYS.map((material) =>
      toDisplayMaterialRow(material, result.materials[material]),
    ),
    summary: toDisplaySummary(result.summary),
  };
}

export function calculateDisplayResult(
  input: SyncLevelPlanInput,
  masterData: MasterData,
): DisplayResult {
  return toDisplayResult(calculateSyncLevelPlan(input, masterData));
}

export type DisplayCalculationResponse =
  | CalculationFailure
  | { ok: true; displayResult: DisplayResult };

export function calculateDisplayResultSafe(
  input: SyncLevelPlanInput,
  masterData: MasterData,
): DisplayCalculationResponse {
  const response = calculateSyncLevelPlanSafe(input, masterData);

  if (!response.ok) {
    return response;
  }

  return {
    ok: true,
    displayResult: toDisplayResult(response.result),
  };
}

/**
 * デバッグ用: 計算内訳をテキスト形式で生成
 */
export function buildDebugLog(display: DisplayResult): string {
  const lines: string[] = [];

  for (const row of display.rows) {
    lines.push(`\n[${row.label}]\n`);

    lines.push(`必要量: ${row.required}\n`);
    lines.push(`直接保有: ${row.ownedDirect}\n`);

    lines.push(
      `ケース換算: ${row.ownedCaseHours}h × 時給(${row.autoHourly}) = ${row.ownedConvertedFromCases}\n`,
    );
    if (row.shopDirect > 0) {
      lines.push(`商品直接加算: ${row.shopDirect}\n`);
    }
    lines.push(`実質保有: ${row.effectiveOwned}\n`);

    lines.push(`残必要量: ${row.remaining}\n`);

    lines.push(
      `基本日次: ${row.autoHourly} × 24 = ${row.baseDaily}\n`,
    );

    lines.push(`殲滅日次: ${row.wipeoutDaily}\n`);

    if (row.dailyPlayRewardHours > 0) {
      lines.push(
        `デイリープレイ: ${row.dailyPlayRewardHours}h × ${row.autoHourly} = ${row.dailyPlayRewardDaily}\n`,
      );
    }
    if (row.shopCaseHoursDaily > 0 || row.shopDaily > 0) {
      lines.push(
        `商品日次: ${row.shopCaseHoursDaily}h × ${row.autoHourly} = ${row.shopDaily}\n`,
      );
    }
    if (row.growthSupplyBoxHours > 0) {
      lines.push(
        `30-day補給箱: ${row.growthSupplyBoxHours}h × ${row.autoHourly} = ${row.growthSupplyBoxDaily}\n`,
      );
    }

    lines.push(`総日次: ${row.totalDaily}\n`);

    if (row.daysToGoal != null) {
      lines.push(
        `到達日数: ${row.remaining} ÷ ${row.totalDaily} = ${row.daysToGoal}\n`,
      );
    } else {
      lines.push(`到達日数: 達成不可\n`);
    }

    lines.push("");
  }

  lines.push("---- SUMMARY ----\n");

  lines.push(`総合到達日数: ${display.summary.overallDaysToGoalText}\n`);
  lines.push(`ボトルネック: ${display.summary.bottleneckLabels.join(", ")}\n`);

  const box = display.summary.growthSupplyBox;

  lines.push("---- 30-day成長補給箱 ----\n");
  lines.push(`使用: ${box.enabled}\n`);
  lines.push(`モード: ${box.modeLabel}\n`);
  lines.push(`配分先: ${box.selectedLabel}\n`);
  lines.push(`加算時間: ${box.addedHoursText}\n`);
  lines.push(`加算素材量: ${box.addedMaterialsText}\n`);

  return lines.join("");
}

// ------------------------------
// 商品群定義（第2段階）
// ------------------------------

export type ShopCategory = "daily" | "weekly" | "monthly";

export interface ShopItemReward {
  direct: MaterialMap;
  caseCounts1h: MaterialMap;
}

export interface ShopItem {
  id: string;
  name: string;
  category: ShopCategory;
  reward: ShopItemReward;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "daily_core_dust_pack",
    name: "コアダストパック",
    category: "daily",
    reward: {
      direct: {
        battle_data: 0,
        credit: 0,
        core_dust: 300,
      },
      caseCounts1h: {
        battle_data: 0,
        credit: 0,
        core_dust: 24,
      },
    },
  },
  {
    id: "daily_credit_pack",
    name: "クレジットパック",
    category: "daily",
    reward: {
      direct: {
        battle_data: 0,
        credit: 100000,
        core_dust: 0,
      },
      caseCounts1h: {
        battle_data: 0,
        credit: 60,
        core_dust: 0,
      },
    },
  },
  {
    id: "daily_battle_data_pack",
    name: "バトルデータパック",
    category: "daily",
    reward: {
      direct: createEmptyMaterialMap(),
      caseCounts1h: {
        battle_data: 30,
        credit: 0,
        core_dust: 0,
      },
    },
  },
  {
    id: "daily_perfect_boost_pack",
    name: "パーフェクトブーストパック",
    category: "daily",
    reward: {
      direct: createEmptyMaterialMap(),
      caseCounts1h: {
        battle_data: 48,
        credit: 48,
        core_dust: 48,
      },
    },
  },
  {
    id: "weekly_nikke_grow_up_1",
    name: "ニケグローアップI",
    category: "weekly",
    reward: {
      direct: createEmptyMaterialMap(),
      caseCounts1h: {
        battle_data: 6,
        credit: 6,
        core_dust: 6,
      },
    },
  },
  {
    id: "weekly_nikke_grow_up_2",
    name: "ニケグローアップII",
    category: "weekly",
    reward: {
      direct: createEmptyMaterialMap(),
      caseCounts1h: {
        battle_data: 12,
        credit: 12,
        core_dust: 12,
      },
    },
  },
  {
    id: "weekly_credit_set",
    name: "クレジットセット",
    category: "weekly",
    reward: {
      direct: createEmptyMaterialMap(),
      caseCounts1h: {
        battle_data: 0,
        credit: 150,
        core_dust: 0,
      },
    },
  },
  {
    id: "weekly_core_dust_set",
    name: "コアダストセット",
    category: "weekly",
    reward: {
      direct: createEmptyMaterialMap(),
      caseCounts1h: {
        battle_data: 0,
        credit: 0,
        core_dust: 90,
      },
    },
  },
  {
    id: "weekly_battle_data_set",
    name: "バトルデータセット",
    category: "weekly",
    reward: {
      direct: createEmptyMaterialMap(),
      caseCounts1h: {
        battle_data: 90,
        credit: 0,
        core_dust: 0,
      },
    },
  },
  {
    id: "weekly_module_over_boost",
    name: "モジュールオーバーブースト",
    category: "weekly",
    reward: {
      direct: createEmptyMaterialMap(),
      caseCounts1h: {
        battle_data: 0,
        credit: 150,
        core_dust: 0,
      },
    },
  },
  {
    id: "weekly_nikke_grow_up_4",
    name: "ニケグローアップIV",
    category: "weekly",
    reward: {
      direct: createEmptyMaterialMap(),
      caseCounts1h: {
        battle_data: 96,
        credit: 24,
        core_dust: 96,
      },
    },
  },
  {
    id: "monthly_nikke_double_up_pack",
    name: "ニケダブルアップパック",
    category: "monthly",
    reward: {
      direct: createEmptyMaterialMap(),
      caseCounts1h: {
        battle_data: 0,
        credit: 120,
        core_dust: 120,
      },
    },
  },
  {
    id: "monthly_masters_boost_pack",
    name: "マスターズブーストパック",
    category: "monthly",
    reward: {
      direct: createEmptyMaterialMap(),
      caseCounts1h: {
        battle_data: 90,
        credit: 0,
        core_dust: 0,
      },
    },
  },
];

export function getShopItemsByCategory(category: ShopCategory): ShopItem[] {
  return SHOP_ITEMS.filter((item) => item.category === category);
}

export function getSelectedShopItems(selectedShopItemIds: string[]): ShopItem[] {
  const selectedSet = new Set(selectedShopItemIds);
  return SHOP_ITEMS.filter((item) => selectedSet.has(item.id));
}

export function getShopCategoryProrationDivisor(category: ShopCategory): number {
  switch (category) {
    case "daily":
      return 1;
    case "weekly":
      return 7;
    case "monthly":
      return 30;
  }
}

export function calculateShopDirectMaterials(
  selectedShopItemIds: string[],
): MaterialMap {
  const selectedItems = getSelectedShopItems(selectedShopItemIds);

  return selectedItems.reduce((acc, item) => {
    return addMaterialMaps(acc, item.reward.direct);
  }, createEmptyMaterialMap());
}

export function calculateShopCaseCounts1hDaily(
  selectedShopItemIds: string[],
): MaterialMap {
  const selectedItems = getSelectedShopItems(selectedShopItemIds);

  return selectedItems.reduce((acc, item) => {
    const divisor = getShopCategoryProrationDivisor(item.category);

    const prorated = mapMaterials(
      (material) => item.reward.caseCounts1h[material] / divisor,
    );

    return addMaterialMaps(acc, prorated);
  }, createEmptyMaterialMap());
}

