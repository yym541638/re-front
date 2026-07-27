<template>
  <!-- //File Management -->
  <el-dialog
    :title="title"
    :visible="visible"
    @close="handleClose"
    width="800px"
  >
    <!-- <div style="margin-bottom: 20px;">
      <el-button type="primary" style="background-color: #3498db; border-color: #3498db;">New</el-button>
    </div> -->
    <el-table :data="fileData" style="width: 100%">
      <el-table-column prop="fileNo" label="File No" width="100">
      </el-table-column>
      <el-table-column prop="files" label="Files"> </el-table-column>
      <el-table-column prop="operations" label="Operations" width="200">
        <template slot-scope="scope">
          <div
            v-if="scope.row.operations === 'view_delete'"
            style="display: flex; gap: 8px"
          >
            <el-button
              type="text"
              size="small"
              @click="handleView(scope.row)"
              style="color: #3498db"
              >View</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="handleDelete(scope.row)"
              style="color: #e74c3c"
              >Delete</el-button
            >
          </div>
          <div v-else>
            <el-upload
              class="upload-btn"
              action="#"
              :auto-upload="false"
              :on-change="(file) => handleUpload(file, scope.row)"
              accept=".pdf,.xlsx,.xls,.docx,.doc"
              :limit="1"
            >
              <el-button type="text" size="small" style="color: #3498db"
                >Upload</el-button
              >
            </el-upload>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px; display: flex; justify-content: flex-end">
      <el-pagination
        background
        @current-change="handleFileCurrentChange"
        @size-change="handleFileSizeChange"
        :current-page="filePage.pageIndex"
        :page-sizes="[5, 10, 20]"
        :page-size="filePage.pageSize"
        layout="prev, pager, next, sizes"
        :total="filePage.total"
      >
      </el-pagination>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        style="background-color: #3498db; border-color: #3498db"
        >Create</el-button
      >
      <el-button @click="editDialogVisible = false">Cancel</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "FileManagement",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: () => {
        return "File Management";
      },
    },
  },
  data() {
    return {
      fileData: [
        { fileNo: 1, files: "Word/Excel/Pdf Only", operations: "view_delete" },
        { fileNo: 2, files: "Word/Excel/Pdf Only", operations: "upload" },
        { fileNo: 3, files: "Word/Excel/Pdf Only", operations: "upload" },
        { fileNo: 4, files: "Word/Excel/Pdf Only", operations: "upload" },
        { fileNo: 5, files: "Word/Excel/Pdf Only", operations: "upload" },
        { fileNo: 6, files: "Word/Excel/Pdf Only", operations: "upload" },
        { fileNo: 7, files: "Word/Excel/Pdf Only", operations: "upload" },
        { fileNo: 8, files: "Word/Excel/Pdf Only", operations: "upload" },
        { fileNo: 9, files: "Word/Excel/Pdf Only", operations: "upload" },
        { fileNo: 10, files: "Word/Excel/Pdf Only", operations: "upload" },
      ],
      filePage: {
        pageIndex: 1,
        pageSize: 5,
        total: 10,
      },
    };
  },
  methods: {
    // 文件管理分页 - 页码变化
    handleFileCurrentChange(page) {
      this.filePage.pageIndex = page;
      // 这里可以添加重新获取数据的逻辑
    },
    // 文件管理分页 - 每页条数变化
    handleFileSizeChange(size) {
      this.filePage.pageSize = size;
      this.filePage.pageIndex = 1;
      // 这里可以添加重新获取数据的逻辑
    },
    // 查看文件
    handleView(row) {
      console.log("View file:", row);
      // 这里可以添加查看文件的逻辑
    },
    // 处理删除
    handleDelete(row) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("Delete file:", row);
          // 这里可以添加删除文件的逻辑
          this.$message.success("删除成功");
        })
        .catch(() => {
          // 取消删除
        });
    },
    // 处理上传
    handleUpload(file, row) {
      // 检查文件类型
      const fileTypes = [".pdf", ".xlsx", ".xls", ".docx", ".doc"];
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));

      if (!fileTypes.includes(fileExtension.toLowerCase())) {
        this.$message.error("Only PDF, Excel, and Word files are allowed");
        return;
      }

      console.log("Upload file:", file, "for row:", row);
      // 这里可以添加文件上传的逻辑
      this.$message.success("File uploaded successfully");
    },
    // 处理弹框关闭
    handleClose() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped></style>
