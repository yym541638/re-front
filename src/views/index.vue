<template>
  <div class="index_page">
    <div class="page_bg" aria-hidden="true"></div>
    <div class="page_bg_mask" aria-hidden="true"></div>
    <div class="page_glow" aria-hidden="true"></div>

    <CommonHeader variant="light" buttonText="Login" />

    <main class="hero">
      <img
        class="hero_logo"
        src="@/assets/brand/complimind-logo.png"
        alt="CompliMind"
      />
      <h1 class="hero_brand">CompliMind</h1>
      <p class="hero_tagline">
        Enterprise SOC 2 compliance preparation — from evidence to readiness.
      </p>
      <div class="hero_actions">
        <button class="btn_primary" type="button" @click="goPurchase">
          Explore SOC 2
        </button>
        <button class="btn_ghost" type="button" @click="goLogin">
          Sign in
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import CommonHeader from "../components/common/Header.vue";

export default {
  name: "Index",
  components: {
    CommonHeader,
  },
  methods: {
    goPurchase() {
      this.$router.push({ path: "/purchase", query: { product: "soc2" } });
    },
    goLogin() {
      this.$router.push({ name: "login" });
    },
  },
};
</script>

<style lang="less" scoped>
.index_page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: #e8eef4;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

.page_bg {
  position: absolute;
  inset: 0;
  background: url("~@/assets/brand/complimind-login-bg.png") center / cover
    no-repeat;
  transform: scale(1.03);
  animation: bgDrift 28s ease-in-out infinite alternate;
  z-index: 0;
}

.page_bg_mask {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(232, 238, 244, 0.35) 42%,
      rgba(255, 255, 255, 0.7) 100%
    ),
    radial-gradient(
      ellipse 55% 45% at 50% 42%,
      rgba(255, 255, 255, 0.72),
      transparent 70%
    );
}

.page_glow {
  position: absolute;
  width: 52vw;
  height: 52vw;
  left: 50%;
  top: 38%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(15, 118, 110, 0.12) 0%,
    transparent 68%
  );
  filter: blur(8px);
  animation: pulseSoft 6s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
}

.hero {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 110px 24px 64px;
  box-sizing: border-box;
}

.hero_logo {
  width: 88px;
  height: 88px;
  object-fit: contain;
  border-radius: 20px;
  margin-bottom: 18px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
  animation: logoIn 0.8s ease both;
}

.hero_brand {
  margin: 0 0 12px;
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #0f172a;
  animation: fadeUp 0.8s ease 0.1s both;
}

.hero_tagline {
  margin: 0 0 28px;
  max-width: 520px;
  font-size: 16px;
  line-height: 1.6;
  color: #475569;
  animation: fadeUp 0.8s ease 0.2s both;
}

.hero_actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeUp 0.8s ease 0.3s both;
}

.btn_primary,
.btn_ghost {
  min-width: 148px;
  height: 44px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.btn_primary {
  border: none;
  background: #0f766e;
  color: #fff;
  box-shadow: 0 10px 24px rgba(15, 118, 110, 0.28);

  &:hover {
    background: #0d9488;
    transform: translateY(-1px);
  }
}

.btn_ghost {
  border: 1px solid #cbd5e1;
  background: rgba(255, 255, 255, 0.75);
  color: #0f172a;

  &:hover {
    border-color: #0f766e;
    color: #0f766e;
    transform: translateY(-1px);
  }
}

@keyframes bgDrift {
  from {
    transform: scale(1.03) translate3d(0, 0, 0);
  }
  to {
    transform: scale(1.06) translate3d(-1.2%, 1%, 0);
  }
}

@keyframes pulseSoft {
  0%,
  100% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.06);
  }
}

@keyframes logoIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
