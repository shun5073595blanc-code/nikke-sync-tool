import { DAILY_PLAY_REWARD_DESCRIPTION, calculateDisplayResultSafe, createDefaultSyncLevelPlanInput, formatNumber, SHOP_ITEMS, } from "./Sync-level-calculator.js";
import { masterData } from "./master-data.js";
import { buildDebugLog } from "./Sync-level-calculator.js";
function getNumberInputValue(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`要素が見つかりません: ${id}`);
    }
    const value = Number(element.value);
    return Number.isFinite(value) ? value : 0;
}
function getCheckboxValue(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`要素が見つかりません: ${id}`);
    }
    return element.checked;
}
function getSelectValue(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`要素が見つかりません: ${id}`);
    }
    return element.value;
}
function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`要素が見つかりません: ${id}`);
    }
    element.value = String(value);
}
function setCheckboxValue(id, checked) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`要素が見つかりません: ${id}`);
    }
    element.checked = checked;
}
function toggleHiddenById(id) {
    const element = document.getElementById(id);
    if (!element)
        return;
    element.classList.toggle("hidden");
}
function initializeInlineToggles() {
    const toggles = document.querySelectorAll("[data-toggle-target]");
    for (const toggle of toggles) {
        toggle.addEventListener("click", () => {
            const targetId = toggle.dataset.toggleTarget;
            if (!targetId)
                return;
            toggleHiddenById(targetId);
        });
    }
}
function getShopItemCheckboxId(itemId) {
    return `shopItem_${itemId}`;
}
const MATERIAL_LABELS = {
    credit: "クレジット",
    battle_data: "バトルデータ",
    core_dust: "コアダスト",
};
function readSelectedShopItemIds() {
    return SHOP_ITEMS
        .filter((item) => getCheckboxValue(getShopItemCheckboxId(item.id)))
        .map((item) => item.id);
}
function renderShopItems() {
    const container = document.getElementById("shopItemsContainer");
    if (!container)
        return;
    container.innerHTML = "";
    const categoryLabels = {
        daily: "デイリー",
        weekly: "ウィークリー",
        monthly: "マンスリー",
    };
    const grouped = {
        daily: SHOP_ITEMS.filter((item) => item.category === "daily"),
        weekly: SHOP_ITEMS.filter((item) => item.category === "weekly"),
        monthly: SHOP_ITEMS.filter((item) => item.category === "monthly"),
    };
    for (const category of ["daily", "weekly", "monthly"]) {
        const items = grouped[category];
        if (items.length === 0)
            continue;
        const section = document.createElement("details");
        section.className = "details-block nested-details";
        section.open = category === "daily";
        const title = document.createElement("summary");
        title.className = "details-summary";
        title.textContent = categoryLabels[category];
        section.appendChild(title);
        const content = document.createElement("div");
        content.className = "details-content";
        for (const item of items) {
            const row = document.createElement("label");
            row.className = "shop-item-row";
            row.htmlFor = getShopItemCheckboxId(item.id);
            const rewardParts = [];
            for (const [material, value] of Object.entries(item.reward.direct)) {
                if (value > 0) {
                    const label = MATERIAL_LABELS[material] ?? material;
                    rewardParts.push(`${label}: 直接 ${formatNumber(value, 0)}`);
                }
            }
            for (const [material, value] of Object.entries(item.reward.caseCounts1h)) {
                if (value > 0) {
                    const label = MATERIAL_LABELS[material] ?? material;
                    rewardParts.push(`${label}: 1hケース ${formatNumber(value, 0)}個`);
                }
            }
            row.innerHTML = `
        <input id="${getShopItemCheckboxId(item.id)}" type="checkbox" />
        <div class="shop-item-content">
          <div class="shop-item-name">${item.name}</div>
          <div class="shop-item-reward">${rewardParts.join(" / ")}</div>
        </div>
      `;
            content.appendChild(row);
        }
        section.appendChild(content);
        container.appendChild(section);
    }
}
function buildDirectMaterialInputIds() {
    return {
        battle_data: "ownedDirectBattleData",
        credit: "ownedDirectCredit",
        core_dust: "ownedDirectCoreDust",
    };
}
function buildCaseInputIds() {
    return {
        battle_data: {
            case1h: "battleDataCase1h",
            case2h: "battleDataCase2h",
            case4h: "battleDataCase4h",
            case8h: "battleDataCase8h",
            case12h: "battleDataCase12h",
            case24h: "battleDataCase24h",
        },
        credit: {
            case1h: "creditCase1h",
            case2h: "creditCase2h",
            case4h: "creditCase4h",
            case8h: "creditCase8h",
            case12h: "creditCase12h",
            case24h: "creditCase24h",
        },
        core_dust: {
            case1h: "coreDustCase1h",
            case2h: "coreDustCase2h",
            case4h: "coreDustCase4h",
            case8h: "coreDustCase8h",
            case12h: "coreDustCase12h",
            case24h: "coreDustCase24h",
        },
    };
}
function readOwnedDirectMaterials() {
    const ids = buildDirectMaterialInputIds();
    return {
        battle_data: getNumberInputValue(ids.battle_data),
        credit: getNumberInputValue(ids.credit),
        core_dust: getNumberInputValue(ids.core_dust),
    };
}
function readOwnedCaseCounts() {
    const ids = buildCaseInputIds();
    return {
        battle_data: {
            case1h: getNumberInputValue(ids.battle_data.case1h),
            case2h: getNumberInputValue(ids.battle_data.case2h),
            case4h: getNumberInputValue(ids.battle_data.case4h),
            case8h: getNumberInputValue(ids.battle_data.case8h),
            case12h: getNumberInputValue(ids.battle_data.case12h),
            case24h: getNumberInputValue(ids.battle_data.case24h),
        },
        credit: {
            case1h: getNumberInputValue(ids.credit.case1h),
            case2h: getNumberInputValue(ids.credit.case2h),
            case4h: getNumberInputValue(ids.credit.case4h),
            case8h: getNumberInputValue(ids.credit.case8h),
            case12h: getNumberInputValue(ids.credit.case12h),
            case24h: getNumberInputValue(ids.credit.case24h),
        },
        core_dust: {
            case1h: getNumberInputValue(ids.core_dust.case1h),
            case2h: getNumberInputValue(ids.core_dust.case2h),
            case4h: getNumberInputValue(ids.core_dust.case4h),
            case8h: getNumberInputValue(ids.core_dust.case8h),
            case12h: getNumberInputValue(ids.core_dust.case12h),
            case24h: getNumberInputValue(ids.core_dust.case24h),
        },
    };
}
function buildInputFromForm() {
    const base = createDefaultSyncLevelPlanInput();
    return {
        ...base,
        currentSyncLevel: getNumberInputValue("currentSyncLevel"),
        targetSyncLevel: getNumberInputValue("targetSyncLevel"),
        baseDefenseLevel: getNumberInputValue("baseDefenseLevel"),
        wipeoutCount: getNumberInputValue("wipeoutCount"),
        enableDailyPlayReward: getCheckboxValue("enableDailyPlayReward"),
        ownedDirectMaterials: readOwnedDirectMaterials(),
        ownedCaseCounts: readOwnedCaseCounts(),
        growthSupplyBox: {
            enabled: getCheckboxValue("enableGrowthSupplyBox"),
            mode: getSelectValue("growthSupplyBoxMode"),
            fixedTarget: getSelectValue("growthSupplyBoxFixedTarget"),
            initialStock: getNumberInputValue("growthSupplyBoxInitialStock"),
        },
        selectedShopItemIds: readSelectedShopItemIds(),
    };
}
function fillFormFromInput(input) {
    setInputValue("currentSyncLevel", input.currentSyncLevel);
    setInputValue("targetSyncLevel", input.targetSyncLevel);
    setInputValue("baseDefenseLevel", input.baseDefenseLevel);
    setInputValue("wipeoutCount", input.wipeoutCount);
    setCheckboxValue("enableDailyPlayReward", input.enableDailyPlayReward);
    const directIds = buildDirectMaterialInputIds();
    setInputValue(directIds.battle_data, input.ownedDirectMaterials.battle_data);
    setInputValue(directIds.credit, input.ownedDirectMaterials.credit);
    setInputValue(directIds.core_dust, input.ownedDirectMaterials.core_dust);
    const caseIds = buildCaseInputIds();
    for (const material of ["battle_data", "credit", "core_dust"]) {
        const ids = caseIds[material];
        const counts = input.ownedCaseCounts[material];
        setInputValue(ids.case1h, counts.case1h);
        setInputValue(ids.case2h, counts.case2h);
        setInputValue(ids.case4h, counts.case4h);
        setInputValue(ids.case8h, counts.case8h);
        setInputValue(ids.case12h, counts.case12h);
        setInputValue(ids.case24h, counts.case24h);
    }
    setCheckboxValue("enableGrowthSupplyBox", input.growthSupplyBox.enabled);
    setInputValue("growthSupplyBoxMode", input.growthSupplyBox.mode);
    setInputValue("growthSupplyBoxFixedTarget", input.growthSupplyBox.fixedTarget);
    setInputValue("growthSupplyBoxInitialStock", input.growthSupplyBox.initialStock);
    for (const item of SHOP_ITEMS) {
        setCheckboxValue(getShopItemCheckboxId(item.id), input.selectedShopItemIds.includes(item.id));
    }
}
function showError(messages) {
    const errorBox = document.getElementById("errorBox");
    if (!errorBox)
        return;
    errorBox.classList.remove("hidden");
    errorBox.textContent = messages.join("\n");
}
function hideError() {
    const errorBox = document.getElementById("errorBox");
    if (!errorBox)
        return;
    errorBox.classList.add("hidden");
    errorBox.textContent = "";
}
function hideResult() {
    const summaryBox = document.getElementById("summaryBox");
    const table = document.getElementById("resultTable");
    const tbody = document.getElementById("resultTableBody");
    const milestoneTable = document.getElementById("milestoneTable");
    const milestoneTableBody = document.getElementById("milestoneTableBody");
    summaryBox?.classList.add("hidden");
    table?.classList.add("hidden");
    milestoneTable?.classList.add("hidden");
    if (tbody) {
        tbody.innerHTML = "";
    }
    if (milestoneTableBody) {
        milestoneTableBody.innerHTML = "";
    }
}
function renderSummary(displayResult) {
    const summaryBox = document.getElementById("summaryBox");
    if (!summaryBox)
        return;
    const box = displayResult.summary.growthSupplyBox;
    summaryBox.classList.remove("hidden");
    summaryBox.innerHTML = `
    <div class="summary-main">
      <div class="summary-main-label">総合到達日数</div>
      <div class="summary-main-value">${displayResult.summary.overallPeriodText}</div>
    </div>
    <div class="summary-sub">
      <strong>ボトルネック素材:</strong> ${displayResult.summary.bottleneckLabels.join(", ")}
    </div>
    <div class="summary-sub">
      <strong>30-day成長補給箱:</strong> ${box.modeLabel}
    </div>
    <div class="summary-sub">
      <strong>初期保持:</strong> ${box.initialStockText}
    </div>
    <div class="summary-sub">
      <strong>最適配分:</strong> ${box.allocationSummaryText}
    </div>
    <details class="summary-log-details">
      <summary class="summary-log-summary">日ごとの配分ログ</summary>
      <div class="summary-sub summary-log-body">${box.dailyLogText}</div>
    </details>
  `;
}
function renderTable(displayResult) {
    const table = document.getElementById("resultTable");
    const tbody = document.getElementById("resultTableBody");
    if (!(table instanceof HTMLTableElement) || !(tbody instanceof HTMLTableSectionElement)) {
        return;
    }
    table.classList.remove("hidden");
    tbody.innerHTML = "";
    const materialOrder = {
        battle_data: 0,
        credit: 1,
        core_dust: 2,
    };
    const sortedRows = [...displayResult.rows].sort((a, b) => (materialOrder[a.key] ?? 999) - (materialOrder[b.key] ?? 999));
    for (const row of sortedRows) {
        const tr = document.createElement("tr");
        if (displayResult.summary.bottleneckMaterials.includes(row.key)) {
            tr.classList.add("bottleneck-row");
        }
        const periodText = row.roundedUpDaysToGoal == null
            ? "達成不可"
            : `${row.roundedUpDaysToGoal}日（${row.roundedUpPeriodText}）`;
        const growthSupplyBoxText = `${row.growthSupplyBoxUsedCount}個`;
        tr.innerHTML = `
      <td>${row.label}</td>
      <td>${periodText}</td>
      <td>${growthSupplyBoxText}</td>
    `;
        tbody.appendChild(tr);
    }
}
function renderMilestoneTable(displayResult) {
    const table = document.getElementById("milestoneTable");
    const tbody = document.getElementById("milestoneTableBody");
    if (!(table instanceof HTMLTableElement) || !(tbody instanceof HTMLTableSectionElement)) {
        return;
    }
    tbody.innerHTML = "";
    if (displayResult.milestoneRows.length === 0) {
        table.classList.add("hidden");
        return;
    }
    for (const row of displayResult.milestoneRows) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${row.level}</td>
      <td>${row.daysText}</td>
      <td>${row.periodText}</td>
      <td>${row.deltaPeriodText}</td>
    `;
        tbody.appendChild(tr);
    }
    table.classList.remove("hidden");
}
function updateGrowthSupplyBoxFixedTargetVisibility() {
    const enabled = getCheckboxValue("enableGrowthSupplyBox");
    const mode = getSelectValue("growthSupplyBoxMode");
    const configArea = document.getElementById("growthSupplyBoxConfig");
    const fixedTargetRow = document.getElementById("growthSupplyBoxFixedTargetRow");
    if (!configArea || !fixedTargetRow)
        return;
    if (!enabled) {
        configArea.classList.add("hidden");
        fixedTargetRow.classList.add("hidden");
        return;
    }
    configArea.classList.remove("hidden");
    if (mode === "fixed") {
        fixedTargetRow.classList.remove("hidden");
    }
    else {
        fixedTargetRow.classList.add("hidden");
    }
}
function calculateAndRender() {
    hideError();
    const response = calculateDisplayResultSafe(buildInputFromForm(), masterData);
    if (!response.ok) {
        hideResult();
        showError(response.errors.map((error) => `${error.field}: ${error.message}`));
        return;
    }
    renderSummary(response.displayResult);
    renderTable(response.displayResult);
    renderMilestoneTable(response.displayResult);
    const debugBox = document.getElementById("debugBox");
    if (debugBox) {
        debugBox.textContent = buildDebugLog(response.displayResult);
    }
}
function initialize() {
    renderShopItems();
    const dailyDescription = document.getElementById("dailyPlayRewardDescription");
    if (dailyDescription) {
        dailyDescription.innerHTML = DAILY_PLAY_REWARD_DESCRIPTION;
    }
    initializeInlineToggles();
    const dailyPlayDescription = document.getElementById("dailyPlayRewardDescription");
    if (dailyPlayDescription) {
        dailyPlayDescription.innerHTML = DAILY_PLAY_REWARD_DESCRIPTION;
    }
    const calculateButton = document.getElementById("calculateButton");
    const headerCalculateButton = document.getElementById("headerCalculateButton");
    const growthSupplyBoxCheckbox = document.getElementById("enableGrowthSupplyBox");
    const growthSupplyBoxMode = document.getElementById("growthSupplyBoxMode");
    calculateButton?.addEventListener("click", calculateAndRender);
    headerCalculateButton?.addEventListener("click", calculateAndRender);
    growthSupplyBoxCheckbox?.addEventListener("change", updateGrowthSupplyBoxFixedTargetVisibility);
    growthSupplyBoxMode?.addEventListener("change", updateGrowthSupplyBoxFixedTargetVisibility);
    updateGrowthSupplyBoxFixedTargetVisibility();
    hideResult();
}
window.addEventListener("DOMContentLoaded", initialize);
//# sourceMappingURL=app.js.map