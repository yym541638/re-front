<template>
  <div class="cm-page">
    <div class="cm-page__body">
      <div class="cm-toolbar">
        <div class="cm-toolbar__left">
          <span class="cm-label">Version:</span>
          <el-select
            v-model="value"
            placeholder="Select version"
            class="cm-select"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="cm-toolbar__right">
          <el-button
            v-for="(item, index) in buttons"
            :key="index"
            type="primary"
            :class="item.primary ? 'cm-btn-primary' : 'cm-btn-secondary'"
            @click="clickBtn(index, item.name)"
          >
            {{ item.label }}
          </el-button>
        </div>
      </div>

      <div class="cm-table-panel">
        <Vxetable
          ref="invoiceVxeTable"
          @currentChange="VoPageListByDto"
          @sizeChange="sizeChange"
          :tablePage="tablePage"
          :tableTitles="tableTitles"
          :tableData="tableData"
          :selection="false"
          operationW="220"
        >
          <template v-for="title in tableTitles" :slot="title.fieldName" slot-scope="{ row }">
            <div :key="title.fieldName" v-if="editingRow === row">
              <el-input
                v-model="row[title.fieldName]"
                size="small"
                style="width: 100%"
              />
            </div>
            <div :key="title.fieldName" v-else>
              {{ row[title.fieldName] }}
            </div>
          </template>

          <div slot="btn_edit" slot-scope="{ row }" class="cm-op-actions">
            <el-button
              type="text"
              size="small"
              class="cm-op-link"
              @click="editRow(row)"
            >
              {{ editingRow === row ? 'Save' : 'Edit' }}
            </el-button>
            <span class="cm-op-sep">|</span>
            <el-button
              v-if="editingRow === row"
              type="text"
              size="small"
              class="cm-op-muted"
              @click="cancelEdit"
            >
              Cancel
            </el-button>
            <el-button
              v-else
              type="text"
              size="small"
              class="cm-op-link"
              @click="Fill(row)"
            >
              Fill by AI
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
        </Vxetable>
      </div>
    </div>

    <FileManagement
      :visible="fileDialogVisible"
      :title="fileTitle"
      @update:visible="fileDialogVisible = $event"
    />
  </div>
</template>

<script>
import FileManagement from "@/components/FileManagement/index.vue";
export default {
  name: "RcmManual",
  components: {
    FileManagement,
  },
  data() {
    return {
      fileTitle: "Upload RCM",
      fileDialogVisible: false,
      options: [
        { value: "2022/02/23", label: "2022/02/23" },
        { value: "2023/02/23", label: "2023/02/23" },
        { value: "2024/02/23", label: "2024/02/23" },
        { value: "2025/02/23", label: "2025/02/23" },
        { value: "2026/02/23", label: "2026/02/23" },
      ],
      value: "2026/02/23",
      buttons: [
        { label: "New", name: "", primary: true },
        { label: "Upload RCM", name: "" },
        { label: "Upload to Final", name: "" },
        { label: "RCM Final", name: "RcmFinal" },
        { label: "AI Generate", name: "AIGenerate" },
      ],
      tableTitles: [
        { fieldName: "ProjectName", titleName: "Project Name", fontendType: "slot" },
        { fieldName: "Type", titleName: "Type", fontendType: "slot" },
        { fieldName: "Version", titleName: "Version", fontendType: "slot" },
        { fieldName: "GapsNumber", titleName: "Gaps", fontendType: "slot" },
        { fieldName: "LastModifiedDate", titleName: "Last Modified", fontendType: "slot" },
        { fieldName: "Status", titleName: "Status", fontendType: "slot" },
        { fieldName: "StartDate", titleName: "Start Date", fontendType: "slot" },
        { fieldName: "EndDate", titleName: "End Date", fontendType: "slot" },
      ],
      editingRow: null,
      originalData: null,
      tableData: [
        {
          ProjectName: "Compliance Audit",
          Type: "Type 1",
          Version: "12/15/2025",
          GapsNumber: "--",
          LastModifiedDate: "1/1/2026",
          Status: "Active/ End",
          StartDate: "12/15/2025",
          EndDate: "N/A",
        },
        {
          ProjectName: "company Name1",
          Type: "Type 1",
          Version: "12/15/2025",
          GapsNumber: "--",
          LastModifiedDate: "1/1/2026",
          Status: "Active/ End",
          StartDate: "12/15/2025",
          EndDate: "N/A",
        },
      ],
      tablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
      },
    };
  },
  methods: {
    async VoPageListByDto(page) {},
    sizeChange(size) {
      this.tablePage.pageSize = size;
      this.VoPageListByDto(1);
    },

    clickBtn(index, name) {
      switch (index) {
        case 3:
        case 4:
          this.openReportDetail(name);
          break;
        case 1:
          this.fileDialogVisible = true;
          break;
      }
    },

    openReportDetail(name) {
      const newTab = {
        name: name,
        RouterName:
          name == "RcmFinal"
            ? "RcmFinal"
            : name == "AIGenerate"
            ? "AIGenerate"
            : "",
        id:
          name == "RcmFinal"
            ? "1428549913133977601"
            : name == "AIGenerate"
            ? "report-alarmRecord-123"
            : "",
      };
      const exists = this.$store.state.tagsArr.some(
        (tag) => tag.RouterName === newTab.RouterName,
      );
      if (!exists) {
        this.$store.commit("ADD_TAG", newTab);
      }
      this.$store.commit("ADD_TAG", newTab);
      this.$store.commit("SET_ACTIVE_TAB", newTab.name);
      this.$router.push({ name: newTab.RouterName });
    },
    editRow(row) {
      if (this.editingRow === row) {
        this.saveRow();
      } else {
        this.cancelEdit();
        this.editingRow = row;
        this.originalData = JSON.parse(JSON.stringify(row));
      }
    },
    saveRow() {
      if (this.editingRow) {
        this.$message.success('保存成功');
        this.editingRow = null;
        this.originalData = null;
      }
    },
    cancelEdit() {
      if (this.editingRow && this.originalData) {
        Object.assign(this.editingRow, this.originalData);
        this.editingRow = null;
        this.originalData = null;
      }
    },
    Fill() {},
    remove(row) {
      this.$message.success("删除成功");
    },
    confirmDelete(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.remove(row);
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
</style>
