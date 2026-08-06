/** 当前项目上下文（侧栏 / 路由守卫共用） */

function readUserKey() {
  try {
    const info = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    return String(
      info.user_id ||
        info.userId ||
        info.id ||
        info.email ||
        info.account ||
        info.username ||
        "",
    );
  } catch (e) {
    return "";
  }
}

function lastProjectIdKey(userKey) {
  return userKey ? `lastProjectId:${userKey}` : "lastProjectId";
}

function lastProjectNameKey(userKey) {
  return userKey ? `lastProjectName:${userKey}` : "lastProjectName";
}

export function getCurrentProjectId() {
  return sessionStorage.getItem("currentProjectId") || "";
}

export function getCurrentProjectName() {
  return sessionStorage.getItem("currentProjectName") || "";
}

export function getLastProject() {
  const userKey = readUserKey();
  try {
    return {
      projectId: localStorage.getItem(lastProjectIdKey(userKey)) || "",
      projectName: localStorage.getItem(lastProjectNameKey(userKey)) || "",
    };
  } catch (e) {
    return { projectId: "", projectName: "" };
  }
}

export function setLastProject(projectId, projectName) {
  const userKey = readUserKey();
  try {
    if (projectId) {
      localStorage.setItem(lastProjectIdKey(userKey), String(projectId));
      if (projectName) {
        localStorage.setItem(lastProjectNameKey(userKey), String(projectName));
      }
    } else {
      localStorage.removeItem(lastProjectIdKey(userKey));
      localStorage.removeItem(lastProjectNameKey(userKey));
    }
  } catch (e) {
    /* ignore */
  }
}

export function setCurrentProject(projectId, projectName) {
  if (projectId) {
    sessionStorage.setItem("currentProjectId", String(projectId));
  } else {
    sessionStorage.removeItem("currentProjectId");
  }
  if (projectName) {
    sessionStorage.setItem("currentProjectName", String(projectName));
  } else if (!projectId) {
    sessionStorage.removeItem("currentProjectName");
  }
  if (projectId) {
    setLastProject(projectId, projectName);
  }
  try {
    window.dispatchEvent(
      new CustomEvent("project-context-updated", {
        detail: {
          projectId: getCurrentProjectId(),
          projectName: getCurrentProjectName(),
        },
      }),
    );
  } catch (e) {
    /* ignore */
  }
}

export function clearCurrentProject() {
  sessionStorage.removeItem("currentProjectId");
  sessionStorage.removeItem("currentProjectName");
  try {
    window.dispatchEvent(
      new CustomEvent("project-context-updated", {
        detail: {
          projectId: "",
          projectName: "",
        },
      }),
    );
  } catch (e) {
    /* ignore */
  }
}

export function hasCurrentProject() {
  return Boolean(getCurrentProjectId());
}

/**
 * 若尚无有效当前项目，则优先恢复上次项目，否则取列表第一条。
 * @param {Array<{id?: string, project_id?: string, projectId?: string, name?: string, project_name?: string, projectName?: string}>} projectList
 * @param {{ allowReplaceMissing?: boolean }} [options]
 *   allowReplaceMissing=false：列表可能不完整（如分页）时，当前/上次不在本页则不覆盖
 * @returns {{projectId: string, projectName: string}|null} 最终选中项；无项目时返回 null
 */
export function ensureDefaultProject(projectList, options = {}) {
  const allowReplaceMissing = options.allowReplaceMissing !== false;
  const list = (projectList || [])
    .map((item) => ({
      id: String(item.id || item.project_id || item.projectId || ""),
      name:
        item.name || item.project_name || item.projectName || "Untitled",
    }))
    .filter((p) => p.id);

  if (!list.length) {
    return null;
  }

  const currentId = getCurrentProjectId();
  if (currentId) {
    const hit = list.find((p) => p.id === String(currentId));
    if (hit) {
      if (!getCurrentProjectName()) {
        setCurrentProject(hit.id, hit.name);
      }
      return { projectId: hit.id, projectName: hit.name };
    }
    if (!allowReplaceMissing) {
      return {
        projectId: currentId,
        projectName: getCurrentProjectName(),
      };
    }
  }

  const last = getLastProject();
  if (last.projectId) {
    const hit = list.find((p) => p.id === String(last.projectId));
    if (hit) {
      setCurrentProject(hit.id, hit.name || last.projectName);
      return { projectId: hit.id, projectName: hit.name };
    }
    if (!allowReplaceMissing) {
      return null;
    }
  }

  const first = list[0];
  setCurrentProject(first.id, first.name);
  return { projectId: first.id, projectName: first.name };
}

/** 侧栏「项目工作台」下需要先选项目的菜单 RouterName */
export const PROJECT_SCOPED_ROUTES = new Set([
  "RequestMaster",
  "RequestIndividual",
  "ControlTesting",
  "GapAnalysis",
  "PassingScores",
  "ProjectSettings",
  "OperationLog",
  "RcmFinal",
]);

export function isProjectScopedRoute(name) {
  return PROJECT_SCOPED_ROUTES.has(name);
}
