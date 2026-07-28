<template>
  <div class="cm-page">
    <div class="cm-page__body">
      <div class="cm-toolbar">
        <div class="cm-toolbar__left">
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
            <span class="cm-label">Round information</span>
            <el-select
              v-model="roundFilter"
              clearable
              placeholder="All"
              class="cm-select"
              @change="applyFilters"
            >
              <el-option label="All" value="" />
              <el-option
                v-for="item in roundOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div class="cm-toolbar__right">
          <el-select
            v-model="productFilter"
            class="cm-select cm-select--muted"
            placeholder="all product"
            clearable
          >
            <el-option label="all product" value="" />
            <el-option
              v-for="item in productOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-button class="cm-btn-secondary" @click="openDrawer('create')">
            New
          </el-button>
          <el-button class="cm-btn-invite" @click="goControlTesting">
            Control testing
          </el-button>
        </div>
      </div>

      <div class="cm-table-panel">
        <Vxetable
          ref="controlTable"
          @currentChange="onPageChange"
          @sizeChange="onSizeChange"
          :tablePage="tablePage"
          :tableTitles="tableTitles"
          :tableData="pagedData"
          :selection="false"
          operationW="140"
          :isfixed="true"
        >
          <div slot="controlName" slot-scope="{ row }" class="title-link" @click="openDrawer('edit', row)">
            {{ row.controlName || "-" }}
          </div>
          <div slot="btn_edit" slot-scope="{ row }" class="cm-op-actions">
            <el-button
              type="text"
              size="small"
              class="cm-op-invite"
              @click="openFileDialog(row)"
            >
              File management
            </el-button>
          </div>
        </Vxetable>
      </div>
    </div>

    <!-- Create / Edit Risk drawer -->
    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="460px"
      :wrapper-closable="false"
      custom-class="ct-spec-drawer"
    >
      <div class="spec_body">
        <div class="form_item">
          <label>
            CC_criteria_ID
            <span class="required">*</span>
          </label>
          <el-select
            v-model="formData.category"
            filterable
            allow-create
            default-first-option
            placeholder="Select or enter CC criteria"
            style="width: 100%"
          >
            <el-option
              v-for="item in ccCriteriaOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <p class="field_hint">Auto-suggested from existing data; required for New.</p>
        </div>

        <div class="form_item">
          <label>SCF Domain</label>
          <el-input v-model="formData.moduleName" placeholder="Enter SCF Domain" />
        </div>

        <div class="form_item">
          <label>Control Title</label>
          <el-input v-model="formData.controlName" placeholder="Enter Control Title" />
        </div>

        <div class="form_item">
          <label>Question description</label>
          <el-input
            v-model="formData.controlObjective"
            type="textarea"
            :rows="3"
            placeholder="Enter question description"
          />
        </div>

        <div class="form_item">
          <label>
            SCF Name
            <span class="required">*</span>
          </label>
          <el-input v-model="formData.controlCode" placeholder="Enter SCF Name" />
        </div>

        <div class="form_item">
          <label>
            Control description
            <span class="required">*</span>
          </label>
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="Enter control description"
          />
        </div>

        <div class="form_item">
          <label>methods comply with SCF</label>
          <el-input
            v-model="formData.implementationMethod"
            type="textarea"
            :rows="3"
            placeholder="Enter methods"
          />
        </div>

        <div class="form_item">
          <label>SCF control questions</label>
          <el-input
            v-model="formData.evidenceRequirement"
            type="textarea"
            :rows="3"
            placeholder="Enter SCF control questions"
          />
        </div>

        <div class="form_item">
          <label>relative control weighting</label>
          <el-input
            v-model="formData.controlRiskRating"
            placeholder="1-10"
          />
        </div>

        <div class="form_item">
          <label>Function grouping</label>
          <el-input
            v-model="formData.additionalOwner"
            placeholder="Enter function grouping"
          />
        </div>
      </div>

      <div class="spec_footer">
        <el-button type="primary" :loading="saving" @click="handleSave">
          Confirm
        </el-button>
        <el-button
          v-if="drawerMode === 'edit'"
          class="btn-delete-red"
          :loading="deleting"
          @click="handleDeleteFromDrawer"
        >
          Delete
        </el-button>
        <el-button class="btn-cancel-green" @click="drawerVisible = false">
          Cancel
        </el-button>
      </div>
    </el-drawer>

    <FileManagement
      :visible="fileDialogVisible"
      title="File management"
      @update:visible="fileDialogVisible = $event"
    />
  </div>
</template>

<script>
import FileManagement from "@/components/FileManagement/index.vue";

const emptyForm = () => ({
  rcmId: null,
  category: "",
  moduleName: "",
  controlName: "",
  controlObjective: "",
  controlCode: "",
  description: "",
  implementationMethod: "",
  evidenceRequirement: "",
  controlRiskRating: "",
  additionalOwner: "",
  riskDescription: "",
  status: "PENDING",
  stage: "MANUAL",
});

export default {
  name: "ControlTesting",
  components: {
    FileManagement,
  },
  data() {
    return {
      projectId: null,
      projectName: "",
      productFilter: "",
      productOptions: ["SOC2", "ISO27001"],
      ccCriteriaFilter: "",
      roundFilter: "",
      roundOptions: [
        { label: "Manual", value: "MANUAL" },
        { label: "Final", value: "FINAL" },
        { label: "AI Generated", value: "AI_GENERATED" },
      ],
      allRows: [],
      filteredRows: [],
      tableTitles: [
        { fieldName: "category", titleName: "CC CRITERIA", width: 110 },
        { fieldName: "moduleName", titleName: "SCF Domain", width: 110 },
        {
          fieldName: "controlName",
          titleName: "Control title",
          width: 160,
          fontendType: "slot",
        },
        {
          fieldName: "controlObjective",
          titleName: "SCF Control Question Description",
          width: 200,
        },
        { fieldName: "controlCode", titleName: "SCF Name", width: 120 },
        {
          fieldName: "description",
          titleName: "Control Description",
          width: 180,
        },
        {
          fieldName: "implementationMethod",
          titleName: "Methods to Comply with SCF",
          width: 180,
        },
        {
          fieldName: "evidenceRequirement",
          titleName: "SCF Control Questions",
          width: 160,
        },
        {
          fieldName: "keyControlQuestion",
          titleName: "Key Control Table Question (Yes/No)",
          width: 180,
        },
        {
          fieldName: "controlRiskRating",
          titleName: "Relative Control Weighting (1-10)",
          width: 180,
        },
        {
          fieldName: "additionalOwner",
          titleName: "Function Grouping",
          width: 130,
        },
        {
          fieldName: "controlTestingRiskId",
          titleName: "Control testing Risk ID",
          width: 150,
        },
        { fieldName: "label", titleName: "Label", width: 100 },
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
      deleting: false,
      fileDialogVisible: false,
      currentFileRow: null,
    };
  },
  computed: {
    drawerTitle() {
      return this.drawerMode === "edit" ? "Edit Risk" : "Create/Edit Risk";
    },
    ccCriteriaOptions() {
      const set = new Set();
      this.allRows.forEach((row) => {
        if (row.category) set.add(row.category);
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
    normalizeRow(item) {
      const riskDesc = item.riskDescription || item.risk_description || "";
      const status = item.status || "";
      const stage = item.stage || "";
      return {
        rcmId: item.rcmId || item.rcm_id,
        projectId: item.projectId || item.project_id,
        category: item.category || "",
        moduleName: item.moduleName || item.module_name || "",
        controlName: item.controlName || item.control_name || "",
        controlObjective:
          item.controlObjective || item.control_objective || "",
        controlCode: item.controlCode || item.control_code || "",
        description: item.description || "",
        implementationMethod:
          item.implementationMethod || item.implementation_method || "",
        evidenceRequirement:
          item.evidenceRequirement || item.evidence_requirement || "",
        controlRiskRating:
          item.controlRiskRating || item.control_risk_rating || "",
        additionalOwner:
          item.additionalOwner || item.additional_owner || "",
        riskDescription: riskDesc,
        keyControlQuestion: riskDesc || "-",
        controlTestingRiskId: item.rcmId || item.rcm_id || "-",
        label: status || stage || "-",
        status,
        stage,
        currentVersion: item.currentVersion || item.current_version || "V1",
      };
    },
    async loadList() {
      if (!this.projectId) {
        this.$message.warning("Please open a project from Project overview first");
        this.allRows = [];
        this.applyFilters();
        return;
      }
      try {
        const params = { projectId: this.projectId };
        if (this.roundFilter) params.stage = this.roundFilter;
        if (this.ccCriteriaFilter) params.category = this.ccCriteriaFilter;
        const res = await this.$api.rcmList(params);
        if (res.code == 0) {
          const list = Array.isArray(res.data) ? res.data : [];
          this.allRows = list.map((item) => this.normalizeRow(item));
          this.applyFilters();
        } else {
          this.$message.warning(res.message || "Load control table failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Load control table failed");
      }
    },
    applyFilters() {
      let rows = [...this.allRows];
      if (this.ccCriteriaFilter) {
        rows = rows.filter((r) => r.category === this.ccCriteriaFilter);
      }
      if (this.roundFilter) {
        rows = rows.filter((r) => r.stage === this.roundFilter);
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
    openDrawer(mode, row) {
      this.drawerMode = mode;
      if (mode === "edit" && row) {
        this.formData = {
          ...emptyForm(),
          rcmId: row.rcmId,
          category: row.category || "",
          moduleName: row.moduleName || "",
          controlName: row.controlName || "",
          controlObjective: row.controlObjective || "",
          controlCode: row.controlCode || "",
          description: row.description || "",
          implementationMethod: row.implementationMethod || "",
          evidenceRequirement: row.evidenceRequirement || "",
          controlRiskRating: row.controlRiskRating || "",
          additionalOwner: row.additionalOwner || "",
          riskDescription: row.riskDescription || "",
          status: row.status || "PENDING",
          stage: row.stage || "MANUAL",
        };
      } else {
        this.formData = emptyForm();
      }
      this.drawerVisible = true;
    },
    validateForm() {
      if (!this.formData.category || !String(this.formData.category).trim()) {
        this.$message.warning("CC_criteria_ID is required");
        return false;
      }
      if (!this.formData.controlCode || !String(this.formData.controlCode).trim()) {
        this.$message.warning("SCF Name is required");
        return false;
      }
      if (!this.formData.description || !String(this.formData.description).trim()) {
        this.$message.warning("Control description is required");
        return false;
      }
      if (!this.formData.controlName || !String(this.formData.controlName).trim()) {
        this.formData.controlName = this.formData.controlCode;
      }
      return true;
    },
    buildPayload() {
      return {
        projectId: Number(this.projectId),
        controlCode: this.formData.controlCode.trim(),
        controlName: (this.formData.controlName || this.formData.controlCode).trim(),
        description: this.formData.description,
        category: this.formData.category,
        moduleName: this.formData.moduleName,
        controlObjective: this.formData.controlObjective,
        implementationMethod: this.formData.implementationMethod,
        evidenceRequirement: this.formData.evidenceRequirement,
        controlRiskRating: this.formData.controlRiskRating,
        additionalOwner: this.formData.additionalOwner,
        riskDescription: this.formData.riskDescription,
        status: this.formData.status || "PENDING",
        stage: this.formData.stage || "MANUAL",
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
        if (this.drawerMode === "edit" && this.formData.rcmId) {
          res = await this.$api.rcmUpdate(this.formData.rcmId, payload);
        } else {
          res = await this.$api.rcmCreate(payload);
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
    handleDeleteFromDrawer() {
      if (!this.formData.rcmId) return;
      this.$confirm("Confirm delete this record?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          this.deleting = true;
          try {
            const res = await this.$api.rcmDelete(this.formData.rcmId);
            if (res.code == 0) {
              this.$message.success("Deleted successfully");
              this.drawerVisible = false;
              await this.loadList();
            } else {
              this.$message.error(res.message || "Delete failed");
            }
          } catch (e) {
            this.$message.error((e && e.message) || "Delete failed");
          } finally {
            this.deleting = false;
          }
        })
        .catch(() => {});
    },
    openFileDialog(row) {
      this.currentFileRow = row;
      this.fileDialogVisible = true;
    },
    goControlTesting() {
      this.$message.info("Control testing page coming soon");
    },
  },
};
</script>

<style lang="less" scoped>
.cm-select--muted {
  width: 140px;
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

.cm-op-invite.el-button--text {
  color: #2563eb !important;
  font-size: 13px;
  font-weight: 600;
  padding: 0 !important;
  margin: 0 !important;
}

.title-link {
  color: #0f766e;
  cursor: pointer;
  font-weight: 600;
}

.title-link:hover {
  text-decoration: underline;
}

.filter_item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

.btn-delete-red {
  background: #dc2626 !important;
  border-color: #dc2626 !important;
  color: #fff !important;
}
</style>

<style>
.ct-spec-drawer .el-drawer__header {
  margin-bottom: 12px;
  padding: 16px 20px 8px;
  font-weight: 700;
  color: #0f172a;
}
</style>
