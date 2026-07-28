<template>
  <div class="cm-page">
    <div class="cm-page__body">
      <div class="cm-toolbar">
        <div class="cm-toolbar__left">
          <span class="cm-page-title">Operation log</span>
        </div>
        <div class="cm-toolbar__right">
          <el-button class="cm-btn-secondary" :loading="loading" @click="loadList">
            Refresh
          </el-button>
        </div>
      </div>

      <div class="cm-table-panel">
        <div v-if="!projectId" class="empty-tip">
          Please open a project from Project overview first
        </div>
        <Vxetable
          v-else
          ref="operationLogTable"
          @currentChange="onPageChange"
          @sizeChange="onSizeChange"
          :tablePage="tablePage"
          :tableTitles="tableTitles"
          :tableData="pagedData"
          :selection="false"
          :operation="false"
        >
          <div slot="logText" slot-scope="{ row }" class="log-text">
            <span class="log-time">{{ row.createdAt }}</span>
            <span class="log-sep">·</span>
            <span class="log-user">{{ row.username }}</span>
            <span class="log-sep">·</span>
            <span class="action-tag" :class="actionClass(row.actionType)">
              {{ row.actionType }}
            </span>
            <span class="log-sep">·</span>
            <span class="log-detail">{{ row.logText }}</span>
          </div>
        </Vxetable>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OperationLog",
  data() {
    return {
      projectId: null,
      loading: false,
      allRows: [],
      tableTitles: [
        {
          fieldName: "logText",
          titleName: "Operation Log",
          fontendType: "slot",
        },
      ],
      tablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
      },
    };
  },
  computed: {
    pagedData() {
      const start =
        (this.tablePage.pageIndex - 1) * this.tablePage.pageSize;
      return this.allRows.slice(start, start + this.tablePage.pageSize);
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
    },
    formatDateTime(value) {
      if (!value) return "-";
      const text = String(value).replace("T", " ");
      return text.length >= 19 ? text.slice(0, 19) : text;
    },
    buildLogText(item) {
      const detail = item.actionDetail || item.action_detail || "";
      const resource =
        item.resourceName ||
        item.resource_name ||
        item.resourceId ||
        item.resource_id ||
        "";
      const moduleName = item.moduleName || item.module_name || "";
      if (detail) {
        return resource ? `${detail} (${resource})` : detail;
      }
      const action = item.actionType || item.action_type || "ACTION";
      return [moduleName, action, resource].filter(Boolean).join(" ");
    },
    normalizeRow(item) {
      return {
        logId: item.logId || item.log_id,
        createdAt: this.formatDateTime(item.createdAt || item.created_at),
        username: item.username || "-",
        actionType: item.actionType || item.action_type || "-",
        logText: this.buildLogText(item),
      };
    },
    actionClass(action) {
      const v = String(action || "").toUpperCase();
      if (v.includes("DELETE") || v.includes("REVOKE") || v.includes("CANCEL")) {
        return "action-tag--danger";
      }
      if (v.includes("CREATE") || v.includes("GENERATE") || v.includes("IMPORT")) {
        return "action-tag--ok";
      }
      if (v.includes("UPDATE") || v.includes("SAVE") || v.includes("SYNC")) {
        return "action-tag--info";
      }
      return "action-tag--default";
    },
    async loadList() {
      if (!this.projectId) {
        this.allRows = [];
        this.tablePage.total = 0;
        return;
      }
      this.loading = true;
      try {
        const res = await this.$api.operationLogList({
          projectId: this.projectId,
        });
        if (res.code == 0) {
          const list = Array.isArray(res.data) ? res.data : [];
          this.allRows = list.map((item) => this.normalizeRow(item));
          this.tablePage.total = this.allRows.length;
          this.tablePage.pageIndex = 1;
        } else {
          this.$message.warning(res.message || "Load operation log failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Load operation log failed");
      } finally {
        this.loading = false;
      }
    },
    onPageChange(page) {
      this.tablePage.pageIndex = page;
    },
    onSizeChange(size) {
      this.tablePage.pageSize = size;
      this.tablePage.pageIndex = 1;
    },
  },
};
</script>

<style lang="less" scoped>
.cm-page-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.empty-tip {
  padding: 48px 16px;
  text-align: center;
  color: #64748b;
  font-weight: 600;
}

.log-text {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  line-height: 1.5;
  color: #0f172a;
  white-space: normal;
}

.log-time {
  color: #64748b;
  font-variant-numeric: tabular-nums;
}

.log-user {
  font-weight: 600;
  color: #334155;
}

.log-sep {
  color: #cbd5e1;
}

.log-detail {
  color: #0f172a;
}

.action-tag {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
}

.action-tag--ok {
  color: #0f766e;
  background: rgba(15, 118, 110, 0.12);
}

.action-tag--info {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.12);
}

.action-tag--danger {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.12);
}

.action-tag--default {
  color: #475569;
  background: #e2e8f0;
}
</style>
