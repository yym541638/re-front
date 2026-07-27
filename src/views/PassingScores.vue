<template>
  <div class="cm-page">
    <div class="cm-page__body cm-page__body--center">
      <div class="cm-card score-card">
        <div class="score-text">
          Your compliance result is:
          <span class="score-value" :class="scoreClass">{{ score }}%</span>
          to pass
          <div class="likely-to-pass" :class="resultClass">
            {{ resultText }}
          </div>
        </div>

        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-red" style="width: 70%"></div>
            <div class="progress-yellow" style="width: 25%"></div>
            <div class="progress-green" style="width: 5%"></div>
          </div>
          <div class="pass-indicator" :style="{ left: score + '%' }">
            <div class="pass-text" :class="indicatorClass">
              {{ indicatorText }}
            </div>
            <div class="arrow-down" :class="indicatorClass"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PassingScores",
  data() {
    return {
      score: 80,
    };
  },
  computed: {
    resultText() {
      if (this.score >= 95) {
        return "Certain to pass";
      } else if (this.score >= 70) {
        return "Likely to pass";
      }
      return "Unlikely to pass";
    },
    resultClass() {
      if (this.score >= 95) {
        return "text-green";
      } else if (this.score >= 70) {
        return "text-teal";
      }
      return "text-red";
    },
    indicatorText() {
      if (this.score >= 70) {
        return "Pass";
      }
      return "Fail";
    },
    indicatorClass() {
      if (this.score >= 95) {
        return "indicator-green";
      } else if (this.score >= 70) {
        return "indicator-teal";
      }
      return "indicator-red";
    },
    scoreClass() {
      if (this.score >= 95) {
        return "score-green";
      } else if (this.score >= 70) {
        return "score-teal";
      }
      return "score-red";
    },
  },
};
</script>

<style lang="less" scoped>
.cm-page__body--center {
  align-items: center;
  justify-content: center;
}

.score-card {
  width: 80%;
  max-width: 620px;
  text-align: center;
}

.score-text {
  font-size: 20px;
  font-weight: 500;
  color: #0f172a;
  margin-bottom: 60px;
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
  margin-top: 20px;
}

.progress-bar {
  height: 20px;
  background-color: #e2e8f0;
  border-radius: 10px;
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
  top: -40px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pass-text {
  font-size: 14px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.08);
}

.arrow-down {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid;
  margin-top: 1px;
}

.indicator-green {
  color: #16a34a !important;

  .arrow-down {
    border-top-color: #16a34a !important;
  }

  .pass-text {
    border: 1px solid #16a34a !important;
  }
}

.indicator-teal {
  color: #0f766e !important;

  .arrow-down {
    border-top-color: #0f766e !important;
  }

  .pass-text {
    border: 1px solid #0f766e !important;
  }
}

.indicator-red {
  color: #dc2626 !important;

  .arrow-down {
    border-top-color: #dc2626 !important;
  }

  .pass-text {
    color: #dc2626 !important;
    border: 1px solid #dc2626 !important;
  }
}
</style>
