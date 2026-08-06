<template>
  <div class="cm-page">
    <div class="cm-page__body">
      <div class="cm-toolbar">
        <div class="cm-toolbar__left">
          <el-button class="cm-btn-primary" type="primary" @click="openForm('create')">
            New
          </el-button>
          <el-button class="cm-btn-secondary" @click="fileDialogVisible = true">
            File management
          </el-button>
        </div>
        <div class="cm-toolbar__right">
          <span class="cm-label">{{ currentVersionLabel || "No version" }}</span>
          <el-button
            class="cm-btn-primary"
            type="primary"
            :loading="savingVersion"
            :disabled="!requestMasterId"
            @click="handleVersionSave"
          >
            Version Save
          </el-button>
          <el-button class="cm-btn-secondary" @click="openVersionSelect">
            Version Select
          </el-button>
          <el-button class="cm-btn-secondary" @click="goControl">
            Control
          </el-button>
        </div>
      </div>

      <div v-if="loadError" class="cm-empty-tip">
        {{ loadError }}
      </div>
      <div
        v-else-if="!loading && !tableData.length && requestMasterId"
        class="cm-empty-tip"
      >
        No request individuals yet.
      </div>

      <div class="cm-table-panel">
        <Vxetable
          ref="individualTable"
          :tablePage="tablePage"
          :tableTitles="tableTitles"
          :tableData="pagedData"
          :selection="false"
          :tablePageState="true"
          operationW="280"
          :isfixed="true"
          @currentChange="onPageChange"
          @sizeChange="onSizeChange"
        >
          <div slot="btn_edit" slot-scope="{ row }" class="cm-op-actions">
            <el-button
              type="text"
              size="small"
              class="cm-op-link"
              @click="openForm('edit', row)"
            >
              Edit
            </el-button>
            <span class="cm-op-sep">|</span>
            <el-button
              type="text"
              size="small"
              class="cm-op-link"
              @click="openForm('view', row)"
            >
              Detail
            </el-button>
            <span class="cm-op-sep">|</span>
            <el-button
              type="text"
              size="small"
              class="cm-op-link"
              @click="openProjectInvite"
            >
              Invite
            </el-button>
            <span class="cm-op-sep">|</span>
            <el-button
              type="text"
              size="small"
              class="cm-op-danger"
              @click="confirmDelete(row)"
            >
              Delete
            </el-button>
          </div>
          <div slot="reviewStatus" slot-scope="{ row }">
            <span
              class="review_ai_tag"
              :class="reviewAiToneClass(row.reviewAiRaw || row.reviewStatus)"
            >
              {{ row.reviewStatus || "-" }}
            </span>
          </div>
        </Vxetable>
      </div>
    </div>

    <!-- Request individual form -->
    <el-drawer
      title="Request individual"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="520px"
      :wrapper-closable="false"
      custom-class="ri-spec-drawer"
    >
      <div class="spec_body">
        <div class="form_item">
          <label>Request Name <span class="required">*</span></label>
          <el-input
            v-model.trim="formData.requestName"
            placeholder="Request name"
            :disabled="formReadonly"
          />
        </div>

        <div class="form_item">
          <label>CC criteria</label>
          <el-input
            v-model.trim="formData.ccCriteria"
            placeholder="CC criteria"
            :disabled="formReadonly"
          />
        </div>

        <div class="form_item">
          <label>Point of focus</label>
          <el-input
            v-model.trim="formData.pointsOfFocus"
            placeholder="Point of focus"
            :disabled="formReadonly"
          />
        </div>

        <div class="form_item">
          <label>Request Description</label>
          <el-input
            v-model.trim="formData.requestDescription"
            type="textarea"
            :rows="3"
            placeholder="Request description"
            :disabled="formReadonly"
          />
        </div>

        <div class="form_item">
          <label>Request Creation Date</label>
          <el-input :value="formData.creationDateDisplay" disabled />
        </div>

        <div class="form_item" v-if="formMode !== 'create'">
          <label>Upload evidence</label>
          <div class="evidence_table">
            <table>
              <thead>
                <tr>
                  <th>File No</th>
                  <th>File</th>
                  <th>Time</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(file, idx) in formData.evidences" :key="file.attachment_id || idx">
                  <td>{{ idx + 1 }}</td>
                  <td>{{ file.file || file.fileName || "-" }}</td>
                  <td>{{ formatDateTime(file.time || file.createdAt) }}</td>
                  <td>
                    <el-button
                      type="text"
                      class="cm-op-link"
                      :disabled="formReadonly"
                      @click="renameEvidence(file)"
                    >
                      Edit
                    </el-button>
                    <span class="cm-op-sep">|</span>
                    <el-button
                      type="text"
                      class="cm-op-danger"
                      :disabled="formReadonly"
                      @click="removeEvidence(file)"
                    >
                      Delete
                    </el-button>
                  </td>
                </tr>
                <tr v-if="!formData.evidences.length">
                  <td colspan="4" class="empty_cell">No evidence files</td>
                </tr>
              </tbody>
            </table>
            <el-upload
              v-if="!formReadonly && formData.requestId"
              class="evidence_upload"
              action=""
              :show-file-list="false"
              :http-request="uploadEvidence"
            >
              <el-button size="mini" class="cm-btn-secondary">Upload</el-button>
            </el-upload>
          </div>
        </div>

        <div class="form_item">
          <label>CommentContent</label>
          <el-input
            v-model.trim="formData.commentContent"
            type="textarea"
            :rows="3"
            placeholder="Comment"
            :disabled="formReadonly"
          />
        </div>

        <div class="form_item" v-if="formMode !== 'create'">
          <label>Request Evidence Review AI</label>
          <div
            class="review_ai_value"
            :class="reviewAiToneClass(formData.reviewAiRaw || formData.reviewAiStatus)"
          >
            {{ formData.reviewAiStatus || "-" }}
          </div>
        </div>
      </div>

      <div class="spec_footer">
        <el-button
          v-if="!formReadonly"
          type="primary"
          class="cm-btn-primary"
          :loading="saving"
          @click="handleSave"
        >
          Save
        </el-button>
        <el-button class="cm-btn-secondary" @click="drawerVisible = false">
          Back
        </el-button>
      </div>
    </el-drawer>

    <!-- Version select -->
    <el-dialog
      title="Version Select"
      :visible.sync="versionDialogVisible"
      width="420px"
      :close-on-click-modal="false"
      custom-class="cm-dialog"
    >
      <el-select v-model="selectedVersionId" style="width: 100%" placeholder="Select version">
        <el-option
          v-for="v in versions"
          :key="v.version_id"
          :label="versionOptionLabel(v)"
          :value="v.version_id"
        />
      </el-select>
      <span slot="footer" class="cm-dialog__footer">
        <el-button class="cm-btn-primary" @click="confirmVersion">Confirm</el-button>
        <el-button class="cm-btn-secondary" @click="versionDialogVisible = false">
          Cancel
        </el-button>
      </span>
    </el-dialog>

    <FileManagement
      :visible="fileDialogVisible"
      title="File management"
      :request-master-id="requestMasterId"
      @update:visible="fileDialogVisible = $event"
    />

    <el-dialog
      title="Project invite"
      :visible.sync="inviteDialogVisible"
      width="520px"
      :close-on-click-modal="false"
      custom-class="cm-dialog"
    >
      <p class="invite_hint">
        Copy the text below and send it to new users. They can open the link to
        register and join this project.
      </p>
      <el-input
        class="invite_text_area"
        type="textarea"
        :rows="16"
        :value="inviteText"
        readonly
      />
      <span slot="footer" class="cm-dialog__footer">
        <el-button class="cm-btn-primary" type="primary" @click="copyInviteText">
          Copy
        </el-button>
        <el-button
          class="cm-btn-secondary"
          @click="inviteDialogVisible = false"
        >
          Close
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FileManagement from "@/components/FileManagement/index.vue";
import {
  buildProjectInviteText,
  getCurrentProjectInviteContext,
} from "../utils/projectInvite";

const emptyForm = () => ({
  requestId: null,
  requestName: "",
  ccCriteria: "",
  pointsOfFocus: "",
  requestDescription: "",
  creationDate: "",
  creationDateDisplay: "-",
  commentContent: "",
  sendDateDisplay: "-",
  reviewAiStatus: "",
  reviewAiRaw: "",
  evidences: [],
});

/** AI 返回 red/yellow/green → 列表展示文案 */
const REVIEW_AI_LABELS = {
  red: "not right",
  yellow: "need attention",
  green: "all good",
};

const mapReviewAiStatus = (raw) => {
  if (raw == null || raw === "") return "";
  const text = String(raw).trim();
  const lower = text.toLowerCase();
  if (REVIEW_AI_LABELS[lower]) return REVIEW_AI_LABELS[lower];
  if (lower === "not right" || lower === "need attention" || lower === "all good") {
    return lower;
  }
  return text;
};

const extractReviewAiRaw = (source = {}) =>
  source.request_evidence_review_ai_status ||
  source.requestEvidenceReviewAiStatus ||
  source.request_individual_review_status ||
  source.requestIndividualReviewStatus ||
  source.review_ai_status ||
  source.reviewAiStatus ||
  source.reviewStatus ||
  source.ai_status ||
  source.aiStatus ||
  "";

const nowDateTime = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

export default {
  name: "RequestIndividual",
  components: {
    FileManagement,
  },
  data() {
    return {
      tableTitles: [
        { fieldName: "requestName", titleName: "Request Name" },
        { fieldName: "ccCriteria", titleName: "CC Criteria" },
        { fieldName: "pointsOfFocus", titleName: "Point of focus" },
        { fieldName: "requestDescription", titleName: "Request Description" },
        { fieldName: "creationDateDisplay", titleName: "Request Creator Date" },
        { fieldName: "requestAssignee", titleName: "Request assigner" },
        { fieldName: "documentOwnerName", titleName: "Document Owner Name" },
        { fieldName: "uploadEvidence", titleName: "Upload Evidence" },
        {
          fieldName: "uploadEvidenceDateDisplay",
          titleName: "Upload Evidence Date",
        },
        { fieldName: "commentContent", titleName: "Comment Content" },
        {
          fieldName: "evidenceStatus",
          titleName: "Upload Evidence Status",
        },
        { fieldName: "sendDateDisplay", titleName: "Request Invite Date" },
        {
          fieldName: "reviewStatus",
          titleName: "Review AI",
          fontendType: "slot",
          width: 140,
        },
        { fieldName: "reviewComment", titleName: "Review AI Comment" },
      ],
      tableData: [],
      tablePage: { pageIndex: 1, pageSize: 20, total: 0 },
      drawerVisible: false,
      formMode: "create",
      formData: emptyForm(),
      saving: false,
      fileDialogVisible: false,
      versionDialogVisible: false,
      versions: [],
      selectedVersionId: null,
      currentVersionLabel: "",
      savingVersion: false,
      loading: false,
      generating: false,
      sending: false,
      loadError: "",
      autoGenerated: false,
      inviteDialogVisible: false,
      inviteText: "",
    };
  },
  computed: {
    requestMasterId() {
      return (
        this.$route.query.requestMasterId ||
        this.$route.query.request_master_id ||
        sessionStorage.getItem("currentRequestMasterId") ||
        ""
      );
    },
    pagedData() {
      const start = (this.tablePage.pageIndex - 1) * this.tablePage.pageSize;
      return this.tableData.slice(start, start + this.tablePage.pageSize);
    },
    formReadonly() {
      return this.formMode === "view";
    },
  },
  watch: {
    "$route.query.requestMasterId"() {
      this.bootstrap();
    },
  },
  created() {
    this.bootstrap();
  },
  methods: {
    formatDateTime(value) {
      if (!value) return "-";
      const text = String(value).replace("T", " ").trim();
      return text.length >= 19 ? text.slice(0, 19) : text;
    },
    reviewAiToneClass(rawOrLabel) {
      const label = mapReviewAiStatus(rawOrLabel);
      if (label === REVIEW_AI_LABELS.red) return "is-red";
      if (label === REVIEW_AI_LABELS.yellow) return "is-yellow";
      if (label === REVIEW_AI_LABELS.green) return "is-green";
      return "";
    },
    mapRow(item) {
      const reviewAiRaw = extractReviewAiRaw(item);
      const reviewStatus = mapReviewAiStatus(reviewAiRaw) || "-";
      return {
        ...item,
        requestId: item.request_id || item.requestId,
        requestCode: item.request_code || item.requestCode || "-",
        requestName: item.request_name || item.requestName || "-",
        ccCriteria: item.cc_criteria || item.ccCriteria || "-",
        pointsOfFocus: item.points_of_focus || item.pointsOfFocus || "-",
        requestDescription:
          item.request_description || item.requestDescription || "-",
        creationDate:
          item.request_creation_date || item.requestCreationDate || "",
        creationDateDisplay: this.formatDateTime(
          item.request_creation_date || item.requestCreationDate,
        ),
        requestAssignee: item.request_assignee || item.requestAssignee || "-",
        documentOwnerName:
          item.document_owner_name || item.documentOwnerName || "-",
        uploadEvidence: item.upload_evidence || item.uploadEvidence || "-",
        uploadEvidenceDateDisplay: this.formatDateTime(
          item.upload_evidence_date_time || item.uploadEvidenceDateTime,
        ),
        commentContent: item.comment_content || item.commentContent || "-",
        evidenceStatus:
          item.upload_evidence_manual_status ||
          item.uploadEvidenceManualStatus ||
          "-",
        sendDateDisplay: this.formatDateTime(
          item.request_send_date || item.requestSendDate,
        ),
        reviewAiRaw,
        reviewStatus,
        reviewComment:
          item.ai_comment_content ||
          item.request_individual_review_comment ||
          item.requestIndividualReviewComment ||
          "-",
      };
    },
    async bootstrap() {
      this.loadError = "";
      if (this.requestMasterId) {
        sessionStorage.setItem(
          "currentRequestMasterId",
          String(this.requestMasterId),
        );
      }
      if (!this.requestMasterId) {
        this.loadError =
          "Missing request master. Open via Enter request from Request master.";
        this.tableData = [];
        return;
      }
      await this.loadVersions();
      await this.loadList({ tryGenerateIfEmpty: true });
    },
    async loadList(options = {}) {
      // GET /api/request/individual/list?requestMasterId=
      this.loading = true;
      this.loadError = "";
      try {
        const res = await this.$api.requestIndividualList({
          requestMasterId: this.requestMasterId,
        });
        if (res && Number(res.code) === 0) {
          const list = Array.isArray(res.data)
            ? res.data
            : (res.data && (res.data.list || res.data.records)) || [];
          this.tableData = list.map((item) => this.mapRow(item));
          this.tablePage.total = this.tableData.length;
          this.tablePage.pageIndex = 1;

          if (
            options.tryGenerateIfEmpty &&
            !this.tableData.length &&
            !this.autoGenerated
          ) {
            this.autoGenerated = true;
            await this.handleGenerate({ silent: true });
          }
        } else {
          this.tableData = [];
          this.tablePage.total = 0;
          this.loadError =
            (res && res.message) ||
            "Load request individual failed. Please check login / token.";
          this.$message.warning(this.loadError);
        }
      } catch (e) {
        this.tableData = [];
        this.tablePage.total = 0;
        this.loadError =
          (e && e.message) || "Load request individual failed";
        this.$message.error(this.loadError);
      } finally {
        this.loading = false;
      }
    },
    async loadVersions() {
      try {
        const res = await this.$api.requestMasterVersions(this.requestMasterId);
        if (res.code == 0 && Array.isArray(res.data)) {
          this.versions = res.data;
          const latest =
            res.data.find((v) => v.is_latest) || res.data[0] || null;
          if (latest) {
            this.selectedVersionId = latest.version_id;
            this.currentVersionLabel = latest.version_label || "";
          }
        }
      } catch (e) {
        /* ignore */
      }
    },
    onPageChange(page) {
      this.tablePage.pageIndex = page;
    },
    onSizeChange(size) {
      this.tablePage.pageSize = size;
      this.tablePage.pageIndex = 1;
    },
    async openForm(mode, row) {
      this.formMode = mode;
      if (mode === "create") {
        const now = nowDateTime();
        this.formData = emptyForm();
        this.formData.creationDate = now;
        this.formData.creationDateDisplay = now;
        this.drawerVisible = true;
        return;
      }
      try {
        const res = await this.$api.requestIndividualDetail(row.requestId);
        if (res.code != 0) {
          this.$message.warning(res.message || "Load detail failed");
          return;
        }
        const d = res.data || {};
        const reviewAiRaw = extractReviewAiRaw(d);
        this.formData = {
          requestId: d.request_id || row.requestId,
          requestName: d.request_name || "",
          ccCriteria: d.cc_criteria || "",
          pointsOfFocus: d.points_of_focus || "",
          requestDescription: d.request_description || "",
          creationDate: d.request_creation_date || "",
          creationDateDisplay: this.formatDateTime(d.request_creation_date),
          commentContent: d.comment_content || "",
          sendDateDisplay: this.formatDateTime(
            d.request_send_date || d.requestSendDate,
          ),
          reviewAiRaw,
          reviewAiStatus: mapReviewAiStatus(reviewAiRaw),
          evidences: d.evidences || [],
        };
        this.drawerVisible = true;
      } catch (e) {
        this.$message.error((e && e.message) || "Load detail failed");
      }
    },
    async handleSave() {
      if (!this.formData.requestName) {
        this.$message.warning("Request Name is required");
        return;
      }
      if (!this.requestMasterId) {
        this.$message.warning("Missing request master id");
        return;
      }
      this.saving = true;
      // Document Owner 由 Access management 项目角色继承，不再按条指定
      const payload = {
        requestMasterId: Number(this.requestMasterId),
        request_master_id: Number(this.requestMasterId),
        requestName: this.formData.requestName,
        ccCriteria: this.formData.ccCriteria || "",
        pointsOfFocus: this.formData.pointsOfFocus || "",
        requestDescription: this.formData.requestDescription || "",
        commentContent: this.formData.commentContent || "",
      };
      try {
        let res;
        if (this.formMode === "create") {
          res = await this.$api.requestIndividualCreate(payload);
        } else {
          res = await this.$api.requestIndividualUpdate(
            this.formData.requestId,
            payload,
          );
        }
        if (res && Number(res.code) === 0) {
          this.$message.success("Saved successfully");
          this.drawerVisible = false;
          this.loadList({ tryGenerateIfEmpty: false });
        } else {
          this.$message.error(res.message || "Save failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Save failed");
      } finally {
        this.saving = false;
      }
    },
    openProjectInvite() {
      const { projectId, projectName } = getCurrentProjectInviteContext();
      if (!projectId) {
        this.$message.warning("Please select a project first");
        return;
      }
      this.inviteText = buildProjectInviteText({ projectId, projectName });
      this.inviteDialogVisible = true;
    },
    async copyInviteText() {
      if (!this.inviteText) return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(this.inviteText);
        } else {
          const input = document.createElement("textarea");
          input.value = this.inviteText;
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
        }
        this.$message.success("Invite text copied");
      } catch (e) {
        this.$message.error("Copy failed");
      }
    },
    confirmDelete(row) {
      this.$confirm("Confirm delete this request individual?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          try {
            // DELETE /api/request/individual/{requestId}
            const res = await this.$api.requestIndividualDelete(row.requestId);
            if (res && Number(res.code) === 0) {
              this.$message.success("Deleted successfully");
              this.loadList({ tryGenerateIfEmpty: false });
            } else {
              this.$message.warning(res.message || "Delete failed");
            }
          } catch (e) {
            this.$message.error((e && e.message) || "Delete failed");
          }
        })
        .catch(() => {});
    },
    async handleGenerate(options = {}) {
      // POST /api/request/individual/generate?requestMasterId=
      if (!this.requestMasterId) {
        this.$message.warning("Missing request master id");
        return;
      }
      this.generating = true;
      try {
        const res = await this.$api.requestIndividualGenerate({
          requestMasterId: this.requestMasterId,
        });
        if (res && Number(res.code) === 0) {
          const list = Array.isArray(res.data) ? res.data : [];
          if (list.length) {
            this.tableData = list.map((item) => this.mapRow(item));
            this.tablePage.total = this.tableData.length;
            this.tablePage.pageIndex = 1;
            if (!options.silent) {
              this.$message.success(`Generated ${list.length} request(s)`);
            }
          } else {
            await this.loadList({ tryGenerateIfEmpty: false });
            if (!options.silent) {
              this.$message.info(
                "No new items generated. Catalog may be empty or already generated.",
              );
            }
          }
        } else {
          if (!options.silent) {
            this.$message.warning(res.message || "Generate failed");
          }
        }
      } catch (e) {
        if (!options.silent) {
          this.$message.error((e && e.message) || "Generate failed");
        }
      } finally {
        this.generating = false;
      }
    },
    openVersionSelect() {
      this.versionDialogVisible = true;
      this.loadVersions();
    },
    async handleVersionSave() {
      if (!this.requestMasterId) {
        this.$message.warning("Missing request master id");
        return;
      }
      if (!this.tableData.length) {
        this.$message.warning("No records to save");
        return;
      }
      this.savingVersion = true;
      try {
        // POST /request-master/{id}/versions/save — Body 为空，保存当前 Individual 清单快照
        const res = await this.$api.requestMasterSaveVersion(
          this.requestMasterId,
        );
        if (res.code == 0) {
          const data = res.data || {};
          if (data.version_label) {
            this.currentVersionLabel = data.version_label;
          }
          if (data.version_id) {
            this.selectedVersionId = data.version_id;
          }
          this.$message.success("Version saved");
          await this.loadVersions();
        } else {
          this.$message.error(res.message || "Version save failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Version save failed");
      } finally {
        this.savingVersion = false;
      }
    },
    versionOptionLabel(v) {
      const label = v.version_label || `Version ${v.version_id}`;
      return v.is_latest ? `${label} (Latest Version)` : label;
    },
    async confirmVersion() {
      if (!this.selectedVersionId) {
        this.$message.warning("Please select a version");
        return;
      }
      try {
        const res = await this.$api.requestMasterVersionDetail(
          this.requestMasterId,
          this.selectedVersionId,
        );
        if (res.code == 0) {
          const data = res.data || {};
          this.currentVersionLabel = data.version_label || this.currentVersionLabel;
          const list = data.individuals || [];
          this.tableData = list.map((item) => this.mapRow(item));
          this.tablePage.total = this.tableData.length;
          this.tablePage.pageIndex = 1;
          this.versionDialogVisible = false;
          this.$message.success("Version loaded");
        } else {
          this.$message.warning(res.message || "Load version failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Load version failed");
      }
    },
    goControl() {
      this.$router.push({ name: "ControlTesting" });
    },
    async uploadEvidence({ file }) {
      if (!this.formData.requestId) return;
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await this.$api.requestIndividualUploadAttachment(
          this.formData.requestId,
          fd,
        );
        if (res.code == 0) {
          this.$message.success("Uploaded");
          this.openForm(this.formMode, { requestId: this.formData.requestId });
        } else {
          this.$message.warning(res.message || "Upload failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Upload failed");
      }
    },
    renameEvidence(file) {
      this.$prompt("Enter new file name", "Rename", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        inputValue: file.file || file.fileName || "",
      })
        .then(async ({ value }) => {
          if (!value) return;
          const res = await this.$api.requestIndividualRenameAttachment(
            this.formData.requestId,
            file.attachment_id || file.attachmentId,
            { fileName: value },
          );
          if (res.code == 0) {
            this.$message.success("Renamed");
            this.openForm(this.formMode, { requestId: this.formData.requestId });
          } else {
            this.$message.warning(res.message || "Rename failed");
          }
        })
        .catch(() => {});
    },
    removeEvidence(file) {
      this.$confirm("Delete this evidence file?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          const res = await this.$api.requestIndividualDeleteAttachment(
            this.formData.requestId,
            file.attachment_id || file.attachmentId,
          );
          if (res.code == 0) {
            this.$message.success("Deleted");
            this.openForm(this.formMode, { requestId: this.formData.requestId });
          } else {
            this.$message.warning(res.message || "Delete failed");
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.spec_body {
  padding: 0 20px 90px;
  height: calc(100% - 60px);
  overflow-y: auto;
}

.form_item {
  margin-bottom: 16px;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
  }

  .required {
    color: #dc2626;
  }

  /deep/ .el-input__inner,
  /deep/ .el-textarea__inner {
    border-radius: 8px;
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
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.evidence_table {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  th,
  td {
    padding: 8px;
    border-bottom: 1px solid #eef2f7;
    text-align: left;
  }

  th {
    background: #f8fafc;
    color: #475569;
  }

  .empty_cell {
    text-align: center;
    color: #94a3b8;
  }
}

.evidence_upload {
  padding: 8px;
}

.review_ai_value,
.review_ai_tag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.review_ai_value {
  width: 100%;
  box-sizing: border-box;
  min-height: 36px;
}

.review_ai_value.is-red,
.review_ai_tag.is-red {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.review_ai_value.is-yellow,
.review_ai_tag.is-yellow {
  background: #fffbeb;
  color: #d97706;
  border-color: #fde68a;
}

.review_ai_value.is-green,
.review_ai_tag.is-green {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

.cm-empty-tip {
  margin: 0 0 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 13px;
  line-height: 1.5;

  strong {
    color: #0f766e;
  }
}

.invite_hint {
  margin: 0 0 12px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

.invite_text_area {
  /deep/ .el-textarea__inner {
    min-height: 320px !important;
    height: 320px;
    line-height: 1.6;
    font-size: 13px;
    resize: vertical;
  }
}
</style>

<style>
.ri-spec-drawer .el-drawer__header {
  margin-bottom: 12px;
  padding: 16px 20px 8px;
  font-weight: 700;
  color: #0f172a;
}
</style>
