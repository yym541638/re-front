<template>
  <div class="cm-page">
    <div class="cm-page__body">
      <div class="cm-toolbar">
        <div class="cm-toolbar__left">
          <el-button class="cm-btn-primary" type="primary" @click="openDrawer('create')">
            New
          </el-button>
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
            <span class="cm-label">Remediation</span>
            <el-select
              v-model="remediationFilter"
              clearable
              placeholder="All"
              class="cm-select"
              @change="applyFilters"
            >
              <el-option label="All" value="" />
              <el-option label="YES" value="YES" />
              <el-option label="NO" value="NO" />
            </el-select>
          </div>
        </div>
        <div class="cm-toolbar__right">
          <el-button class="cm-btn-invite" @click="goPassingScores">
            Passing scores
          </el-button>
        </div>
      </div>

      <div class="cm-table-panel">
        <Vxetable
          ref="gapTable"
          @currentChange="onPageChange"
          @sizeChange="onSizeChange"
          :tablePage="tablePage"
          :tableTitles="tableTitles"
          :tableData="pagedData"
          :selection="false"
          :operation="false"
          :isfixed="true"
        >
          <div
            slot="issueTitle"
            slot-scope="{ row }"
            class="title-link"
            @click="openDrawer('edit', row)"
          >
            {{ row.issueTitle || "-" }}
          </div>
        </Vxetable>
      </div>
    </div>

    <el-drawer
      title="Gap analysis"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="460px"
      :wrapper-closable="false"
      custom-class="gap-spec-drawer"
    >
      <div class="spec_body">
        <div class="form_item">
          <label>Issue_ID</label>
          <el-input :value="formData.issueIdDisplay" disabled placeholder="Auto generated" />
          <p class="field_hint">自动生成</p>
        </div>

        <div class="form_item">
          <label>Issue_Title<span class="required">*</span></label>
          <el-input v-model="formData.issueTitle" placeholder="Enter issue title" />
        </div>

        <div class="form_item">
          <label>Issue_Description</label>
          <el-input
            v-model="formData.issueDescription"
            type="textarea"
            :rows="3"
            placeholder="Enter issue description"
          />
        </div>

        <div class="form_item">
          <label>Issue_Creation_Date</label>
          <el-input
            :value="formData.issueCreationDate"
            disabled
            placeholder="日期自动获取"
          />
        </div>

        <div class="form_item">
          <label>Control ID</label>
          <el-select
            v-model="formData.controlId"
            filterable
            clearable
            placeholder="Data from Control table"
            style="width: 100%"
            @change="onControlChange"
          >
            <el-option
              v-for="item in controlOptions"
              :key="item.rcmId"
              :label="item.label"
              :value="item.rcmId"
            />
          </el-select>
        </div>

        <div class="form_item">
          <label>Control Description</label>
          <el-input
            v-model="formData.controlDescription"
            type="textarea"
            :rows="3"
            placeholder="Data from Control table"
          />
          <p class="field_hint">与 Control ID 对应</p>
        </div>

        <div class="form_item">
          <label>Remediation Plan</label>
          <el-input
            v-model="formData.remediationPlan"
            type="textarea"
            :rows="3"
            placeholder="Enter remediation plan"
          />
        </div>

        <div class="form_item">
          <label>Remediation YES/NO</label>
          <el-select v-model="formData.remediationYesNo" style="width: 100%">
            <el-option label="YES" value="YES" />
            <el-option label="NO" value="NO" />
          </el-select>
        </div>

        <div class="form_item">
          <label>Remediation Date</label>
          <el-date-picker
            v-model="formData.remediationDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="年月日时分秒"
            style="width: 100%"
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
  gapId: null,
  issueIdDisplay: "Auto generated",
  issueTitle: "",
  issueDescription: "",
  issueCreationDate: "",
  controlId: null,
  controlDescription: "",
  remediationPlan: "",
  remediationYesNo: "NO",
  remediationDate: "",
  ccCriteria: "",
});

export default {
  name: "GapAnalysis",
  data() {
    return {
      projectId: null,
      ccCriteriaFilter: "",
      remediationFilter: "",
      allRows: [],
      filteredRows: [],
      controlOptions: [],
      controlMap: {},
      tableTitles: [
        { fieldName: "issueId", titleName: "Issue_ID", width: 100 },
        {
          fieldName: "issueTitle",
          titleName: "Issue_Title",
          width: 160,
          fontendType: "slot",
        },
        { fieldName: "issueDescription", titleName: "Issue_Description", width: 200 },
        { fieldName: "issueCreationDate", titleName: "Issue_Creation_Date", width: 160 },
        { fieldName: "controlIdDisplay", titleName: "Control I.D", width: 120 },
        { fieldName: "controlDescription", titleName: "Control Description", width: 180 },
        { fieldName: "remediationPlan", titleName: "Remediation Plan", width: 180 },
        { fieldName: "remediationYesNo", titleName: "Remediation YES/NO", width: 140 },
        { fieldName: "remediationDate", titleName: "Remediation_Date", width: 160 },
      ],
      tablePage: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
      },
      drawerVisible: false,
      drawerMode: "create",
      formData: emptyForm(),
      saving: false,
    };
  },
  computed: {
    ccCriteriaOptions() {
      const set = new Set();
      this.allRows.forEach((row) => {
        if (row.ccCriteria) set.add(row.ccCriteria);
      });
      this.controlOptions.forEach((item) => {
        if (item.category) set.add(item.category);
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
  async created() {
    this.resolveProjectContext();
    await this.loadControls();
    await this.loadList();
  },
  methods: {
    resolveProjectContext() {
      this.projectId =
        this.$route.query.projectId ||
        sessionStorage.getItem("currentProjectId") ||
        null;
    },
    formatDateTime(value) {
      if (!value) return "";
      const text = String(value).replace("T", " ");
      return text.length >= 19 ? text.slice(0, 19) : text;
    },
    statusToYesNo(status) {
      return String(status || "").toUpperCase() === "CLOSED" ? "YES" : "NO";
    },
    normalizeRow(item) {
      const gapId = item.gapId || item.gap_id;
      const sourceId = item.sourceTestId || item.source_test_id;
      const control = this.controlMap[sourceId] || {};
      const status = item.status || "";
      const remediationYesNo = this.statusToYesNo(status);
      return {
        gapId,
        issueId: gapId,
        issueTitle: item.controlTitle || item.control_title || "",
        issueDescription: item.gapDescription || item.gap_description || "",
        issueCreationDate: this.formatDateTime(item.createdAt || item.created_at),
        controlId: sourceId || null,
        controlIdDisplay: control.controlCode || sourceId || "-",
        controlDescription: control.description || "",
        remediationPlan:
          item.remediationSuggestion || item.remediation_suggestion || "",
        remediationYesNo,
        remediationDate:
          remediationYesNo === "YES"
            ? this.formatDateTime(item.updatedAt || item.updated_at)
            : "",
        ccCriteria: control.category || "",
        status,
        gapLevel: item.gapLevel || item.gap_level || "",
      };
    },
    async loadControls() {
      if (!this.projectId) {
        this.controlOptions = [];
        this.controlMap = {};
        return;
      }
      try {
        const res = await this.$api.rcmList({ projectId: this.projectId });
        if (res.code == 0) {
          const list = Array.isArray(res.data) ? res.data : [];
          const map = {};
          this.controlOptions = list.map((item) => {
            const rcmId = item.rcmId || item.rcm_id;
            const controlCode = item.controlCode || item.control_code || "";
            const controlName = item.controlName || item.control_name || "";
            const description = item.description || "";
            const category = item.category || "";
            const option = {
              rcmId,
              controlCode,
              controlName,
              description,
              category,
              label: controlCode
                ? `${controlCode} - ${controlName || description || rcmId}`
                : String(rcmId),
            };
            map[rcmId] = option;
            return option;
          });
          this.controlMap = map;
        }
      } catch (e) {
        /* ignore control load failure */
      }
    },
    async loadList() {
      if (!this.projectId) {
        this.$message.warning("Please open a project from Project overview first");
        this.allRows = [];
        this.applyFilters();
        return;
      }
      try {
        const res = await this.$api.gapAnalysisList({
          projectId: this.projectId,
        });
        if (res.code == 0) {
          const list = Array.isArray(res.data) ? res.data : [];
          this.allRows = list.map((item) => this.normalizeRow(item));
          this.applyFilters();
        } else {
          this.$message.warning(res.message || "Load gap analysis failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Load gap analysis failed");
      }
    },
    applyFilters() {
      let rows = [...this.allRows];
      if (this.ccCriteriaFilter) {
        rows = rows.filter((r) => r.ccCriteria === this.ccCriteriaFilter);
      }
      if (this.remediationFilter) {
        rows = rows.filter(
          (r) => r.remediationYesNo === this.remediationFilter,
        );
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
    onControlChange(rcmId) {
      const control = this.controlMap[rcmId];
      if (control) {
        this.formData.controlDescription = control.description || "";
        if (!this.formData.issueTitle) {
          this.formData.issueTitle = control.controlName || control.controlCode || "";
        }
        this.formData.ccCriteria = control.category || "";
      } else {
        this.formData.controlDescription = "";
      }
    },
    openDrawer(mode, row) {
      this.drawerMode = mode;
      if (mode === "edit" && row) {
        this.formData = {
          gapId: row.gapId,
          issueIdDisplay: String(row.issueId || ""),
          issueTitle: row.issueTitle || "",
          issueDescription: row.issueDescription || "",
          issueCreationDate: row.issueCreationDate || "",
          controlId: row.controlId || null,
          controlDescription: row.controlDescription || "",
          remediationPlan: row.remediationPlan || "",
          remediationYesNo: row.remediationYesNo || "NO",
          remediationDate: row.remediationDate || "",
          ccCriteria: row.ccCriteria || "",
        };
      } else {
        this.formData = emptyForm();
        this.formData.issueCreationDate = this.formatDateTime(new Date().toISOString());
      }
      this.drawerVisible = true;
    },
    async handleSave() {
      if (!this.projectId) {
        this.$message.warning("Please open a project first");
        return;
      }
      if (!this.formData.issueTitle || !String(this.formData.issueTitle).trim()) {
        this.$message.warning("Issue_Title is required");
        return;
      }
      this.saving = true;
      try {
        const payload = {
          projectId: Number(this.projectId),
          controlTitle: this.formData.issueTitle.trim(),
          gapDescription: this.formData.issueDescription,
          remediationSuggestion: this.formData.remediationPlan,
          remediationYesNo: this.formData.remediationYesNo || "NO",
          sourceTestId: this.formData.controlId || null,
          controlDescription: this.formData.controlDescription,
        };
        let res;
        if (this.drawerMode === "edit" && this.formData.gapId) {
          res = await this.$api.gapAnalysisUpdate(this.formData.gapId, payload);
        } else {
          res = await this.$api.gapAnalysisCreate(payload);
        }
        if (res.code == 0) {
          this.$message.success(
            this.drawerMode === "edit" ? "Updated successfully" : "Created successfully",
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
    goPassingScores() {
      const query = {};
      if (this.projectId) query.projectId = this.projectId;
      this.$router.push({ name: "PassingScores", query });
    },
  },
};
</script>

<style lang="less" scoped>
.filter_item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cm-btn-invite {
  background: #16a34a !important;
  border-color: #16a34a !important;
  color: #fff !important;
  min-width: 130px;
  border-radius: 4px;
  font-weight: 600;
}

.cm-btn-invite:hover,
.cm-btn-invite:focus {
  background: #15803d !important;
  border-color: #15803d !important;
  color: #fff !important;
}

.title-link {
  color: #0f766e;
  cursor: pointer;
  font-weight: 600;
}

.title-link:hover {
  text-decoration: underline;
}

.spec_body {
  padding: 0 20px 80px;
  height: 100%;
  overflow: auto;
  box-sizing: border-box;
}

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

.field_hint {
  margin: 6px 0 0;
  font-size: 12px;
  color: #94a3b8;
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
.gap-spec-drawer .el-drawer__header {
  margin-bottom: 12px;
  padding: 16px 20px 8px;
  font-weight: 700;
  color: #0f172a;
}
</style>
