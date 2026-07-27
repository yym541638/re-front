// utils.js
export function downloadFile(blob, contentDisposition) {
    // 设置正确的 MIME 类型
    const fileBlob = new Blob([blob], { type: "application/octet-stream" });
  
    // 创建 a 标签用于下载
    const downloadElement = document.createElement("a");
    const href = window.URL.createObjectURL(fileBlob);
    downloadElement.href = href;
  
    // 解析 Content-Disposition 获取文件名
    const parsedContentDisposition = parseContentDisposition(contentDisposition);
    const filename = parsedContentDisposition.filename || "download";
    downloadElement.download = filename;
  
    // 触发下载
    document.body.appendChild(downloadElement);
    downloadElement.click();
  
    // 移除元素并释放 URL 对象
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(href);
  }
  
  export function parseContentDisposition(contentDispositionHeader) {
    if (!contentDispositionHeader) return { name: null, filename: null };
  
    // 使用正则表达式匹配 name 和 filename 的值
    const nameMatch = contentDispositionHeader.match(/name="([^"]+)"/);
    const filenameMatch = contentDispositionHeader.match(/filename="([^"]+)"/);
  
    return {
      name: nameMatch ? nameMatch[1] : null,
      filename: filenameMatch ? filenameMatch[1] : null,
    };
  }