/** 当前项目上下文（侧栏 / 路由守卫共用） */

export function getCurrentProjectId() {
  return (
    sessionStorage.getItem("currentProjectId") ||
    ""
  );
}

export function getCurrentProjectName() {
  return sessionStorage.getItem("currentProjectName") || "";
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
  setCurrentProject("", "");
}

export function hasCurrentProject() {
  return Boolean(getCurrentProjectId());
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
