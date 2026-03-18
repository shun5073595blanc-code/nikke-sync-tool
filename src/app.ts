import {
  type DisplayResult,
  type MaterialCaseCountMap,
  type MaterialMap,
  type MaterialKey,
  type SyncLevelPlanInput,
  DAILY_PLAY_REWARD_DESCRIPTION,
  calculateDisplayResultSafe,
  createDefaultSyncLevelPlanInput,
  formatNumber,
  SHOP_ITEMS,
} from "./Sync-level-calculator.js";
import { masterData } from "./master-data.js";
import { buildDebugLog } from "./Sync-level-calculator.js";

function getNumberInputValue(id: string): number {
  const element = document.getElementById(id) as HTMLInputElement | null;
  if (!element) {
    throw new Error(`要素が見つかりません: ${id}`);
  }

  const value = Number(element.value);
  return Number.isFinite(value) ? value : 0;
}

function getCheckboxValue(id: string): boolean {
  const element = document.getElementById(id) as HTMLInputElement | null;
  if (!element) {
    throw new Error(`要素が見つかりません: ${id}`);
  }

  return element.checked;
}

function getSelectValue(id: string): string {
  const element = document.getElementById(id) as HTMLSelectElement | null;
  if (!element) {
    throw new Error(`要素が見つかりません: ${id}`);
  }

  return element.value;
}

function setInputValue(id: string, value: number | string): void {
  const element = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
  if (!element) {
    throw new Error(`要素が見つかりません: ${id}`);
  }

  element.value = String(value);
}

function setCheckboxValue(id: string, checked: boolean): void {
  const element = document.getElementById(id) as HTMLInputElement | null;
  if (!element) {
    throw new Error(`要素が見つかりません: ${id}`);
  }

  element.checked = checked;
}

function getShopItemCheckboxId(itemId: string): string {
  return `shopItem_${itemId}`;
}

const MATERIAL_LABELS: Record<string, string> = {
  credit: "クレジット",
  battle_data: "バトルデータ",
  core_dust: "コアダスト",
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function readSelectedShopItemIds(): string[] {
  return SHOP_ITEMS
    .filter((item) => {
      const checkbox = document.getElementById(getShopItemCheckboxId(item.id)) as HTMLInputElement | null;
      return checkbox?.checked ?? false;
    })
    .map((item) => item.id);
}

function renderShopItems(): void {
  const dailyContainer = document.getElementById("shopItemsDailyContainer");
  const weeklyContainer = document.getElementById("shopItemsWeeklyContainer");
  const monthlyContainer = document.getElementById("shopItemsMonthlyContainer");

  if (!dailyContainer || !weeklyContainer || !monthlyContainer) {
    return;
  }

  dailyContainer.innerHTML = "";
  weeklyContainer.innerHTML = "";
  monthlyContainer.innerHTML = "";

  const containerMap = {
    daily: dailyContainer,
    weekly: weeklyContainer,
    monthly: monthlyContainer,
  } as const;

  for (const item of SHOP_ITEMS) {
    const row = document.createElement("label");
    row.className = "shop-item-row";
    row.htmlFor = getShopItemCheckboxId(item.id);

    const rewardParts: string[] = [];

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
        <div class="shop-item-name">${escapeHtml(item.name)}</div>
        <div class="shop-item-reward">${escapeHtml(rewardParts.join(" / "))}</div>
      </div>
    `;

    containerMap[item.category].appendChild(row);
  }
}

function buildDirectMaterialInputIds(): Record<MaterialKey, string> {
  return {
    battle_data: "ownedDirectBattleData",
    credit: "ownedDirectCredit",
    core_dust: "ownedDirectCoreDust",
  };
}

function buildCaseInputIds(): Record<
  MaterialKey,
  {
    case1h: string;
    case2h: string;
    case4h: string;
    case8h: string;
    case12h: string;
    case24h: string;
  }
> {
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

function readOwnedDirectMaterials(): MaterialMap {
  const ids = buildDirectMaterialInputIds();

  return {
    battle_data: getNumberInputValue(ids.battle_data),
    credit: getNumberInputValue(ids.credit),
    core_dust: getNumberInputValue(ids.core_dust),
  };
}

function readOwnedCaseCounts(): MaterialCaseCountMap {
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

function buildInputFromForm(): SyncLevelPlanInput {
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
      mode: getSelectValue("growthSupplyBoxMode") as "fixed" | "optimal_allocation",
      fixedTarget: getSelectValue("growthSupplyBoxFixedTarget") as MaterialKey,
      initialStock: getNumberInputValue("growthSupplyBoxInitialStock"),
    },
    selectedShopItemIds: readSelectedShopItemIds(),
  };
}

function fillFormFromInput(input: SyncLevelPlanInput): void {
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
  for (const material of ["battle_data", "credit", "core_dust"] as MaterialKey[]) {
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
    const checkbox = document.getElementById(getShopItemCheckboxId(item.id)) as HTMLInputElement | null;
    if (checkbox) {
      checkbox.checked = input.selectedShopItemIds.includes(item.id);
    }
  }
}

function showError(messages: string[]): void {
  const errorBox = document.getElementById("errorBox");
  if (!errorBox) return;

  errorBox.classList.remove("hidden");
  errorBox.innerHTML = messages.map((message) => `<div>${escapeHtml(message)}</div>`).join("");
}

function hideError(): void {
  const errorBox = document.getElementById("errorBox");
  if (!errorBox) return;

  errorBox.classList.add("hidden");
  errorBox.innerHTML = "";
}

function hideResult(): void {
  const summaryBox = document.getElementById("summaryBox");
  const resultTable = document.getElementById("resultTable");
  const resultTableBody = document.getElementById("resultTableBody");
  const milestoneTable = document.getElementById("milestoneTable");
  const milestoneTableBody = document.getElementById("milestoneTableBody");
  const growthSupplyBoxSummaryCard = document.getElementById("growthSupplyBoxSummaryCard");
  const growthSupplyBoxSummaryContent = document.getElementById("growthSupplyBoxSummaryContent");

  summaryBox?.classList.add("hidden");
  resultTable?.classList.add("hidden");
  milestoneTable?.classList.add("hidden");
  growthSupplyBoxSummaryCard?.classList.add("hidden");

  if (resultTableBody) {
    resultTableBody.innerHTML = "";
  }

  if (milestoneTableBody) {
    milestoneTableBody.innerHTML = "";
  }

  if (growthSupplyBoxSummaryContent) {
    growthSupplyBoxSummaryContent.innerHTML = "";
  }
}

function renderSummary(displayResult: DisplayResult): void {
  const summaryBox = document.getElementById("summaryBox");
  if (!summaryBox) return;

  summaryBox.classList.remove("hidden");
  summaryBox.innerHTML = `
    <div class="summary-main">
      <div class="summary-main-label">総合到達日数</div>
      <div class="summary-main-value">${escapeHtml(displayResult.summary.overallPeriodText)}</div>
    </div>
    <div class="summary-sub">
      ボトルネック素材: ${escapeHtml(displayResult.summary.bottleneckLabels.join(", "))}
    </div>
  `;
}

function renderGrowthSupplyBoxSummary(displayResult: DisplayResult): void {
  const card = document.getElementById("growthSupplyBoxSummaryCard");
  const content = document.getElementById("growthSupplyBoxSummaryContent");

  if (!card || !content) return;

  const box = displayResult.summary.growthSupplyBox;

  if (!box.enabled) {
    card.classList.add("hidden");
    content.innerHTML = "";
    return;
  }

  card.classList.remove("hidden");
  content.innerHTML = `
    <div class="growth-summary-list">
      <div><strong>モード:</strong> ${escapeHtml(box.modeLabel)}</div>
      <div><strong>選択素材:</strong> ${escapeHtml(box.selectedLabel)}</div>
      <div><strong>初期保持:</strong> ${escapeHtml(box.initialStockText)}</div>
      <div><strong>追加時間:</strong> ${escapeHtml(box.addedHoursText)}</div>
      <div><strong>追加素材量:</strong> ${escapeHtml(box.addedMaterialsText)}</div>
      <div><strong>使用箱数:</strong> ${escapeHtml(box.usedBoxCountText)}</div>
      <div><strong>最適配分:</strong> ${escapeHtml(box.allocationSummaryText)}</div>
    </div>
    <details class="summary-log-details">
      <summary class="summary-log-summary">日ごとの配分ログ</summary>
      <div class="summary-log-body">${escapeHtml(box.dailyLogText)}</div>
    </details>
  `;
}

function renderTable(displayResult: DisplayResult): void {
  const table = document.getElementById("resultTable");
  const tbody = document.getElementById("resultTableBody");

  if (!(table instanceof HTMLTableElement) || !(tbody instanceof HTMLTableSectionElement)) {
    return;
  }

  table.classList.remove("hidden");
  tbody.innerHTML = "";

  const materialOrder: Record<string, number> = {
    battle_data: 0,
    credit: 1,
    core_dust: 2,
  };

  const sortedRows = [...displayResult.rows].sort(
    (a, b) => (materialOrder[a.key] ?? 999) - (materialOrder[b.key] ?? 999),
  );

  for (const row of sortedRows) {
    const tr = document.createElement("tr");

    if (displayResult.summary.bottleneckMaterials.includes(row.key)) {
      tr.classList.add("bottleneck-row");
    }

    const roundedDays = row.roundedUpDaysToGoal ?? 0;
    const currentOwned = row.effectiveOwned;
    const purchasedTotal = row.shopDirect + row.shopDaily * roundedDays;
    const autoTotal =
      (row.baseDaily + row.wipeoutDaily + row.dailyPlayRewardDaily + row.growthSupplyBoxDaily) *
      roundedDays;

    const dayText =
      row.roundedUpDaysToGoal == null
        ? "達成不可"
        : `${formatNumber(row.roundedUpDaysToGoal, 0)}日`;

    tr.innerHTML = `
      <td>
        ${escapeHtml(row.label)}
        ${
          displayResult.summary.bottleneckMaterials.includes(row.key)
            ? `<span class="result-bottleneck-badge">ボトルネック</span>`
            : ""
        }
      </td>
      <td>${escapeHtml(formatNumber(row.required, 0))}</td>
      <td>${escapeHtml(formatNumber(currentOwned, 0))}</td>
      <td>${escapeHtml(formatNumber(purchasedTotal, 0))}</td>
      <td>${escapeHtml(formatNumber(autoTotal, 0))}</td>
      <td>${escapeHtml(dayText)}</td>
    `;

    tbody.appendChild(tr);
  }
}

function renderMilestoneTable(displayResult: DisplayResult): void {
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
      <td>Lv. ${escapeHtml(String(row.level))}</td>
      <td>${escapeHtml(row.daysText)}</td>
      <td>${escapeHtml(row.periodText)}</td>
      <td>${escapeHtml(row.deltaPeriodText)}</td>
    `;

    tbody.appendChild(tr);
  }

  table.classList.remove("hidden");
}

function updateGrowthSupplyBoxFixedTargetVisibility(): void {
  const section = document.getElementById("growthSupplyBoxSection");
  const enabledCheckbox = document.getElementById("enableGrowthSupplyBox") as HTMLInputElement | null;
  const modeSelect = document.getElementById("growthSupplyBoxMode") as HTMLSelectElement | null;
  const fixedTargetField = document.getElementById("growthSupplyBoxFixedTarget")?.closest(".field");

  if (!section || !enabledCheckbox || !modeSelect) {
    return;
  }

  if (!enabledCheckbox.checked) {
    section.classList.add("hidden");
    if (fixedTargetField) {
      fixedTargetField.classList.add("hidden");
    }
    return;
  }

  section.classList.remove("hidden");

  if (modeSelect.value === "fixed") {
    fixedTargetField?.classList.remove("hidden");
  } else {
    fixedTargetField?.classList.add("hidden");
  }
}

function initializeSegmentedTabs(): void {
  const tabs = document.querySelectorAll<HTMLElement>("[data-tab-group][data-tab-target]");

  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      const group = tab.dataset.tabGroup;
      const target = tab.dataset.tabTarget;

      if (!group || !target) return;

      const groupTabs = document.querySelectorAll<HTMLElement>(`[data-tab-group="${group}"]`);
      const groupPanels = document.querySelectorAll<HTMLElement>(`[data-tab-panel="${group}"]`);

      for (const groupTab of groupTabs) {
        groupTab.classList.remove("is-active");
        groupTab.setAttribute("aria-selected", "false");
      }

      for (const panel of groupPanels) {
        panel.classList.remove("is-active");
      }

      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      const targetPanel = document.getElementById(target);
      targetPanel?.classList.add("is-active");
    });
  }
}

function populateWipeoutOptions(): void {
  const select = document.getElementById("wipeoutCount") as HTMLSelectElement | null;
  if (!select) return;

  if (select.options.length > 0) {
    return;
  }

  for (let i = 0; i <= 11; i += 1) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = String(i);
    select.appendChild(option);
  }
}

function calculateAndRender(): void {
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
  renderGrowthSupplyBoxSummary(response.displayResult);

  const debugBox = document.getElementById("debugBox");
  if (debugBox) {
    debugBox.textContent = buildDebugLog(response.displayResult);
  }
}

function initialize(): void {
  populateWipeoutOptions();
  renderShopItems();

  const dailyDescription = document.getElementById("dailyPlayRewardDescription");
  if (dailyDescription) {
    dailyDescription.innerHTML = DAILY_PLAY_REWARD_DESCRIPTION;
  }

  initializeSegmentedTabs();

  const initialInput = createDefaultSyncLevelPlanInput();
  fillFormFromInput(initialInput);

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
  hideError();
}

window.addEventListener("DOMContentLoaded", initialize);