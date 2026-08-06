<template>
  <div class="cm-page">
    <div class="cm-page__body">
      <div class="cm-toolbar">
        <div class="cm-toolbar__left">
          <el-tag
            v-if="projectName"
            type="info"
            effect="plain"
            class="project-tag"
            closable
            @close="clearProjectTag"
          >
            {{ projectName }}: RCM Final
          </el-tag>
          <div class="filter_item">
            <span class="cm-label">CC Criteria</span>
            <el-select
              v-model="ccCriteriaFilter"
              clearable
              placeholder="All"
              class="cm-select"
              @change="applyFilters"
            >
              <el-option label="All" value="" />
              <el-option
                v-for="item in ccCriteriaOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </div>
          <div class="filter_item">
            <span class="cm-label">Request description</span>
            <el-input
              v-model="descFilter"
              clearable
              placeholder="Search"
              class="cm-select"
              @input="applyFilters"
            />
          </div>
        </div>
        <div class="cm-toolbar__right">
          <el-button class="cm-btn-secondary" @click="openDrawer('create')">
            New
          </el-button>
          <el-button
            class="cm-btn-primary"
            type="primary"
            :loading="savingVersion"
            @click="handleVersionSave"
          >
            Version Save
          </el-button>
          <el-button class="cm-btn-primary" type="primary" @click="goControlTable">
            Control table
          </el-button>
        </div>
      </div>

      <div class="cm-table-panel">
        <Vxetable
          ref="riskTable"
          @currentChange="onPageChange"
          @sizeChange="onSizeChange"
          :tablePage="tablePage"
          :tableTitles="tableTitles"
          :tableData="pagedData"
          :selection="false"
          operationW="140"
          :isfixed="true"
        >
          <div slot="riskLevel" slot-scope="{ row }">
            <span class="risk-tag" :class="riskLevelClass(row.riskLevel)">
              {{ formatRiskLevelLabel(row.riskLevel) || "-" }}
            </span>
          </div>
          <div slot="riskSource" slot-scope="{ row }">
            {{ formatRiskSourceLabel(row.riskSource) || "-" }}
          </div>
          <div slot="ccCriteriaName" slot-scope="{ row }" class="cell-ellipsis" :title="row.ccCriteriaName">
            {{ row.ccCriteriaName || "-" }}
          </div>
          <div slot="subRiskName" slot-scope="{ row }" class="cell-ellipsis" :title="row.subRiskName">
            {{ row.subRiskName || "-" }}
          </div>
          <div
            slot="pointsOfFocusName"
            slot-scope="{ row }"
            class="cell-ellipsis"
            :title="row.pointsOfFocusName"
          >
            {{ row.pointsOfFocusName || "-" }}
          </div>
          <div
            slot="additionalDescription"
            slot-scope="{ row }"
            class="cell-ellipsis"
            :title="row.additionalDescription"
          >
            {{ row.additionalDescription || "-" }}
          </div>
          <div slot="btn_edit" slot-scope="{ row }" class="cm-op-actions">
            <el-button
              type="text"
              size="small"
              class="cm-op-link"
              @click="openDrawer('edit', row)"
            >
              Edit
            </el-button>
            <span class="cm-op-sep">|</span>
            <el-button
              type="text"
              size="small"
              class="cm-op-link cm-op-danger"
              @click="handleDelete(row)"
            >
              Delete
            </el-button>
          </div>
        </Vxetable>
      </div>
    </div>

    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="480px"
      :wrapper-closable="false"
      custom-class="risk-spec-drawer"
    >
      <div class="spec_body">
        <div class="form_item">
          <label>
            CC Criteria
            <span class="required">*</span>
          </label>
          <el-select
            v-model="formData.ccCriteria"
            filterable
            allow-create
            default-first-option
            placeholder="Select or enter CC Criteria"
            style="width: 100%"
          >
            <el-option
              v-for="item in ccCriteriaOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <div class="form_item">
          <label>Cycle_Name</label>
          <el-input v-model="formData.cycleName" placeholder="e.g. V1" />
        </div>
        <div class="form_item">
          <label>Modules_ID</label>
          <el-input v-model="formData.modulesId" placeholder="Enter Modules_ID" />
        </div>
        <div class="form_item">
          <label>Modules_Name</label>
          <el-input
            v-model="formData.modulesName"
            placeholder="Enter Modules_Name"
          />
        </div>
        <div class="form_item">
          <label>CC_criteria_Name</label>
          <el-input
            v-model="formData.ccCriteriaName"
            placeholder="Enter CC_criteria_Name"
          />
        </div>
        <div class="form_item">
          <label>Sub-riskname</label>
          <el-input
            v-model="formData.subRiskName"
            type="textarea"
            :rows="2"
            placeholder="Enter Sub-riskname"
          />
        </div>
        <div class="form_item">
          <label>POINTS_OF_FOCUS_Name</label>
          <el-input
            v-model="formData.pointsOfFocusName"
            type="textarea"
            :rows="2"
            placeholder="Enter POINTS_OF_FOCUS_Name"
          />
        </div>
        <div class="form_item">
          <label>Risk_Level</label>
          <el-select
            v-model="formData.riskLevel"
            clearable
            placeholder="Select risk level"
            style="width: 100%"
          >
            <el-option
              v-for="level in riskLevelOptions"
              :key="level.value"
              :label="level.label"
              :value="level.value"
            />
          </el-select>
        </div>
        <div class="form_item">
          <label>Risk Source</label>
          <el-select
            v-model="formData.riskSource"
            clearable
            placeholder="Select risk source"
            style="width: 100%"
          >
            <el-option
              v-for="src in riskSourceOptions"
              :key="src.value"
              :label="src.label"
              :value="src.value"
            />
          </el-select>
        </div>
        <div class="form_item">
          <label>Additional Risk Profile Description</label>
          <el-input
            v-model="formData.additionalDescription"
            type="textarea"
            :rows="4"
            placeholder="Enter description"
          />
        </div>
      </div>

      <div class="spec_footer">
        <el-button type="primary" :loading="saving" @click="handleSave">
          Confirm
        </el-button>
        <el-button class="btn-cancel-green" @click="drawerVisible = false">
          Cancel
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
const emptyForm = () => ({
  riskId: null,
  ccCriteria: "",
  cycleName: "",
  modulesId: "",
  modulesName: "",
  ccCriteriaName: "",
  subRiskName: "",
  pointsOfFocusName: "",
  riskLevel: "MEDIUM",
  riskSource: "MANUAL",
  additionalDescription: "",
});

const RISK_LEVEL_OPTIONS = [
  { label: "High", value: "HIGH" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Low", value: "LOW" },
];

const RISK_SOURCE_OPTIONS = [
  { label: "Manual input", value: "MANUAL" },
  { label: "Upload", value: "UPLOAD" },
  { label: "AI generation", value: "AI_GENERATION" },
];

export default {
  name: "RcmFinal",
  data() {
    return {
      projectId: null,
      projectName: "",
      ccCriteriaFilter: "",
      descFilter: "",
      allRows: [],
      filteredRows: [],
      savingVersion: false,
      drawerVisible: false,
      drawerMode: "create",
      formData: emptyForm(),
      saving: false,
      riskLevelOptions: RISK_LEVEL_OPTIONS,
      riskSourceOptions: RISK_SOURCE_OPTIONS,
      tableTitles: [
        { fieldName: "ccCriteria", titleName: "CC Criteria", width: 100 },
        // 种子数据暂无值，先隐藏：Cycle_Name / Modules_ID / Modules_Name / Sub-riskname
        {
          fieldName: "ccCriteriaName",
          titleName: "CC_criteria_Name",
          width: 180,
          fontendType: "slot",
        },
        {
          fieldName: "pointsOfFocusName",
          titleName: "POINTS_OF_FOCUS_Name",
          width: 200,
          fontendType: "slot",
        },
        {
          fieldName: "riskLevel",
          titleName: "Risk_Level",
          width: 110,
          fontendType: "slot",
        },
        {
          fieldName: "riskSource",
          titleName: "Risk Source",
          width: 130,
          fontendType: "slot",
        },
        {
          fieldName: "additionalDescription",
          titleName: "Additional Risk Profile Description",
          width: 220,
          fontendType: "slot",
        },
      ],
      tablePage: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  computed: {
    drawerTitle() {
      return this.drawerMode === "edit" ? "Edit risk" : "New risk";
    },
    ccCriteriaOptions() {
      const set = new Set();
      this.allRows.forEach((row) => {
        if (row.ccCriteria) set.add(row.ccCriteria);
      });
      return Array.from(set);
    },
    pagedData() {
      const start =
        (this.tablePage.pageIndex - 1) * this.tablePage.pageSize;
      return this.filteredRows.slice(
        start,
        start + this.tablePage.pageSize,
      );
    },
  },
  created() {
    this.resolveProjectContext();
    this.loadList();
  },
  methods: {
    resolveProjectContext() {
      this.projectId =
        this.$route.query.projectId ||
        sessionStorage.getItem("currentProjectId") ||
        null;
      this.projectName =
        this.$route.query.projectName ||
        sessionStorage.getItem("currentProjectName") ||
        "";
    },
    clearProjectTag() {
      this.projectName = "";
    },
    pick(item, ...keys) {
      for (let i = 0; i < keys.length; i += 1) {
        const v = item[keys[i]];
        if (v != null && String(v).trim() !== "") return v;
      }
      return "";
    },
    displayOrDash(value) {
      const text = value == null ? "" : String(value).trim();
      return text || "-";
    },
    normalizeRiskLevelCode(raw) {
      const text = String(raw || "").trim();
      if (!text) return "";
      const upper = text.toUpperCase().replace(/\s+/g, "_");
      if (upper === "HIGH" || upper === "H") return "HIGH";
      if (upper === "LOW" || upper === "L") return "LOW";
      if (upper === "MEDIUM" || upper === "MED" || upper === "M") return "MEDIUM";
      if (upper.includes("HIGH")) return "HIGH";
      if (upper.includes("LOW")) return "LOW";
      if (upper.includes("MED")) return "MEDIUM";
      return "";
    },
    formatRiskLevelLabel(codeOrLabel) {
      const code = this.normalizeRiskLevelCode(codeOrLabel);
      const hit = RISK_LEVEL_OPTIONS.find((o) => o.value === code);
      return hit ? hit.label : codeOrLabel || "";
    },
    normalizeRiskSourceCode(raw) {
      const text = String(raw || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_")
        .replace(/-/g, "_");
      if (!text) return "";
      if (text === "MANUAL" || text === "MANUAL_INPUT") return "MANUAL";
      if (text === "UPLOAD" || text === "FINAL") return "UPLOAD";
      if (
        text === "AI" ||
        text === "AI_GENERATION" ||
        text === "AIGENERATION" ||
        text === "AI_GENERATED"
      ) {
        return "AI_GENERATION";
      }
      return "";
    },
    formatRiskSourceLabel(codeOrLabel) {
      const code = this.normalizeRiskSourceCode(codeOrLabel);
      const hit = RISK_SOURCE_OPTIONS.find((o) => o.value === code);
      return hit ? hit.label : codeOrLabel || "";
    },
    resolveRiskSourceCode(item) {
      const explicit = this.pick(item, "riskSource", "risk_source");
      const fromExplicit = this.normalizeRiskSourceCode(explicit);
      if (fromExplicit) return fromExplicit;
      const aiGenerated = item.aiGenerated || item.ai_generated;
      const stage = String(item.stage || "").toUpperCase();
      if (aiGenerated || stage === "AI_GENERATED") return "AI_GENERATION";
      if (stage === "MANUAL") return "MANUAL";
      if (stage === "FINAL" || stage === "UPLOAD") return "UPLOAD";
      return "MANUAL";
    },
    normalizeRow(item) {
      const riskLevel = this.normalizeRiskLevelCode(
        this.pick(item, "riskLevel", "risk_level"),
      );
      const riskSource = this.resolveRiskSourceCode(item);
      const ccCriteriaName = this.pick(
        item,
        "ccCriteriaName",
        "cc_criteria_name",
      );
      const subRiskName = this.pick(item, "subRiskName", "sub_risk_name");
      const pointsOfFocusName = this.pick(
        item,
        "pointsOfFocusName",
        "points_of_focus_name",
      );
      const additionalDescription = this.pick(
        item,
        "additionalRiskProfileDescription",
        "additional_risk_profile_description",
        "additionalDescription",
        "additional_description",
      );
      const cycleName = this.pick(item, "cycleName", "cycle_name");
      const modulesId = this.pick(item, "modulesId", "modules_id");
      const modulesName = this.pick(item, "modulesName", "modules_name");

      return {
        riskId: this.pick(item, "riskId", "risk_id", "id") || null,
        rcmId: this.pick(item, "rcmId", "rcm_id") || null,
        ccCriteria: this.pick(item, "ccCriteria", "cc_criteria"),
        cycleName: this.displayOrDash(cycleName),
        modulesId: this.displayOrDash(modulesId),
        modulesName: this.displayOrDash(modulesName),
        ccCriteriaName: this.displayOrDash(ccCriteriaName),
        subRiskName: this.displayOrDash(subRiskName),
        pointsOfFocusName: this.displayOrDash(pointsOfFocusName),
        riskLevel: riskLevel || "MEDIUM",
        riskSource: riskSource || "MANUAL",
        additionalDescription: this.displayOrDash(additionalDescription),
        description: additionalDescription || "",
      };
    },
    riskLevelClass(level) {
      const v = this.normalizeRiskLevelCode(level).toLowerCase();
      if (v === "high") return "risk-tag--high";
      if (v === "medium") return "risk-tag--medium";
      if (v === "low") return "risk-tag--low";
      return "risk-tag--default";
    },
    extractList(res) {
      const data = res && res.data;
      if (Array.isArray(data)) return data;
      if (!data || typeof data !== "object") return [];
      return (
        data.list ||
        data.records ||
        data.rows ||
        (Array.isArray(data.data) ? data.data : []) ||
        []
      );
    },
    async loadList() {
      if (!this.projectId) {
        this.$message.warning("Please open a project from Project overview first");
        this.allRows = [];
        this.applyFilters();
        return;
      }
      try {
        const res = await this.$api.riskTableList({
          projectId: this.projectId,
          pageNum: 1,
          pageSize: 2000,
        });
        if (res.code == 0) {
          const list = this.extractList(res);
          this.allRows = list.map((item) => this.normalizeRow(item));
          this.applyFilters();
        } else {
          this.$message.warning(res.message || "Load risk table failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Load risk table failed");
      }
    },
    applyFilters() {
      let rows = [...this.allRows];
      if (this.ccCriteriaFilter) {
        rows = rows.filter((r) => r.ccCriteria === this.ccCriteriaFilter);
      }
      const keyword = String(this.descFilter || "").trim().toLowerCase();
      if (keyword) {
        rows = rows.filter((r) => {
          const blob = [
            r.additionalDescription,
            r.subRiskName,
            r.ccCriteriaName,
            r.pointsOfFocusName,
            r.ccCriteria,
            r.modulesId,
            r.modulesName,
            r.cycleName,
          ]
            .join(" ")
            .toLowerCase();
          return blob.includes(keyword);
        });
      }
      this.filteredRows = rows;
      this.tablePage.total = rows.length;
      this.tablePage.pageIndex = 1;
    },
    onPageChange(page) {
      this.tablePage.pageIndex = page;
    },
    onSizeChange(size) {
      this.tablePage.pageSize = size;
      this.tablePage.pageIndex = 1;
    },
    async openDrawer(mode, row) {
      this.drawerMode = mode;
      if (mode === "edit" && row) {
        const riskId = row.riskId;
        if (riskId && this.$api.riskTableDetail) {
          try {
            const res = await this.$api.riskTableDetail(riskId, {
              projectId: this.projectId,
            });
            if (res && Number(res.code) === 0 && res.data) {
              const normalized = this.normalizeRow(res.data);
              const clean = (v) => (v === "-" ? "" : v || "");
              this.formData = {
                ...emptyForm(),
                riskId: normalized.riskId || riskId,
                ccCriteria: clean(normalized.ccCriteria),
                cycleName: clean(normalized.cycleName),
                modulesId: clean(normalized.modulesId),
                modulesName: clean(normalized.modulesName),
                ccCriteriaName: clean(normalized.ccCriteriaName),
                subRiskName: clean(normalized.subRiskName),
                pointsOfFocusName: clean(normalized.pointsOfFocusName),
                riskLevel:
                  this.normalizeRiskLevelCode(normalized.riskLevel) || "MEDIUM",
                riskSource:
                  this.normalizeRiskSourceCode(normalized.riskSource) ||
                  "MANUAL",
                additionalDescription: clean(normalized.additionalDescription),
              };
              this.drawerVisible = true;
              return;
            }
          } catch (e) {
            /* fallback to row */
          }
        }
        this.formData = {
          ...emptyForm(),
          riskId: row.riskId || null,
          ccCriteria: row.ccCriteria || "",
          cycleName: row.cycleName === "-" ? "" : row.cycleName || "",
          modulesId: row.modulesId === "-" ? "" : row.modulesId || "",
          modulesName: row.modulesName === "-" ? "" : row.modulesName || "",
          ccCriteriaName:
            row.ccCriteriaName === "-" ? "" : row.ccCriteriaName || "",
          subRiskName: row.subRiskName === "-" ? "" : row.subRiskName || "",
          pointsOfFocusName:
            row.pointsOfFocusName === "-" ? "" : row.pointsOfFocusName || "",
          riskLevel: this.normalizeRiskLevelCode(row.riskLevel) || "MEDIUM",
          riskSource: this.normalizeRiskSourceCode(row.riskSource) || "MANUAL",
          additionalDescription:
            row.additionalDescription === "-"
              ? ""
              : row.additionalDescription || "",
        };
      } else {
        this.formData = emptyForm();
      }
      this.drawerVisible = true;
    },
    validateForm() {
      if (!this.formData.ccCriteria || !String(this.formData.ccCriteria).trim()) {
        this.$message.warning("CC Criteria is required");
        return false;
      }
      return true;
    },
    buildPayload() {
      const blankToNull = (v) => {
        const text = String(v || "").trim();
        return text || null;
      };
      return {
        projectId: Number(this.projectId),
        ccCriteria: String(this.formData.ccCriteria || "").trim(),
        cycleName: blankToNull(this.formData.cycleName),
        modulesId: blankToNull(this.formData.modulesId),
        modulesName: blankToNull(this.formData.modulesName),
        ccCriteriaName: blankToNull(this.formData.ccCriteriaName),
        subRiskName: blankToNull(this.formData.subRiskName),
        pointsOfFocusName: blankToNull(this.formData.pointsOfFocusName),
        riskLevel: this.normalizeRiskLevelCode(this.formData.riskLevel) || "MEDIUM",
        riskSource:
          this.normalizeRiskSourceCode(this.formData.riskSource) || "MANUAL",
        additionalRiskProfileDescription: blankToNull(
          this.formData.additionalDescription,
        ),
      };
    },
    async handleSave() {
      if (!this.projectId) {
        this.$message.warning("Please open a project first");
        return;
      }
      if (!this.validateForm()) return;
      this.saving = true;
      try {
        const payload = this.buildPayload();
        let res;
        if (this.drawerMode === "edit" && this.formData.riskId) {
          res = await this.$api.riskTableUpdate(this.formData.riskId, payload);
        } else {
          res = await this.$api.riskTableCreate(payload);
        }
        if (res.code == 0) {
          this.$message.success(
            this.drawerMode === "edit"
              ? "Updated successfully"
              : "Created successfully",
          );
          this.drawerVisible = false;
          await this.loadList();
        } else {
          this.$message.error(res.message || "Save failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Save failed");
      } finally {
        this.saving = false;
      }
    },
    handleDelete(row) {
      const riskId = row && row.riskId;
      if (!riskId) {
        this.$message.warning("Missing risk id");
        return;
      }
      this.$confirm("Delete this risk record?", "Confirm", {
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          try {
            const res = await this.$api.riskTableDelete(riskId);
            if (res.code == 0) {
              this.$message.success("Deleted successfully");
              await this.loadList();
            } else {
              this.$message.error(res.message || "Delete failed");
            }
          } catch (e) {
            this.$message.error((e && e.message) || "Delete failed");
          }
        })
        .catch(() => {});
    },
    handleVersionSave() {
      if (!this.filteredRows.length) {
        this.$message.warning("No records to save");
        return;
      }
      this.$prompt("Enter change summary", "Version Save", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        inputPattern: /\S+/,
        inputErrorMessage: "Change summary is required",
        inputValue: "Risk table version save",
      })
        .then(async ({ value }) => {
          this.savingVersion = true;
          try {
            const targets = this.filteredRows.filter((r) => r.rcmId);
            if (!targets.length) {
              this.$message.warning(
                "No linked RCM records available for version save",
              );
              return;
            }
            let ok = 0;
            let fail = 0;
            for (const row of targets) {
              try {
                const res = await this.$api.rcmSaveVersion(row.rcmId, {
                  changeSummary: value,
                });
                if (res.code == 0) ok += 1;
                else fail += 1;
              } catch (e) {
                fail += 1;
              }
            }
            if (ok > 0 && fail === 0) {
              this.$message.success(`Saved ${ok} version(s)`);
            } else if (ok > 0) {
              this.$message.warning(`Saved ${ok}, failed ${fail}`);
            } else {
              this.$message.error("Version save failed");
            }
          } finally {
            this.savingVersion = false;
          }
        })
        .catch(() => {});
    },
    goControlTable() {
      const query = {};
      if (this.projectId) query.projectId = this.projectId;
      if (this.projectName) query.projectName = this.projectName;
      this.$router.push({ name: "ControlTesting", query });
    },
  },
};
</script>

<style lang="less" scoped>
.project-tag {
  margin-right: 4px;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter_item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cm-op-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.cm-op-link.el-button--text {
  color: #2563eb !important;
  font-size: 13px;
  font-weight: 600;
  padding: 0 !important;
  margin: 0 !important;
}

.cm-op-danger.el-button--text {
  color: #dc2626 !important;
}

.cm-op-sep {
  color: #cbd5e1;
  margin: 0 2px;
}

.risk-tag {
  display: inline-block;
  min-width: 64px;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  line-height: 20px;
}

.risk-tag--high {
  color: #fff;
  background: #dc2626;
}

.risk-tag--medium {
  color: #fff;
  background: #f59e0b;
}

.risk-tag--low {
  color: #fff;
  background: #16a34a;
}

.risk-tag--default {
  color: #475569;
  background: #e2e8f0;
}

.cell-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.spec_body {
  padding: 0 20px 80px;

  .form_item {
    margin-bottom: 16px;

    label {
      display: block;
      margin-bottom: 8px;
      color: #475569;
      font-weight: 600;
      font-size: 13px;
    }

    .required {
      color: #dc2626;
      margin-left: 2px;
    }
  }
}

.spec_footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 20px;
  background: #fff;
  border-top: 1px solid #e2e8f0;
  text-align: right;
}

.btn-cancel-green {
  background: #16a34a !important;
  border-color: #16a34a !important;
  color: #fff !important;
}
</style>

<style>
.risk-spec-drawer .el-drawer__header {
  margin-bottom: 12px;
  font-weight: 700;
}
</style>
