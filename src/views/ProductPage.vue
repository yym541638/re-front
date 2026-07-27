<template>
  <div class="product_page">
    <div class="page_bg" aria-hidden="true"></div>
    <div class="page_bg_mask" aria-hidden="true"></div>

    <CommonHeader variant="light" buttonText="Login" />

    <div class="main_content">
      <div class="product_container">
        <header class="page_header">
          <img
            class="page_logo"
            src="@/assets/brand/complimind-logo.png"
            alt="CompliMind"
          />
          <div>
            <p class="eyebrow">Purchased Workspace</p>
            <h1>Your Products</h1>
            <p class="subtitle">
              Enter a product to start project setup, or promote your package
              coverage.
            </p>
          </div>
        </header>

        <div v-if="loading" class="state_box">Loading your products...</div>

        <div v-else-if="!products.length" class="state_box empty_box">
          <h3>No products yet</h3>
          <p>Purchase a SOC 2 package to unlock your compliance workspace.</p>
          <el-button class="primary_btn" type="primary" @click="goBuy">
            Browse packages
          </el-button>
        </div>

        <div v-else class="product_list">
          <div
            v-for="product in products"
            :key="product.product_id"
            class="product_card"
          >
            <div class="card_main">
              <div class="card_icon" aria-hidden="true">
                <img src="@/assets/brand/complimind-logo.png" alt="" />
              </div>
              <div class="card_copy">
                <h2>{{ product.product_name || "SOC 2" }}</h2>
                <div class="product_features">
                  <span
                    v-for="(feature, index) in normalizeFeatures(
                      product.included_features,
                    )"
                    :key="index"
                    class="feature_tag"
                  >
                    {{ feature }}
                  </span>
                  <span
                    v-if="!normalizeFeatures(product.included_features).length"
                    class="feature_tag muted"
                  >
                    No features listed
                  </span>
                </div>
              </div>
            </div>

            <div class="product_actions">
              <el-button
                class="enter_btn"
                type="primary"
                @click="goToProjectOverview(product)"
              >
                Enter
              </el-button>
              <el-button
                class="promote_btn"
                @click="goToPurchase(product)"
              >
                Promote
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonHeader from "../components/common/Header.vue";

export default {
  name: "ProductPage",
  components: {
    CommonHeader,
  },
  data() {
    return {
      loading: false,
      products: [],
    };
  },
  methods: {
    normalizeFeatures(features) {
      if (!features) return [];
      if (Array.isArray(features)) {
        return features.map((f) => String(f).trim()).filter(Boolean);
      }
      return String(features)
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    },
    async ordermy() {
      this.loading = true;
      try {
        const res = await this.$api.ordermy({});
        if (res.code == 0) {
          this.products = (res.data || []).map((item) => ({
            ...item,
            included_features: this.normalizeFeatures(item.included_features),
          }));
        } else {
          this.$message({
            message: res.message || "Failed to load products",
            type: "warning",
          });
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Failed to load products");
      } finally {
        this.loading = false;
      }
    },
    goToProjectOverview(product) {
      this.$router.push({
        path: "/ProjectOverview",
        query: {
          productId: product.product_id,
          productName: product.product_name,
        },
      });
    },
    goToPurchase(item) {
      this.$router.push({
        path: "/purchase",
        query: { item: JSON.stringify(item), product: "soc2" },
      });
    },
    goBuy() {
      this.$router.push({ path: "/purchase", query: { product: "soc2" } });
    },
  },
  created() {
    this.ordermy();
  },
};
</script>

<style lang="less" scoped>
.product_page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: #eef3f7;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

.page_bg {
  position: absolute;
  inset: 0;
  background: url("~@/assets/brand/complimind-login-bg.png") center / cover
    no-repeat;
  z-index: 0;
}

.page_bg_mask {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(238, 243, 247, 0.74) 50%,
    rgba(255, 255, 255, 0.9) 100%
  );
}

.main_content {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 100px 24px 48px;
  box-sizing: border-box;
}

.product_container {
  width: 100%;
  max-width: 920px;
}

.page_header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px 22px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
}

.page_logo {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: contain;
  background: #fff;
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  color: #0f766e;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.page_header h1 {
  margin: 0 0 4px;
  font-size: 26px;
  color: #0f172a;
  font-weight: 800;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.state_box {
  text-align: center;
  padding: 48px 24px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  color: #64748b;
}

.empty_box {
  h3 {
    margin: 0 0 8px;
    color: #0f172a;
  }

  p {
    margin: 0 0 18px;
  }
}

.product_list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.product_card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
  padding: 20px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #99f6e4;
    box-shadow: 0 14px 32px rgba(15, 118, 110, 0.12);
  }
}

.card_main {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  flex: 1;
}

.card_icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(15, 118, 110, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
}

.card_copy {
  min-width: 0;

  h2 {
    margin: 0 0 8px;
    font-size: 18px;
    color: #0f172a;
    font-weight: 700;
  }
}

.product_features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.feature_tag {
  padding: 4px 10px;
  background: rgba(15, 118, 110, 0.08);
  border-radius: 999px;
  font-size: 12px;
  color: #0f766e;
  font-weight: 600;

  &.muted {
    color: #94a3b8;
    background: #f1f5f9;
  }
}

.product_actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.enter_btn,
.primary_btn {
  border-radius: 8px !important;
  border: none !important;
  background: #0f766e !important;
  font-weight: 700;

  &:hover,
  &:focus {
    background: #0d9488 !important;
  }
}

.promote_btn {
  border-radius: 8px !important;
  border: 1px solid #0f766e !important;
  background: #fff !important;
  color: #0f766e !important;
  font-weight: 700;

  &:hover,
  &:focus {
    background: rgba(15, 118, 110, 0.06) !important;
    color: #0f766e !important;
  }
}

@media screen and (max-width: 720px) {
  .product_card {
    flex-direction: column;
    align-items: stretch;
  }

  .product_actions {
    width: 100%;

    .el-button {
      flex: 1;
    }
  }
}
</style>
