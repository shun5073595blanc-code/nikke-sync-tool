export type MaterialKey = "battle_data" | "credit" | "core_dust";
export declare const MATERIAL_KEYS: MaterialKey[];
export declare const MATERIAL_LABELS: Record<MaterialKey, string>;
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
export declare const DAILY_PLAY_REWARD_HOURS: MaterialMap;
export declare const DAILY_PLAY_REWARD_DESCRIPTION = "\n\u5185\u8A33\uFF1A\u30AF\u30EC\u30B8\u30C3\u30C838.4\u6642\u9593\u5206\u3001\u30D0\u30C8\u30EB\u30C7\u30FC\u30BF47.14\u6642\u9593\u5206\u3001\u30B3\u30A2\u30C0\u30B9\u30C849.15\u6642\u9593\u5206<br>\n\u30C7\u30A4\u30EA\u30FC\u30D7\u30EC\u30A4\u5831\u916C\u3068\u306F\u3001\u5404\u30B3\u30F3\u30C6\u30F3\u30C4\u306B\u3088\u308B\u53CE\u5165\u306E\u898B\u8FBC\u307F\u3092\u4E00\u65E5\u5F53\u305F\u308A\u306B\u5747\u3057\u305F\u3082\u306E\u3067\u3059\u3002<br>\n\u542B\u3080\u30B3\u30F3\u30C6\u30F3\u30C4\u306F\u4EE5\u4E0B\u3002\n<ul>\n<li>\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3\u30EB\u30FC\u30E0lv5</li>\n<li>\u30A2\u30AB\u30C7\u30DF\u30FC\u5168\u958B\u653E</li>\n<li>\u30C7\u30A4\u30EA\u30FC\u30DF\u30C3\u30B7\u30E7\u30F3</li>\n<li>\u30A6\u30A3\u30FC\u30AF\u30EA\u30FC\u30DF\u30C3\u30B7\u30E7\u30F3</li>\n<li>\u30A4\u30D9\u30F3\u30C8\u30C7\u30A4\u30EA\u30FC\u30ED\u30B0\u30A4\u30F3</li>\n<li>\u30A4\u30D9\u30F3\u30C8\u30B7\u30E7\u30C3\u30D7</li>\n<li>\u30A4\u30D9\u30F3\u30C8\u30B9\u30C6\u30FC\u30B8\u5831\u916C</li>\n<li>\u5354\u540C\u4F5C\u6226\u30B7\u30E7\u30C3\u30D7</li>\n</ul>\n\u203Bnikke.gg\u53C2\u7167\n";
export declare const GROWTH_SUPPLY_BOX_HOURS_CHOICES: MaterialMap;
export declare function getMaterialKeys(): MaterialKey[];
export declare function createEmptyMaterialMap(): MaterialMap;
export declare function createEmptyCaseCountMap(): CaseCountMap;
export declare function createEmptyMaterialCaseCountMap(): MaterialCaseCountMap;
export declare function createDefaultSyncLevelPlanInput(): SyncLevelPlanInput;
export declare function mapMaterials(fn: (material: MaterialKey) => number): MaterialMap;
export declare function validateFiniteNumber(value: unknown): value is number;
export declare function addMaterialMaps(a: MaterialMap, b: MaterialMap): MaterialMap;
export declare function subtractMaterialMaps(a: MaterialMap, b: MaterialMap): MaterialMap;
export declare function maxMaterialMapWithZero(materialMap: MaterialMap): MaterialMap;
export declare function sumMaterialMaps(...maps: MaterialMap[]): MaterialMap;
export declare function convertBaseDefenseRowToMaterialMap(row: BaseDefenseIncomeRow): MaterialMap;
export declare function convertCaseCountsToHours(caseCounts: CaseCountMap): number;
export declare function convertMaterialCaseCountsToHours(caseCounts: MaterialCaseCountMap): MaterialMap;
export declare function convertTimedHoursToMaterials(timedHours: MaterialMap, autoIncomePerHour: MaterialMap): MaterialMap;
export declare function validateMaterialMap(materialMap: MaterialMap, fieldName: string): ValidationError[];
export declare function validateCaseCountMap(caseCountMap: CaseCountMap, fieldName: string): ValidationError[];
export declare function validateMaterialCaseCountMap(materialCaseCountMap: MaterialCaseCountMap, fieldName: string): ValidationError[];
export declare function validateInput(input: SyncLevelPlanInput, masterData: MasterData): ValidationResult;
export declare function calculateRequiredMaterials(input: SyncLevelPlanInput, masterData: MasterData): MaterialMap;
export declare function getAutoIncomePerHour(baseDefenseLevel: number, masterData: MasterData): MaterialMap;
export declare function convertHourlyToDaily(hourlyIncome: MaterialMap): MaterialMap;
export declare function calculateWipeoutIncome(wipeoutCount: number, autoIncomePerHour: MaterialMap): MaterialMap;
export declare function calculateOwnedCaseHours(ownedCaseCounts: MaterialCaseCountMap): MaterialMap;
export declare function calculateOwnedConvertedFromCases(ownedCaseCounts: MaterialCaseCountMap, autoIncomePerHour: MaterialMap): MaterialMap;
export declare function calculateEffectiveOwnedMaterials(ownedDirectMaterials: MaterialMap, ownedCaseCounts: MaterialCaseCountMap, autoIncomePerHour: MaterialMap): MaterialMap;
export declare function calculateRemainingMaterials(required: MaterialMap, effectiveOwned: MaterialMap): MaterialMap;
export declare function calculateDailyPlayRewardHours(enabled: boolean): MaterialMap;
export declare function calculateDailyPlayRewardDaily(enabled: boolean, autoIncomePerHour: MaterialMap): MaterialMap;
export declare function calculateDaysToGoal(remaining: MaterialMap, totalDaily: MaterialMap): Record<MaterialKey, GoalDayInfo>;
export declare function calculateGrowthSupplyBoxDaily(input: GrowthSupplyBoxInput, remaining: MaterialMap, autoIncomePerHour: MaterialMap, provisionalTotalDaily: MaterialMap): {
    daily: MaterialMap;
    result: GrowthSupplyBoxResult;
};
export declare function findMaterialWithLongestDays(remaining: MaterialMap, totalDaily: MaterialMap): MaterialKey | null;
export declare function calculateTotalDailyIncome(baseDaily: MaterialMap, wipeoutDaily: MaterialMap, dailyPlayRewardDaily: MaterialMap, growthSupplyBoxDaily: MaterialMap): MaterialMap;
export declare function calculateMaterialResults(params: {
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
}): MaterialResultMap;
export declare function findBottleneckMaterials(materialResults: MaterialResultMap): MaterialKey[];
export declare function calculateSummary(materialResults: MaterialResultMap, growthSupplyBox: GrowthSupplyBoxResult): SummaryResult;
export declare function buildResult(materialResults: MaterialResultMap, summary: SummaryResult): SyncLevelPlanResult;
export declare function calculateSyncLevelPlan(input: SyncLevelPlanInput, masterData: MasterData): SyncLevelPlanResult;
export declare function calculateSyncLevelPlanSafe(input: SyncLevelPlanInput, masterData: MasterData): CalculationResponse;
export declare function formatNumber(value: number, fractionDigits?: number): string;
export declare function formatDays(value: number | null, fractionDigits?: number): string;
export declare function roundUpDays(value: number | null): number | null;
export declare function formatRoundedPeriod(value: number | null): string;
export declare function toDisplayMaterialRow(material: MaterialKey, result: MaterialResult): DisplayMaterialRow;
export declare function toDisplaySummary(summary: SummaryResult): DisplaySummary;
export declare function toDisplayResult(result: SyncLevelPlanResult): DisplayResult;
export declare function calculateDisplayResult(input: SyncLevelPlanInput, masterData: MasterData): DisplayResult;
export type DisplayCalculationResponse = CalculationFailure | {
    ok: true;
    displayResult: DisplayResult;
};
export declare function calculateDisplayResultSafe(input: SyncLevelPlanInput, masterData: MasterData): DisplayCalculationResponse;
/**
 * デバッグ用: 計算内訳をテキスト形式で生成
 */
export declare function buildDebugLog(display: DisplayResult): string;
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
export declare const SHOP_ITEMS: ShopItem[];
export declare function getShopItemsByCategory(category: ShopCategory): ShopItem[];
export declare function getSelectedShopItems(selectedShopItemIds: string[]): ShopItem[];
export declare function getShopCategoryProrationDivisor(category: ShopCategory): number;
export declare function calculateShopDirectMaterials(selectedShopItemIds: string[]): MaterialMap;
export declare function calculateShopCaseCounts1hDaily(selectedShopItemIds: string[]): MaterialMap;
//# sourceMappingURL=Sync-level-calculator.d.ts.map