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
          :operation="false"
          :isfixed="true"
        >
          <div slot="riskLevel" slot-scope="{ row }">
            <span class="risk-tag" :class="riskLevelClass(row.riskLevel)">
              {{ row.riskLevel || "-" }}
            </span>
          </div>
          <div slot="riskSource" slot-scope="{ row }">
            {{ row.riskSource || "-" }}
          </div>
        </Vxetable>
      </div>
    </div>
  </div>
</template>

<script>
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
      tableTitles: [
        { fieldName: "ccCriteria", titleName: "CC Criteria", width: 110 },
        { fieldName: "cycleName", titleName: "Cycle_Name", width: 110 },
        { fieldName: "modulesId", titleName: "Modules_ID", width: 120 },
        { fieldName: "modulesName", titleName: "Modules_Name", width: 130 },
        { fieldName: "ccCriteriaName", titleName: "CC_criteria_Name", width: 150 },
        { fieldName: "subRiskName", titleName: "Sub-riskname", width: 140 },
        {
          fieldName: "pointsOfFocusName",
          titleName: "POINTS_OF_FOCUS_Name",
          width: 180,
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
    normalizeRiskLevel(raw) {
      const text = String(raw || "").trim();
      if (!text) return "";
      const upper = text.toUpperCase();
      if (upper.includes("HIGH") || upper === "H") return "High";
      if (upper.includes("LOW") || upper === "L") return "Low";
      if (upper.includes("MED") || upper === "M") return "Medium";
      if (/^[1-3]$/.test(text)) {
        return { 1: "Low", 2: "Medium", 3: "High" }[text];
      }
      if (/^[8-9]|10$/.test(text)) return "High";
      if (/^[4-7]$/.test(text)) return "Medium";
      if (/^[1-3]$/.test(text)) return "Low";
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },
    resolveRiskSource(item) {
      const aiGenerated = item.aiGenerated || item.ai_generated;
      const stage = String(item.stage || "").toUpperCase();
      if (aiGenerated || stage === "AI_GENERATED") return "AI generation";
      if (stage === "MANUAL") return "Manual input";
      if (stage === "FINAL") return "Upload";
      return "Manual input";
    },
    normalizeRow(item) {
      const riskLevel = this.normalizeRiskLevel(
        item.controlRiskRating || item.control_risk_rating || item.riskLevel,
      );
      const controlName = item.controlName || item.control_name || "";
      const riskDesc = item.riskDescription || item.risk_description || "";
      return {
        rcmId: item.rcmId || item.rcm_id,
        ccCriteria: item.category || "",
        cycleName: item.currentVersion || item.current_version || item.stage || "-",
        modulesId: item.controlCode || item.control_code || "",
        modulesName: item.moduleName || item.module_name || "",
        ccCriteriaName: controlName,
        subRiskName: riskDesc || controlName || "-",
        pointsOfFocusName:
          item.controlObjective ||
          item.control_objective ||
          item.evidenceRequirement ||
          item.evidence_requirement ||
          "-",
        riskLevel,
        riskSource: this.resolveRiskSource(item),
        additionalDescription: item.description || riskDesc || "-",
        description: item.description || "",
      };
    },
    riskLevelClass(level) {
      const v = String(level || "").toLowerCase();
      if (v === "high") return "risk-tag--high";
      if (v === "medium") return "risk-tag--medium";
      if (v === "low") return "risk-tag--low";
      return "risk-tag--default";
    },
    async loadList() {
      if (!this.projectId) {
        this.$message.warning("Please open a project from Project overview first");
        this.allRows = [];
        this.applyFilters();
        return;
      }
      try {
        // Risk table prioritizes Final stage; fallback to all if empty
        let res = await this.$api.rcmFinalList({ projectId: this.projectId });
        if (res.code == 0) {
          let list = Array.isArray(res.data) ? res.data : [];
          if (!list.length) {
            res = await this.$api.rcmList({ projectId: this.projectId });
            list = Array.isArray(res.data) ? res.data : [];
          }
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
            r.description,
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
</style>
