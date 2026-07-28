/** 系统级角色 */
export const SYSTEM_ROLES = [
  {
    code: "COMP_ADMIN",
    label: "Company Administrator",
    description:
      "Manages company users, creates projects, and controls company-wide access.",
  },
  {
    code: "COMP_USER",
    label: "Company User",
    description:
      "Joins assigned projects only; cannot manage company users or create projects.",
  },
];

/** 项目级角色（Access management 矩阵列） */
export const PROJECT_ROLES = [
  {
    code: "PROJECT_OWNER",
    label: "Project Owner",
    fieldName: "ProjectOwner",
    width: 130,
  },
  {
    code: "DOCUMENT_OWNER",
    label: "Document Owner",
    fieldName: "DocumentOwner",
    width: 140,
  },
  {
    code: "GENERAL_USER",
    label: "General User",
    fieldName: "GeneralUser",
    width: 120,
  },
  {
    code: "MANAGER",
    label: "Manager tier 1",
    fieldName: "ManagerTier1",
    width: 130,
  },
  {
    code: "MANAGER_2",
    label: "Manager tier 2",
    fieldName: "ManagerTier2",
    width: 130,
  },
];

/** 业务身份（非权限） */
export const BUSINESS_IDENTITIES = [
  { code: "clients", label: "Clients" },
  { code: "consultant", label: "Consultant" },
  { code: "auditor", label: "Auditor" },
];

const LEGACY_ADMIN = new Set([
  "COMP_ADMIN",
  "COMPANY_ADMIN",
  "company_admin",
  "administrator",
  "Administrator",
  "admin",
  "Admin",
  "ADMIN",
]);

function looksLikeAdminText(value) {
  if (value == null || value === "") return false;
  const text = String(value).trim().toLowerCase();
  return (
    text === "comp_admin" ||
    text === "company_admin" ||
    text === "administrator" ||
    text === "admin" ||
    text.includes("administrator") ||
    text.includes("comp_admin")
  );
}

export function normalizeSystemRole(raw) {
  if (raw == null || raw === "") return "COMP_USER";
  const value = String(raw).trim();
  if (LEGACY_ADMIN.has(value) || looksLikeAdminText(value)) return "COMP_ADMIN";
  if (value === "COMP_USER") return "COMP_USER";
  return "COMP_USER";
}

/** 从登录 / me / profile 等任意对象里解析系统角色 */
export function extractSystemRole(source) {
  if (!source || typeof source !== "object") return "";

  // 优先读明确的系统角色字段，不要把业务身份 roleCode(clients/…) 当成系统角色
  const primary = [
    source.system_role,
    source.systemRole,
    source.permission_code,
    source.permissionCode,
    source.permission,
    source.admin_role,
    source.adminRole,
  ];
  for (let i = 0; i < primary.length; i += 1) {
    const raw = primary[i];
    if (raw == null || raw === "") continue;
    if (LEGACY_ADMIN.has(String(raw).trim()) || looksLikeAdminText(raw)) {
      return "COMP_ADMIN";
    }
    if (String(raw).trim() === "COMP_USER") return "COMP_USER";
  }

  // 次优先：role / roleCode，但跳过业务身份
  const secondary = [
    source.user_role,
    source.userRole,
    source.role_code,
    source.roleCode,
    source.role,
  ];
  const businessCodes = new Set(BUSINESS_IDENTITIES.map((b) => b.code));
  for (let i = 0; i < secondary.length; i += 1) {
    const raw = secondary[i];
    if (raw == null || raw === "") continue;
    const text = String(raw).trim();
    if (businessCodes.has(text.toLowerCase()) || businessCodes.has(text)) {
      continue;
    }
    if (LEGACY_ADMIN.has(text) || looksLikeAdminText(text)) {
      return "COMP_ADMIN";
    }
    if (text === "COMP_USER") return "COMP_USER";
  }
  return "";
}

export function persistSystemRole(role) {
  const normalized = normalizeSystemRole(role);
  sessionStorage.setItem("system_role", normalized);
  try {
    const info = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    info.systemRole = normalized;
    info.system_role = normalized;
    sessionStorage.setItem("userInfo", JSON.stringify(info));
  } catch (e) {
    /* ignore */
  }
  return normalized;
}

export function getSystemRole() {
  const stored = sessionStorage.getItem("system_role");
  if (stored) return normalizeSystemRole(stored);
  try {
    const info = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const fromInfo = extractSystemRole(info);
    if (fromInfo) return fromInfo;
  } catch (e) {
    /* ignore */
  }
  return "COMP_USER";
}

export function isCompAdmin() {
  return getSystemRole() === "COMP_ADMIN";
}

export function clearSystemRole() {
  sessionStorage.removeItem("system_role");
}

export function getCurrentUserId() {
  try {
    const info = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    return (
      info.userId ||
      info.user_id ||
      info.id ||
      sessionStorage.getItem("user_id") ||
      ""
    );
  } catch (e) {
    return sessionStorage.getItem("user_id") || "";
  }
}

/** 当前用户是否为某项目的 Project Owner（或系统管理员） */
export function canManageProjectAccess(roleSlots) {
  if (isCompAdmin()) return true;
  const uid = String(getCurrentUserId() || "");
  if (!uid) return false;
  return (roleSlots || []).some((slot) => {
    const code = slot.role_code || slot.roleCode || "";
    const slotUid = String(slot.user_id || slot.userId || "");
    return code === "PROJECT_OWNER" && slotUid && slotUid === uid;
  });
}

export function projectRoleLabel(code) {
  const hit = PROJECT_ROLES.find((r) => r.code === code);
  return hit ? hit.label : code;
}

export function systemRoleLabel(code) {
  const hit = SYSTEM_ROLES.find((r) => r.code === code);
  return hit ? hit.label : code;
}

export function systemRoleDescription(code) {
  const hit = SYSTEM_ROLES.find((r) => r.code === code);
  return hit ? hit.description || "" : "";
}

/**
 * 登录后 / 进入 Home 时刷新系统角色。
 * 后端若暂未返回 system_role，则兜底：可读取公司档案的账号视为管理员。
 */
export async function refreshSystemRole(api) {
  if (!api) return getSystemRole();
  const trySources = [];
  try {
    if (api.authMe) {
      const me = await api.authMe({});
      if (me && me.code == 0 && me.data) trySources.push(me.data);
    }
  } catch (e) {
    /* ignore */
  }
  try {
    if (api.profileMe) {
      const profile = await api.profileMe({});
      if (profile && profile.code == 0 && profile.data) {
        trySources.push(profile.data);
      }
    }
  } catch (e) {
    /* ignore */
  }
  try {
    const info = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    trySources.push(info);
  } catch (e) {
    /* ignore */
  }

  for (let i = 0; i < trySources.length; i += 1) {
    const role = extractSystemRole(trySources[i]);
    if (role === "COMP_ADMIN") {
      return persistSystemRole("COMP_ADMIN");
    }
  }
  for (let i = 0; i < trySources.length; i += 1) {
    const role = extractSystemRole(trySources[i]);
    if (role) return persistSystemRole(role);
  }

  // 过渡期：当前账号邮箱登录且能读公司档案 → 视为管理员（你的 83261582@qq.com 会命中）
  try {
    const info = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const email = String(
      info.email || info.account || info.username || "",
    ).toLowerCase();
    if (email.includes("@") && api.profileCompany) {
      const company = await api.profileCompany({});
      if (company && company.code == 0 && company.data) {
        return persistSystemRole("COMP_ADMIN");
      }
    }
  } catch (e) {
    /* ignore */
  }

  return getSystemRole();
}
