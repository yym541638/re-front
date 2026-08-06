/** 项目级邀请文案（前端本地生成，不调接口） */

const PENDING_KEY = "pendingProjectInvite";

export function getCurrentProjectInviteContext() {
  return {
    projectId:
      sessionStorage.getItem("currentProjectId") ||
      "" ,
    projectName: sessionStorage.getItem("currentProjectName") || "",
  };
}

/** 前端生成的项目邀请码（供文案展示与链接携带） */
export function buildProjectInviteCode(projectId) {
  if (!projectId) return "";
  return `CM-PROJ-${String(projectId)}`;
}

export function parseProjectIdFromInviteCode(code) {
  const text = String(code || "").trim();
  const m = text.match(/^CM-PROJ-(.+)$/i);
  return m ? m[1] : "";
}

export function buildAppEntryUrl(pathWithQuery) {
  const origin = window.location.origin;
  const basePath = window.location.pathname.replace(/\/[^/]*$/, "/") || "/";
  const q = pathWithQuery.startsWith("/")
    ? pathWithQuery
    : `/${pathWithQuery}`;
  // main.js 写的是 model 而非 mode，实际多为 hash 路由
  return `${origin}${basePath}#${q}`;
}

export function buildProjectInviteText({ projectId, projectName }) {
  const id = String(projectId || "").trim();
  const name = String(projectName || "project").trim() || "project";
  const code = buildProjectInviteCode(id);
  const registerUrl = buildAppEntryUrl(
    `/register?inviteCode=${encodeURIComponent(
      code,
    )}&projectId=${encodeURIComponent(id)}&projectName=${encodeURIComponent(
      name,
    )}`,
  );

  return [
    `你被邀请加入 CompliMind 项目「${name}」。`,
    ``,
    `请打开以下链接完成注册：`,
    registerUrl,
    ``,
    `邀请码：${code}`,
    `（打开链接后系统会自动带入邀请码；注册后可进入该项目）`,
  ].join("\n");
}

export function savePendingProjectInvite(payload) {
  try {
    const data = {
      inviteCode: String((payload && payload.inviteCode) || "").trim(),
      projectId: String((payload && payload.projectId) || "").trim(),
      projectName: String((payload && payload.projectName) || "").trim(),
    };
    if (!data.projectId && data.inviteCode) {
      data.projectId = parseProjectIdFromInviteCode(data.inviteCode);
    }
    if (!data.inviteCode && data.projectId) {
      data.inviteCode = buildProjectInviteCode(data.projectId);
    }
    if (!data.projectId && !data.inviteCode) {
      sessionStorage.removeItem(PENDING_KEY);
      return null;
    }
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(data));
    return data;
  } catch (e) {
    return null;
  }
}

export function readPendingProjectInvite() {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function clearPendingProjectInvite() {
  sessionStorage.removeItem(PENDING_KEY);
}

export function captureInviteFromRouteQuery(query) {
  if (!query) return null;
  return savePendingProjectInvite({
    inviteCode: query.inviteCode || query.invite_code || query.code || "",
    projectId: query.projectId || query.project_id || "",
    projectName: query.projectName || query.project_name || "",
  });
}

/**
 * 登录/注册成功后：尽量兑换邀请码并设置当前项目
 * @returns {{ redeemed: boolean, projectId: string, projectName: string }}
 */
export async function applyPendingProjectInvite(api, setCurrentProject) {
  const pending = readPendingProjectInvite();
  if (!pending) {
    return { redeemed: false, projectId: "", projectName: "" };
  }

  let redeemed = false;
  const code = pending.inviteCode;
  // 前端 CM-PROJ-* 码：优先走兑换；失败也不阻断，仍用 projectId 设上下文
  if (code && api && api.invitationCodeRedeem) {
    try {
      const res = await api.invitationCodeRedeem({ code });
      if (res && Number(res.code) === 0) {
        redeemed = true;
        const data = res.data || {};
        if (data.project_id || data.projectId) {
          pending.projectId = String(data.project_id || data.projectId);
        }
        if (data.project_name || data.projectName) {
          pending.projectName = String(
            data.project_name || data.projectName,
          );
        }
      }
    } catch (e) {
      /* ignore — 后端可能尚未支持该码格式 */
    }
  }

  if (pending.projectId && typeof setCurrentProject === "function") {
    setCurrentProject(pending.projectId, pending.projectName || "");
  }

  clearPendingProjectInvite();
  return {
    redeemed,
    projectId: pending.projectId || "",
    projectName: pending.projectName || "",
  };
}
