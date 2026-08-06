import http from "../soc2";

/* ===================== Auth ===================== */
export const login = (params) => http("post", `/auth/login`, params);
export const register = (params) => http("post", `/auth/register`, params);
export const authMe = (params) => http("get", `/auth/me`, params);
export const companyByInvitation = (params) =>
  http("get", `/auth/company-by-invitation`, params);

/* ===================== Profile ===================== */
export const profileMe = (params) => http("get", `/profile/me`, params);
export const updateProfileMe = (params) => http("put", `/profile/me`, params);
export const profileCompany = (params) =>
  http("get", `/profile/company`, params);
export const updateProfileCompany = (params) =>
  http("put", `/profile/company`, params);

/* ===================== Product / Order / Payment ===================== */
export const ordermy = (params) => http("get", `/product/my`, params);
export const list = (params) => http("get", `/product/packages`, params);
export const detail = (params) => http("get", `/product/detail`, params);
export const myOrders = (params) => http("get", `/order/my`, params);
export const orderDetail = (orderNo, params) =>
  http("get", `/order/detail/${orderNo}`, params);
export const submit = (params) => http("post", `/payment/submit`, params);
export const paymentQuery = (orderNo, params) =>
  http("get", `/payment/query/${orderNo}`, params);
/** @deprecated 兼容旧调用名 */
export const create0rder = (params) => http("post", `/payment/submit`, params);

/* ===================== Project ===================== */
export const projectList = (params) => http("get", `/project/list`, params);
export const projectCreate = (params) =>
  http("post", `/project/create`, params);
export const projectDetail = (projectId, params) =>
  http("get", `/project/${projectId}`, params);
export const projectUpdate = (projectId, params) =>
  http("put", `/project/${projectId}`, params);
export const projectDelete = (projectId, params) =>
  http("delete", `/project/${projectId}`, params);
export const companyUsers = (params) =>
  http("get", `/project/company/users`, params);
export const projectRoleSlots = (params) =>
  http("get", `/project/role-slots`, params);
export const projectAccessManagement = (params) =>
  http("get", `/project/access-management`, params);
export const projectSaveMembers = (projectId, params) =>
  http("put", `/project/${projectId}/members`, params);

/* ===================== Invitation Code ===================== */
export const invitationCodeList = (params) =>
  http("get", `/invitation-code/list`, params);
export const invitationCodeRedeem = (params) =>
  http("post", `/invitation-code/redeem`, params);
export const invitationCodeValidate = (params) =>
  http("get", `/invitation-code/validate`, params);
export const invitationCodeCreate = (params) =>
  http("post", `/invitation-code/project/create`, params);
/** 公司级邀请码（系统用户入公司） */
export const companyInvitationCreate = (params) =>
  http("post", `/invitation-code/company/create`, params);
export const invitationCodeRevoke = (invitationId, params) =>
  http("post", `/invitation-code/revoke/${invitationId}`, params);

/* ===================== Request Master ===================== */
export const requestMasterList = (params) =>
  http("get", `/request-master/list`, params);
export const requestMasterCreate = (params) =>
  http("post", `/request-master`, params);
export const requestMasterDetail = (id, params) =>
  http("get", `/request-master/${id}`, params);
export const requestMasterUpdate = (id, params) =>
  http("put", `/request-master/${id}`, params);
export const requestMasterDelete = (id, params) =>
  http("delete", `/request-master/${id}`, params);
export const requestMasterStatusOptions = (params) =>
  http("get", `/request-master/status-options`, params);
export const requestMasterVersions = (id, params) =>
  http("get", `/request-master/${id}/versions`, params);
export const requestMasterSaveVersion = (id, params) =>
  http("post", `/request-master/${id}/versions/save`, params);
export const requestMasterVersionDetail = (id, versionId, params) =>
  http("get", `/request-master/${id}/versions/${versionId}`, params);
export const requestMasterTemplateFiles = (id, params) =>
  http("get", `/request-master/${id}/template-files`, params);
export const requestMasterUploadTemplate = (id, params) =>
  http("post", `/request-master/${id}/template-files`, params, "multipart/form-data");
export const requestMasterDeleteTemplate = (id, templateFileId, params) =>
  http(
    "delete",
    `/request-master/${id}/template-files/${templateFileId}`,
    params,
  );
/** View：下载已上传的模板文件 */
export const requestMasterDownloadTemplateFile = (
  requestMasterId,
  templateFileId,
  params,
) =>
  http(
    "get",
    `/request-master/${requestMasterId}/template-files/${templateFileId}/download`,
    params,
    "application/json;charset=UTF-8",
    "blob",
  );
export const requestMasterDownloadTemplate = (params) =>
  http(
    "get",
    `/request-master/template-files/download-template`,
    params,
    "application/json;charset=UTF-8",
    "blob",
  );

/* ===================== Request Individual ===================== */
export const requestIndividualList = (params) =>
  http("get", `/request/individual/list`, params);
export const requestIndividualCreate = (params) =>
  http("post", `/request/individual`, params);
export const requestIndividualGenerate = (params = {}) => {
  const id = params.requestMasterId || params.request_master_id;
  const q = id != null ? `?requestMasterId=${encodeURIComponent(id)}` : "";
  return http("post", `/request/individual/generate${q}`, null);
};
export const requestIndividualDetail = (id, params) =>
  http("get", `/request/individual/${id}`, params);
export const requestIndividualUpdate = (id, params) =>
  http("put", `/request/individual/${id}`, params);
export const requestIndividualDelete = (id, params) =>
  http("delete", `/request/individual/${id}`, params);
export const requestIndividualSend = (id, params) =>
  http("post", `/request/individual/${id}/send`, params || null);
export const requestIndividualDocumentOwners = (params) =>
  http("get", `/request/individual/document-owners`, params);
export const requestIndividualUploadAttachment = (id, params) =>
  http(
    "post",
    `/request/individual/${id}/attachments`,
    params,
    "multipart/form-data",
  );
export const requestIndividualRenameAttachment = (id, attachmentId, params) =>
  http("put", `/request/individual/${id}/attachments/${attachmentId}`, params);
export const requestIndividualDeleteAttachment = (id, attachmentId, params) =>
  http(
    "delete",
    `/request/individual/${id}/attachments/${attachmentId}`,
    params,
  );

/* ===================== Control Testing ===================== */
export const controlTestingList = (params) =>
  http("get", `/control-testing/list`, params);
export const controlTestingCreate = (params) =>
  http("post", `/control-testing`, params);
export const controlTestingDetail = (testId, params) =>
  http("get", `/control-testing/${testId}`, params);
export const controlTestingUpdate = (testId, params) =>
  http("put", `/control-testing/${testId}`, params);
export const controlTestingDelete = (testId, params) =>
  http("delete", `/control-testing/${testId}`, params);
export const controlTestingSaveVersion = (testId, params) =>
  http("post", `/control-testing/${testId}/versions`, params);

/* ===================== Gap Analysis ===================== */
export const gapAnalysisList = (params) =>
  http("get", `/gap-analysis/list`, params);
export const gapAnalysisCreate = (params) =>
  http("post", `/gap-analysis?projectId=${params.projectId}`, params);
export const gapAnalysisUpdate = (gapId, params) =>
  http("put", `/gap-analysis/${gapId}`, params);
export const gapAnalysisRegenerate = (params) =>
  http("post", `/gap-analysis/regenerate`, params);

/* ===================== Analysis / Passing Scores ===================== */
export const analysisPassRate = (projectId, params) =>
  http("get", `/analysis/pass-rate/${projectId}`, params);
export const analysisPassRateDetail = (projectId, params) =>
  http("get", `/analysis/pass-rate/detail/${projectId}`, params);
export const analysisTrend = (projectId, params) =>
  http("get", `/analysis/trend/${projectId}`, params);
export const analysisTrendLegacy = (params) =>
  http("get", `/analysis/trend`, params);
export const analysisGenerateReport = (params) =>
  http("post", `/analysis/generate-report`, params);
export const analysisReportStatus = (taskId, params) =>
  http("get", `/analysis/report-status/${taskId}`, params);
export const analysisDownloadReport = (taskId, params) =>
  http(
    "get",
    `/analysis/download-report/${taskId}`,
    params,
    "application/json;charset=UTF-8",
    "blob",
  );

/* ===================== RCM / Risk ===================== */
export const rcmList = (params) => http("get", `/rcm/list`, params);
export const rcmFinalList = (params) => http("get", `/rcm/final/list`, params);
export const rcmManualList = (params) => http("get", `/rcm/manual/list`, params);
export const rcmAiGeneratedList = (params) =>
  http("get", `/rcm/ai-generated/list`, params);
export const rcmCreate = (params) => http("post", `/rcm`, params);
export const rcmDetail = (rcmId, params) => http("get", `/rcm/${rcmId}`, params);
export const rcmUpdate = (rcmId, params) => http("put", `/rcm/${rcmId}`, params);
export const rcmDelete = (rcmId, params) =>
  http("delete", `/rcm/${rcmId}`, params);
export const rcmAiGenerate = (params) => http("post", `/rcm/ai/generate`, params);
export const rcmAiStatus = (params) => http("get", `/rcm/ai/status`, params);
export const rcmUpload = (params) =>
  http("post", `/rcm/upload`, params, "multipart/form-data");
export const rcmExport = (params) =>
  http("get", `/rcm/export`, params, "application/json;charset=UTF-8", "blob");
export const rcmFillByAi = (rcmId, params) =>
  http("post", `/rcm/${rcmId}/fill-by-ai`, params);
export const rcmUploadToFinal = (rcmId, params) =>
  http("post", `/rcm/${rcmId}/upload-to-final`, params);
export const rcmUploadToManual = (rcmId, params) =>
  http("post", `/rcm/${rcmId}/upload-to-manual`, params);
export const rcmSaveVersion = (rcmId, params) =>
  http("post", `/rcm/${rcmId}/versions`, params);

/* ===================== Risk Table ===================== */
export const riskTableList = (params) =>
  http("get", `/risk-table/list`, params);
export const riskTableDetail = (riskId, params) =>
  http("get", `/risk-table/${riskId}`, params);
export const riskTableCreate = (params) => http("post", `/risk-table`, params);
export const riskTableUpdate = (riskId, params) =>
  http("put", `/risk-table/${riskId}`, params);
export const riskTableDelete = (riskId, params) =>
  http("delete", `/risk-table/${riskId}`, params);

/* ===================== Operation Log ===================== */
export const operationLogList = (params) =>
  http("get", `/operation-log/list`, params);
export const operationLogStatistics = (params) =>
  http("get", `/operation-log/statistics`, params);

/* ===================== User (legacy) ===================== */
export const userInfo = (params) => http("get", `/user/info`, params);
export const updateUserInfo = (params) => http("put", `/user/info`, params);
export const userList = (params) => http("get", `/user/list`, params);
export const userRoles = (params) => http("get", `/user/roles`, params);
/** 更新公司用户系统角色 */
export const updateUserSystemRole = (userId, params) =>
  http("put", `/user/${userId}/system-role`, params);

/* ===================== 兼容旧叶片接口名（后端已无对应路径时保留空实现避免报错） ===================== */
export const getStateInv = (params) =>
  http("get", `/blade/getStateInv`, params);
export const getVibDel = (params) => http("get", `/blade/getVibDel`, params);
export const getVibHisto = (params) => http("get", `/blade/getVibHisto`, params);
export const getLifeDetails = (params) =>
  http("get", `/blade/getLifeDetails`, params);
export const recovery = (params, headers) =>
  http("post", `/blade/recovery`, params, headers);
export const getWarnRecords = (params) =>
  http("get", `/warn/getWarnRecords`, params);
export const deleteWarnRecord = (params) =>
  http("post", `/warn/deleteWarnRecord`, params);
export const getHisTrend = (params) =>
  http("get", `/blade/getHisTrend`, params);
export const getTrend = (params) => http("get", `/warn/getTrend`, params);
