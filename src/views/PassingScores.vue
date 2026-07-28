<template>
  <div class="cm-page">
    <div class="cm-page__body cm-page__body--center">
      <div v-if="loading" class="state-text">Loading...</div>
      <div v-else-if="!projectId" class="state-text">
        Please open a project from Project overview first
      </div>
      <div v-else class="score-panel">
        <div class="cm-card score-card">
          <div class="score-text">
            Your compliance result is:
            <span class="score-value" :class="scoreClass">{{ displayScore }}%</span>
            to pass
            <div class="likely-to-pass" :class="resultClass">
              {{ resultText }}
            </div>
          </div>

          <div class="progress-container">
            <div class="pass-indicator" :style="indicatorStyle">
              <div class="pass-text" :class="indicatorClass">
                {{ indicatorText }}
              </div>
              <div class="arrow-down" :class="indicatorClass"></div>
            </div>
            <div class="progress-bar">
              <div class="progress-red" :style="{ width: zoneRed + '%' }"></div>
              <div class="progress-yellow" :style="{ width: zoneYellow + '%' }"></div>
              <div class="progress-green" :style="{ width: zoneGreen + '%' }"></div>
            </div>
            <div class="zone-labels">
              <span class="zone-label zone-label--fail">0–{{ yellowMin }}% Fail</span>
              <span class="zone-label zone-label--caution">{{ yellowMin }}–{{ greenMin }}% Caution</span>
              <span class="zone-label zone-label--pass">{{ greenMin }}–100% Pass</span>
            </div>
          </div>
        </div>

        <div class="metric-row">
          <div class="metric-item">
            <div class="metric-value">{{ summary.total }}</div>
            <div class="metric-label">Total tests</div>
          </div>
          <div class="metric-item metric-item--ok">
            <div class="metric-value">{{ summary.passed }}</div>
            <div class="metric-label">Passed</div>
          </div>
          <div class="metric-item metric-item--bad">
            <div class="metric-value">{{ summary.failed }}</div>
            <div class="metric-label">Failed</div>
          </div>
          <div class="metric-item metric-item--warn">
            <div class="metric-value">{{ summary.pending }}</div>
            <div class="metric-label">Pending</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">{{ summary.gapCount }}</div>
            <div class="metric-label">Gaps</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const YELLOW_MIN = 70;
const GREEN_MIN = 95;

export default {
  name: "PassingScores",
  data() {
    return {
      projectId: null,
      loading: false,
      score: 0,
      assessment: "",
      yellowMin: YELLOW_MIN,
      greenMin: GREEN_MIN,
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        pending: 0,
        gapCount: 0,
      },
    };
  },
  computed: {
    displayScore() {
      const n = Number(this.score);
      if (Number.isNaN(n)) return 0;
      return Math.round(n * 100) / 100;
    },
    zoneRed() {
      return this.yellowMin;
    },
    zoneYellow() {
      return this.greenMin - this.yellowMin;
    },
    zoneGreen() {
      return 100 - this.greenMin;
    },
    clampedScore() {
      const n = Number(this.score) || 0;
      return Math.max(0, Math.min(100, n));
    },
    indicatorStyle() {
      return { left: `${this.clampedScore}%` };
    },
    resultText() {
      if (this.assessment) {
        const map = {
          必过: "Certain to pass",
          大概率能过: "Likely to pass",
          风险较高: "Unlikely to pass",
        };
        if (map[this.assessment]) return map[this.assessment];
      }
      if (this.score >= this.greenMin) return "Certain to pass";
      if (this.score >= this.yellowMin) return "Likely to pass";
      return "Unlikely to pass";
    },
    resultClass() {
      if (this.score >= this.greenMin) return "text-green";
      if (this.score >= this.yellowMin) return "text-teal";
      return "text-red";
    },
    indicatorText() {
      return this.score >= this.yellowMin ? "Pass" : "Fail";
    },
    indicatorClass() {
      if (this.score >= this.greenMin) return "indicator-green";
      if (this.score >= this.yellowMin) return "indicator-teal";
      return "indicator-red";
    },
    scoreClass() {
      if (this.score >= this.greenMin) return "score-green";
      if (this.score >= this.yellowMin) return "score-teal";
      return "score-red";
    },
  },
  created() {
    this.resolveProjectContext();
    this.loadPassRate();
  },
  methods: {
    resolveProjectContext() {
      this.projectId =
        this.$route.query.projectId ||
        sessionStorage.getItem("currentProjectId") ||
        null;
    },
    async loadPassRate() {
      if (!this.projectId) return;
      this.loading = true;
      try {
        const res = await this.$api.analysisPassRate(this.projectId);
        if (res.code == 0) {
          const data = res.data || {};
          this.score = Number(data.passRate != null ? data.passRate : 0);
          this.assessment = data.assessment || "";
          this.summary = {
            total: Number(data.total || 0),
            passed: Number(data.passed || 0),
            failed: Number(data.failed || 0),
            pending: Number(data.pending || 0),
            gapCount: Number(data.gapCount || 0),
          };
        } else {
          this.$message.warning(res.message || "Load passing scores failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Load passing scores failed");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cm-page__body--center {
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.state-text {
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
}

.score-panel {
  width: 100%;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.score-card {
  width: 100%;
  text-align: center;
  padding: 48px 40px 36px;
}

.score-text {
  font-size: 20px;
  font-weight: 500;
  color: #0f172a;
  margin-bottom: 56px;
}

.likely-to-pass {
  font-size: 16px;
  margin-top: 12px;
  font-weight: 600;
}

.text-green {
  color: #16a34a;
}

.text-teal {
  color: #0f766e;
}

.text-red {
  color: #dc2626;
}

.score-value {
  display: inline-block;
  margin: 0 5px;
  font-weight: 700;
}

.score-green {
  color: #16a34a;
}

.score-teal {
  color: #0f766e;
}

.score-red {
  color: #dc2626;
}

.progress-container {
  position: relative;
  margin-top: 8px;
  padding-top: 36px;
}

.progress-bar {
  height: 18px;
  background-color: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  display: flex;
}

.progress-red {
  height: 100%;
  background-color: #dc2626;
}

.progress-yellow {
  height: 100%;
  background-color: #f59e0b;
}

.progress-green {
  height: 100%;
  background-color: #0f766e;
}

.pass-indicator {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.pass-text {
  font-size: 13px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.96);
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.08);
}

.arrow-down {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 9px solid;
  margin-top: 1px;
}

.indicator-green {
  color: #16a34a !important;

  &.arrow-down,
  .arrow-down {
    border-top-color: #16a34a !important;
  }

  &.pass-text,
  .pass-text {
    border: 1px solid #16a34a !important;
  }
}

.indicator-teal {
  color: #0f766e !important;

  &.arrow-down,
  .arrow-down {
    border-top-color: #0f766e !important;
  }

  &.pass-text,
  .pass-text {
    border: 1px solid #0f766e !important;
  }
}

.indicator-red {
  color: #dc2626 !important;

  &.arrow-down,
  .arrow-down {
    border-top-color: #dc2626 !important;
  }

  &.pass-text,
  .pass-text {
    color: #dc2626 !important;
    border: 1px solid #dc2626 !important;
  }
}

.zone-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  gap: 8px;
}

.zone-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.zone-label--fail {
  color: #dc2626;
}

.zone-label--caution {
  color: #d97706;
  text-align: center;
  flex: 1;
}

.zone-label--pass {
  color: #0f766e;
  text-align: right;
}

.metric-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.metric-item {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 12px;
  text-align: center;
}

.metric-value {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.metric-label {
  margin-top: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.metric-item--ok .metric-value {
  color: #0f766e;
}

.metric-item--bad .metric-value {
  color: #dc2626;
}

.metric-item--warn .metric-value {
  color: #d97706;
}

@media (max-width: 720px) {
  .score-card {
    padding: 32px 20px 28px;
  }

  .metric-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
