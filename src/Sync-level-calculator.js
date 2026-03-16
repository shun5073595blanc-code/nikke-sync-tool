export const MATERIAL_KEYS = [
    "battle_data",
    "credit",
    "core_dust",
];
export const MATERIAL_LABELS = {
    battle_data: "バトルデータ",
    credit: "クレジット",
    core_dust: "コアダスト",
};
export const DAILY_PLAY_REWARD_HOURS = {
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
export const GROWTH_SUPPLY_BOX_HOURS_CHOICES = {
    battle_data: 10,
    credit: 30,
    core_dust: 10,
};
export function getMaterialKeys() {
    return [...MATERIAL_KEYS];
}
export function createEmptyMaterialMap() {
    return {
        battle_data: 0,
        credit: 0,
        core_dust: 0,
    };
}
export function createEmptyCaseCountMap() {
    return {
        case1h: 0,
        case2h: 0,
        case4h: 0,
        case8h: 0,
        case12h: 0,
        case24h: 0,
    };
}
export function createEmptyMaterialCaseCountMap() {
    return {
        battle_data: createEmptyCaseCountMap(),
        credit: createEmptyCaseCountMap(),
        core_dust: createEmptyCaseCountMap(),
    };
}
export function createDefaultSyncLevelPlanInput() {
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
            initialStock: 0,
        },
        selectedShopItemIds: [],
    };
}
export function mapMaterials(fn) {
    return {
        battle_data: fn("battle_data"),
        credit: fn("credit"),
        core_dust: fn("core_dust"),
    };
}
export function validateFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
}
export function addMaterialMaps(a, b) {
    return mapMaterials((material) => a[material] + b[material]);
}
export function subtractMaterialMaps(a, b) {
    return mapMaterials((material) => a[material] - b[material]);
}
export function maxMaterialMapWithZero(materialMap) {
    return mapMaterials((material) => Math.max(0, materialMap[material]));
}
export function sumMaterialMaps(...maps) {
    return maps.reduce((acc, current) => addMaterialMaps(acc, current), createEmptyMaterialMap());
}
export function convertBaseDefenseRowToMaterialMap(row) {
    return {
        battle_data: row.battle_data_per_hour,
        credit: row.credit_per_hour,
        core_dust: row.core_dust_per_hour,
    };
}
export function convertCaseCountsToHours(caseCounts) {
    return (caseCounts.case1h * 1 +
        caseCounts.case2h * 2 +
        caseCounts.case4h * 4 +
        caseCounts.case8h * 8 +
        caseCounts.case12h * 12 +
        caseCounts.case24h * 24);
}
export function convertMaterialCaseCountsToHours(caseCounts) {
    return mapMaterials((material) => convertCaseCountsToHours(caseCounts[material]));
}
export function convertTimedHoursToMaterials(timedHours, autoIncomePerHour) {
    return mapMaterials((material) => timedHours[material] * autoIncomePerHour[material]);
}
export function validateMaterialMap(materialMap, fieldName) {
    const errors = [];
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
export function validateCaseCountMap(caseCountMap, fieldName) {
    const errors = [];
    const entries = Object.entries(caseCountMap);
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
export function validateMaterialCaseCountMap(materialCaseCountMap, fieldName) {
    return MATERIAL_KEYS.flatMap((material) => validateCaseCountMap(materialCaseCountMap[material], `${fieldName}.${material}`));
}
export function validateInput(input, masterData) {
    const errors = [];
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
    if (validateFiniteNumber(input.currentSyncLevel) &&
        validateFiniteNumber(input.targetSyncLevel) &&
        input.currentSyncLevel >= input.targetSyncLevel) {
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
    }
    else {
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
    if (!validateFiniteNumber(input.growthSupplyBox.initialStock)) {
        errors.push({
            field: "growthSupplyBox.initialStock",
            message: "保持中の30-day成長補給箱数は有限数である必要があります",
        });
    }
    else {
        if (!Number.isInteger(input.growthSupplyBox.initialStock)) {
            errors.push({
                field: "growthSupplyBox.initialStock",
                message: "保持中の30-day成長補給箱数は整数である必要があります",
            });
        }
        if (input.growthSupplyBox.initialStock < 0) {
            errors.push({
                field: "growthSupplyBox.initialStock",
                message: "保持中の30-day成長補給箱数は0以上である必要があります",
            });
        }
    }
    const baseDefenseRow = masterData.baseDefenseIncome.find((row) => row.level === input.baseDefenseLevel);
    if (!baseDefenseRow) {
        errors.push({
            field: "baseDefenseLevel",
            message: `基地防衛レベル ${input.baseDefenseLevel} に対応するデータがありません`,
        });
    }
    if (validateFiniteNumber(input.currentSyncLevel) &&
        validateFiniteNumber(input.targetSyncLevel) &&
        input.currentSyncLevel < input.targetSyncLevel) {
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
export function calculateRequiredMaterials(input, masterData) {
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
export function getAutoIncomePerHour(baseDefenseLevel, masterData) {
    const row = masterData.baseDefenseIncome.find((item) => item.level === baseDefenseLevel);
    if (!row) {
        throw new Error(`基地防衛レベル ${baseDefenseLevel} の時給データが見つかりません`);
    }
    return convertBaseDefenseRowToMaterialMap(row);
}
export function convertHourlyToDaily(hourlyIncome) {
    return mapMaterials((material) => hourlyIncome[material] * 24);
}
export function calculateWipeoutIncome(wipeoutCount, autoIncomePerHour) {
    return mapMaterials((material) => autoIncomePerHour[material] * 2 * wipeoutCount);
}
export function calculateOwnedCaseHours(ownedCaseCounts) {
    return convertMaterialCaseCountsToHours(ownedCaseCounts);
}
export function calculateOwnedConvertedFromCases(ownedCaseCounts, autoIncomePerHour) {
    return convertTimedHoursToMaterials(calculateOwnedCaseHours(ownedCaseCounts), autoIncomePerHour);
}
export function calculateEffectiveOwnedMaterials(ownedDirectMaterials, ownedCaseCounts, autoIncomePerHour) {
    return addMaterialMaps(ownedDirectMaterials, calculateOwnedConvertedFromCases(ownedCaseCounts, autoIncomePerHour));
}
export function calculateRemainingMaterials(required, effectiveOwned) {
    return maxMaterialMapWithZero(subtractMaterialMaps(required, effectiveOwned));
}
export function calculateDailyPlayRewardHours(enabled) {
    if (!enabled) {
        return createEmptyMaterialMap();
    }
    return { ...DAILY_PLAY_REWARD_HOURS };
}
export function calculateDailyPlayRewardDaily(enabled, autoIncomePerHour) {
    return convertTimedHoursToMaterials(calculateDailyPlayRewardHours(enabled), autoIncomePerHour);
}
export function calculateDaysToGoal(remaining, totalDaily) {
    return {
        battle_data: calculateSingleGoalDayInfo(remaining.battle_data, totalDaily.battle_data),
        credit: calculateSingleGoalDayInfo(remaining.credit, totalDaily.credit),
        core_dust: calculateSingleGoalDayInfo(remaining.core_dust, totalDaily.core_dust),
    };
}
function calculateSingleGoalDayInfo(remaining, totalDaily) {
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
function getGrowthSupplyBoxGainByMaterial(autoIncomePerHour, material) {
    const gain = createEmptyMaterialMap();
    gain[material] =
        autoIncomePerHour[material] * GROWTH_SUPPLY_BOX_HOURS_CHOICES[material];
    return gain;
}
function calculateOverallGoalDaysFromState(remaining, totalDaily) {
    const dayInfo = calculateDaysToGoal(remaining, totalDaily);
    const unreachable = MATERIAL_KEYS.some((material) => !dayInfo[material].reachable);
    if (unreachable) {
        return null;
    }
    return Math.max(...MATERIAL_KEYS.map((material) => dayInfo[material].days ?? 0));
}
function compareGrowthSupplyBoxActionPriority(a, b) {
    const order = [
        "core_dust",
        "credit",
        "battle_data",
        "unused",
    ];
    return order.indexOf(a) - order.indexOf(b);
}
export function calculateGrowthSupplyBoxDaily(input, remaining, autoIncomePerHour, provisionalTotalDaily) {
    if (!input.enabled) {
        return {
            daily: createEmptyMaterialMap(),
            result: {
                enabled: false,
                mode: input.mode,
                selectedMaterial: null,
                addedHours: 0,
                addedMaterials: 0,
                initialStock: input.initialStock,
                usedCountByMaterial: {
                    battle_data: 0,
                    credit: 0,
                    core_dust: 0,
                },
                allocationSummary: {
                    battle_data: 0,
                    credit: 0,
                    core_dust: 0,
                    unused: input.initialStock,
                },
                dailyLog: [],
            },
        };
    }
    if (input.mode === "fixed") {
        const selectedMaterial = input.fixedTarget;
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
                initialStock: input.initialStock,
                usedCountByMaterial: {
                    battle_data: selectedMaterial === "battle_data" ? 1 : 0,
                    credit: selectedMaterial === "credit" ? 1 : 0,
                    core_dust: selectedMaterial === "core_dust" ? 1 : 0,
                },
                allocationSummary: {
                    battle_data: selectedMaterial === "battle_data" ? 1 : 0,
                    credit: selectedMaterial === "credit" ? 1 : 0,
                    core_dust: selectedMaterial === "core_dust" ? 1 : 0,
                    unused: input.initialStock,
                },
                dailyLog: [],
            },
        };
    }
    const remainingState = { ...remaining };
    const usedCountByMaterial = {
        battle_data: 0,
        credit: 0,
        core_dust: 0,
    };
    const dailyLog = [];
    let stock = input.initialStock;
    let day = 0;
    while (true) {
        const currentOverallDays = calculateOverallGoalDaysFromState(remainingState, provisionalTotalDaily);
        if (currentOverallDays != null && currentOverallDays <= 0) {
            break;
        }
        day += 1;
        stock += 1;
        let usedThisDay = false;
        while (stock > 0) {
            const stockBefore = stock;
            let bestAction = "unused";
            let bestDays = null;
            const actions = [
                "unused",
                "battle_data",
                "credit",
                "core_dust",
            ];
            for (const action of actions) {
                const actionDaily = action === "unused"
                    ? createEmptyMaterialMap()
                    : getGrowthSupplyBoxGainByMaterial(autoIncomePerHour, action);
                const candidateRemaining = action === "unused"
                    ? remainingState
                    : maxMaterialMapWithZero(subtractMaterialMaps(remainingState, actionDaily));
                const candidateDays = calculateOverallGoalDaysFromState(candidateRemaining, provisionalTotalDaily);
                const shouldReplace = bestDays == null
                    ? candidateDays != null
                    : candidateDays == null
                        ? false
                        : candidateDays < bestDays ||
                            (candidateDays === bestDays &&
                                compareGrowthSupplyBoxActionPriority(action, bestAction) < 0);
                if (shouldReplace) {
                    bestAction = action;
                    bestDays = candidateDays;
                }
            }
            if (bestAction === "unused") {
                break;
            }
            const gain = getGrowthSupplyBoxGainByMaterial(autoIncomePerHour, bestAction);
            const nextRemaining = maxMaterialMapWithZero(subtractMaterialMaps(remainingState, gain));
            remainingState.battle_data = nextRemaining.battle_data;
            remainingState.credit = nextRemaining.credit;
            remainingState.core_dust = nextRemaining.core_dust;
            stock -= 1;
            usedCountByMaterial[bestAction] += 1;
            usedThisDay = true;
            dailyLog.push({
                day,
                action: bestAction,
                stockBefore,
                stockAfter: stock,
            });
            const afterBoxDays = calculateOverallGoalDaysFromState(remainingState, provisionalTotalDaily);
            if (afterBoxDays != null && afterBoxDays <= 0) {
                break;
            }
        }
        if (!usedThisDay) {
            dailyLog.push({
                day,
                action: "unused",
                stockBefore: stock,
                stockAfter: stock,
            });
        }
        const nextRemainingAfterDaily = maxMaterialMapWithZero(subtractMaterialMaps(remainingState, provisionalTotalDaily));
        remainingState.battle_data = nextRemainingAfterDaily.battle_data;
        remainingState.credit = nextRemainingAfterDaily.credit;
        remainingState.core_dust = nextRemainingAfterDaily.core_dust;
        const afterOverallDays = calculateOverallGoalDaysFromState(remainingState, provisionalTotalDaily);
        if (afterOverallDays != null && afterOverallDays <= 0) {
            break;
        }
        if (day > 5000) {
            break;
        }
    }
    const totalUsed = usedCountByMaterial.battle_data +
        usedCountByMaterial.credit +
        usedCountByMaterial.core_dust;
    const totalDays = day || 1;
    const averageDaily = mapMaterials((material) => {
        const gainPerBox = autoIncomePerHour[material] * GROWTH_SUPPLY_BOX_HOURS_CHOICES[material];
        return (usedCountByMaterial[material] * gainPerBox) / totalDays;
    });
    return {
        daily: averageDaily,
        result: {
            enabled: true,
            mode: input.mode,
            selectedMaterial: null,
            addedHours: 0,
            addedMaterials: 0,
            initialStock: input.initialStock,
            usedCountByMaterial,
            allocationSummary: {
                battle_data: usedCountByMaterial.battle_data,
                credit: usedCountByMaterial.credit,
                core_dust: usedCountByMaterial.core_dust,
                unused: input.initialStock + totalDays - totalUsed,
            },
            dailyLog,
        },
    };
}
export function findMaterialWithLongestDays(remaining, totalDaily) {
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
export function calculateTotalDailyIncome(baseDaily, wipeoutDaily, dailyPlayRewardDaily, growthSupplyBoxDaily) {
    return sumMaterialMaps(baseDaily, wipeoutDaily, dailyPlayRewardDaily, growthSupplyBoxDaily);
}
export function calculateMaterialResults(params) {
    const goalDays = calculateDaysToGoal(params.remaining, params.totalDaily);
    return {
        battle_data: buildMaterialResult("battle_data", params, goalDays),
        credit: buildMaterialResult("credit", params, goalDays),
        core_dust: buildMaterialResult("core_dust", params, goalDays),
    };
}
function buildMaterialResult(material, params, goalDays) {
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
        growthSupplyBoxHours: params.growthSupplyBoxResult.usedCountByMaterial[material] *
            GROWTH_SUPPLY_BOX_HOURS_CHOICES[material],
        growthSupplyBoxDaily: params.growthSupplyBoxDaily[material],
        totalDaily: params.totalDaily[material],
        daysToGoal: goalDays[material].days,
        reachable: goalDays[material].reachable,
    };
}
export function findBottleneckMaterials(materialResults) {
    const unreachableMaterials = MATERIAL_KEYS.filter((material) => !materialResults[material].reachable);
    if (unreachableMaterials.length > 0) {
        return unreachableMaterials;
    }
    const maxDays = Math.max(...MATERIAL_KEYS.map((material) => materialResults[material].daysToGoal ?? 0));
    return MATERIAL_KEYS.filter((material) => (materialResults[material].daysToGoal ?? 0) === maxDays);
}
export function calculateSummary(materialResults, growthSupplyBox) {
    const overallReachable = MATERIAL_KEYS.every((material) => materialResults[material].reachable);
    if (!overallReachable) {
        return {
            overallDaysToGoal: null,
            overallReachable: false,
            bottleneckMaterials: findBottleneckMaterials(materialResults),
            growthSupplyBox,
        };
    }
    const overallDaysToGoal = Math.max(...MATERIAL_KEYS.map((material) => materialResults[material].daysToGoal ?? 0));
    return {
        overallDaysToGoal,
        overallReachable: true,
        bottleneckMaterials: findBottleneckMaterials(materialResults),
        growthSupplyBox,
    };
}
export function buildResult(materialResults, summary) {
    return {
        materials: materialResults,
        summary,
    };
}
export function calculateSyncLevelPlan(input, masterData) {
    const validation = validateInput(input, masterData);
    if (!validation.valid) {
        throw new Error(`入力エラー:
        ${validation.errors
            .map((error) => `- ${error.field}: ${error.message}`)
            .join("")}`);
    }
    const required = calculateRequiredMaterials(input, masterData);
    const autoHourly = getAutoIncomePerHour(input.baseDefenseLevel, masterData);
    const baseDaily = convertHourlyToDaily(autoHourly);
    const wipeoutDaily = calculateWipeoutIncome(input.wipeoutCount, autoHourly);
    const shopDirectMaterials = calculateShopDirectMaterials(input.selectedShopItemIds);
    const shopCaseHoursDaily = calculateShopCaseCounts1hDaily(input.selectedShopItemIds);
    const shopDaily = convertTimedHoursToMaterials(shopCaseHoursDaily, autoHourly);
    const ownedCaseHours = calculateOwnedCaseHours(input.ownedCaseCounts);
    const ownedConvertedFromCases = convertTimedHoursToMaterials(ownedCaseHours, autoHourly);
    const effectiveOwned = sumMaterialMaps(input.ownedDirectMaterials, ownedConvertedFromCases, shopDirectMaterials);
    const remaining = calculateRemainingMaterials(required, effectiveOwned);
    const dailyPlayRewardHours = calculateDailyPlayRewardHours(input.enableDailyPlayReward);
    const dailyPlayRewardDaily = convertTimedHoursToMaterials(dailyPlayRewardHours, autoHourly);
    const provisionalTotalDaily = calculateTotalDailyIncome(sumMaterialMaps(baseDaily, shopDaily), wipeoutDaily, dailyPlayRewardDaily, createEmptyMaterialMap());
    const growthSupplyBoxAllocation = calculateGrowthSupplyBoxDaily(input.growthSupplyBox, remaining, autoHourly, provisionalTotalDaily);
    const totalDaily = calculateTotalDailyIncome(sumMaterialMaps(baseDaily, shopDaily), wipeoutDaily, dailyPlayRewardDaily, growthSupplyBoxAllocation.daily);
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
    const summary = calculateSummary(materialResults, growthSupplyBoxAllocation.result);
    return buildResult(materialResults, summary);
}
export function calculateSyncLevelPlanSafe(input, masterData) {
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
export function formatNumber(value, fractionDigits = 2) {
    return new Intl.NumberFormat("ja-JP", {
        minimumFractionDigits: 0,
        maximumFractionDigits: fractionDigits,
    }).format(value);
}
export function formatDays(value, fractionDigits = 2) {
    if (value == null) {
        return "達成不可";
    }
    return `${formatNumber(value, fractionDigits)}日`;
}
export function roundUpDays(value) {
    if (value == null) {
        return null;
    }
    return Math.ceil(value);
}
export function formatRoundedPeriod(value) {
    if (value == null) {
        return "達成不可";
    }
    const totalDays = Math.ceil(value);
    const years = Math.floor(totalDays / 365);
    const remainingAfterYears = totalDays % 365;
    const months = Math.floor(remainingAfterYears / 30);
    const days = remainingAfterYears % 30;
    const parts = [];
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
function calculateMilestoneRows(input, masterData, effectiveOwned, totalDaily) {
    const rows = [];
    let cumulativeRequired = createEmptyMaterialMap();
    let previousRoundedDays = null;
    for (let level = input.currentSyncLevel; level < input.targetSyncLevel; level += 1) {
        const nextLevel = level + 1;
        const cost = masterData.levelRequirements.find((r) => r.level === nextLevel);
        if (!cost) {
            continue;
        }
        const costMap = {
            battle_data: cost.battle_data,
            credit: cost.credit,
            core_dust: cost.core_dust,
        };
        cumulativeRequired = sumMaterialMaps(cumulativeRequired, costMap);
        if (nextLevel % 10 !== 1) {
            continue;
        }
        const remaining = calculateRemainingMaterials(cumulativeRequired, effectiveOwned);
        const materialDays = MATERIAL_KEYS.map((material) => {
            const remain = remaining[material];
            const daily = totalDaily[material];
            if (remain <= 0) {
                return 0;
            }
            if (daily <= 0) {
                return null;
            }
            return remain / daily;
        });
        const hasUnreachable = materialDays.some((days) => days == null);
        const rawDays = hasUnreachable ? null : Math.max(...materialDays);
        const roundedDays = roundUpDays(rawDays);
        const deltaDays = roundedDays == null
            ? null
            : previousRoundedDays == null
                ? null
                : roundedDays - previousRoundedDays;
        rows.push({
            level: nextLevel,
            days: roundedDays,
            daysText: roundedDays == null ? "達成不可" : formatNumber(roundedDays, 0),
            periodText: roundedDays == null ? "達成不可" : `${roundedDays}日`,
            deltaDays,
            deltaPeriodText: deltaDays == null ? "-" : `${deltaDays}日`,
        });
        previousRoundedDays = roundedDays;
    }
    return rows;
}
export function toDisplayMaterialRow(material, result, growthSupplyBoxResult) {
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
        growthSupplyBoxUsedCount: growthSupplyBoxResult.usedCountByMaterial[material],
        totalDaily: result.totalDaily,
        daysToGoal: result.daysToGoal,
        daysToGoalText: formatDays(result.daysToGoal),
        roundedUpDaysToGoal: roundUpDays(result.daysToGoal),
        roundedUpPeriodText: formatRoundedPeriod(result.daysToGoal),
        reachable: result.reachable,
    };
}
export function toDisplaySummary(summary) {
    const box = summary.growthSupplyBox;
    const allocationSummaryText = `バトルデータ ${box.allocationSummary.battle_data}個 / クレジット ${box.allocationSummary.credit}個 / コアダスト ${box.allocationSummary.core_dust}個 / 未使用 ${box.allocationSummary.unused}個`;
    const dailyLogText = box.dailyLog.length === 0
        ? "なし"
        : box.dailyLog
            .map((row) => {
            const actionLabel = row.action === "unused" ? "使用なし" : MATERIAL_LABELS[row.action];
            return `Day ${row.day}: ${actionLabel}（${row.stockBefore}→${row.stockAfter}）`;
        })
            .join("\n");
    return {
        overallDaysToGoal: summary.overallDaysToGoal,
        overallDaysToGoalText: formatDays(summary.overallDaysToGoal),
        overallRoundedUpDaysToGoal: roundUpDays(summary.overallDaysToGoal),
        overallPeriodText: summary.overallDaysToGoal == null
            ? "達成不可"
            : `${roundUpDays(summary.overallDaysToGoal)}日（${formatRoundedPeriod(summary.overallDaysToGoal)}）`,
        overallReachable: summary.overallReachable,
        bottleneckMaterials: [...summary.bottleneckMaterials],
        bottleneckLabels: summary.bottleneckMaterials.map((material) => MATERIAL_LABELS[material]),
        growthSupplyBox: {
            enabled: box.enabled,
            modeLabel: box.mode === "fixed" ? "選択した素材に固定" : "最適配分",
            selectedLabel: box.selectedMaterial == null ? "なし" : MATERIAL_LABELS[box.selectedMaterial],
            addedHoursText: `${formatNumber(box.addedHours, 2)}時間`,
            addedMaterialsText: formatNumber(box.addedMaterials, 2),
            usedBoxCountText: `${formatNumber(box.usedCountByMaterial.battle_data +
                box.usedCountByMaterial.credit +
                box.usedCountByMaterial.core_dust, 0)}個`,
            initialStockText: `${formatNumber(box.initialStock, 0)}個`,
            allocationSummaryText,
            dailyLogText,
        },
    };
}
export function toDisplayResult(result, input, masterData) {
    const effectiveOwned = {
        battle_data: result.materials.battle_data.effectiveOwned,
        credit: result.materials.credit.effectiveOwned,
        core_dust: result.materials.core_dust.effectiveOwned,
    };
    const totalDaily = {
        battle_data: result.materials.battle_data.totalDaily,
        credit: result.materials.credit.totalDaily,
        core_dust: result.materials.core_dust.totalDaily,
    };
    return {
        rows: MATERIAL_KEYS.map((material) => toDisplayMaterialRow(material, result.materials[material], result.summary.growthSupplyBox)),
        summary: toDisplaySummary(result.summary),
        milestoneRows: calculateMilestoneRows(input, masterData, effectiveOwned, totalDaily),
    };
}
export function calculateDisplayResult(input, masterData) {
    const result = calculateSyncLevelPlan(input, masterData);
    return toDisplayResult(result, input, masterData);
}
export function calculateDisplayResultSafe(input, masterData) {
    const response = calculateSyncLevelPlanSafe(input, masterData);
    if (!response.ok) {
        return response;
    }
    return {
        ok: true,
        displayResult: toDisplayResult(response.result, input, masterData),
    };
}
/**
 * デバッグ用: 計算内訳をテキスト形式で生成
 */
export function buildDebugLog(display) {
    const lines = [];
    for (const row of display.rows) {
        lines.push(`\n[${row.label}]\n`);
        lines.push(`必要量: ${row.required}\n`);
        lines.push(`-保有素材計算-\n`);
        lines.push(`直接保有分: ${row.ownedDirect}\n`);
        lines.push(`ケース保有分: ${row.ownedCaseHours}h × 時給(${row.autoHourly}) = ${row.ownedConvertedFromCases}\n`);
        if (row.shopDirect > 0) {
            lines.push(`課金直接加算: ${row.shopDirect}\n`);
        }
        lines.push(`実質保有: ${row.effectiveOwned}\n`);
        lines.push(`残必要量: ${row.remaining}\n`);
        lines.push(`-日次獲得計算-\n`);
        lines.push(`基本: ${row.autoHourly} × 24 = ${row.baseDaily}\n`);
        lines.push(`殲滅: ${row.wipeoutDaily}\n`);
        if (row.dailyPlayRewardHours > 0) {
            lines.push(`デイリープレイ: ${row.dailyPlayRewardHours}h × ${row.autoHourly} = ${row.dailyPlayRewardDaily}\n`);
        }
        if (row.shopCaseHoursDaily > 0 || row.shopDaily > 0) {
            lines.push(`課金: ${row.shopCaseHoursDaily}h × ${row.autoHourly} = ${row.shopDaily}\n`);
        }
        if (row.growthSupplyBoxHours > 0) {
            lines.push(`30-day補給箱: ${row.growthSupplyBoxHours}h × ${row.autoHourly} = ${row.growthSupplyBoxDaily}\n`);
        }
        lines.push(`総日次: ${row.totalDaily}\n`);
        if (row.daysToGoal != null) {
            lines.push(`到達日数: ${row.remaining} ÷ ${row.totalDaily} = ${row.daysToGoal}\n`);
        }
        else {
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
export const SHOP_ITEMS = [
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
export function getShopItemsByCategory(category) {
    return SHOP_ITEMS.filter((item) => item.category === category);
}
export function getSelectedShopItems(selectedShopItemIds) {
    const selectedSet = new Set(selectedShopItemIds);
    return SHOP_ITEMS.filter((item) => selectedSet.has(item.id));
}
export function getShopCategoryProrationDivisor(category) {
    switch (category) {
        case "daily":
            return 1;
        case "weekly":
            return 7;
        case "monthly":
            return 30;
    }
}
export function calculateShopDirectMaterials(selectedShopItemIds) {
    const selectedItems = getSelectedShopItems(selectedShopItemIds);
    return selectedItems.reduce((acc, item) => {
        return addMaterialMaps(acc, item.reward.direct);
    }, createEmptyMaterialMap());
}
export function calculateShopCaseCounts1hDaily(selectedShopItemIds) {
    const selectedItems = getSelectedShopItems(selectedShopItemIds);
    return selectedItems.reduce((acc, item) => {
        const divisor = getShopCategoryProrationDivisor(item.category);
        const prorated = mapMaterials((material) => item.reward.caseCounts1h[material] / divisor);
        return addMaterialMaps(acc, prorated);
    }, createEmptyMaterialMap());
}
//# sourceMappingURL=Sync-level-calculator.js.map