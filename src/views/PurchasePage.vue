<template>
  <div class="purchase_page">
    <div class="page_bg" aria-hidden="true"></div>
    <div class="page_bg_mask" aria-hidden="true"></div>

    <CommonHeader variant="light" buttonText="Login" />

    <div class="main_content">
      <div class="purchase_container">
        <section class="hero_banner">
          <div class="hero_left">
            <img
              class="hero_logo"
              src="@/assets/brand/complimind-logo.png"
              alt="CompliMind"
            />
            <div>
              <p class="hero_eyebrow">SOC 2 Compliance Preparation</p>
              <h1 class="hero_title">Introduction of SOC2</h1>
              <p class="hero_desc">
                Choose coverage scope and assessment depth to unlock evidence
                collection, control tables, gap analysis, and readiness scoring.
              </p>
            </div>
          </div>
          <div class="hero_tags">
            <span>Security</span>
            <span>Availability</span>
            <span>Confidentiality</span>
          </div>
        </section>

        <div v-if="loading" class="loading_state">Loading packages...</div>

        <div v-else class="product_options">
          <div
            v-for="(product, index) in products"
            :key="product.product_id"
            class="product_card"
            :class="{ 'is-featured': index === 1 }"
          >
            <div class="card_badge" v-if="index === 1">Recommended</div>
            <div class="product_name">{{ product.product_name }}</div>
            <p class="product_hint">Select trust service criteria to include</p>

            <div class="product_features">
              <label
                v-for="(feature, fIndex) in product.features"
                :key="fIndex"
                class="feature_item"
                :class="{ checked: product.selectedFeatures[feature] }"
              >
                <span>{{ feature }}</span>
                <el-checkbox v-model="product.selectedFeatures[feature]" />
              </label>
            </div>

            <div class="product_types">
              <div class="type_copy">
                <strong>{{ product.type_switch ? "Type 2" : "Type 1" }}</strong>
                <small>
                  {{
                    product.type_switch
                      ? "Operating effectiveness over a period"
                      : "Design suitability at a point in time"
                  }}
                </small>
              </div>
              <el-switch
                v-model="product.type_switch"
                active-text="Type2"
                inactive-text="Type1"
              />
            </div>

            <div class="product_price">
              <span class="price_label">Annual</span>
              <span class="price_value">${{ displayPrice(product) }}</span>
            </div>

            <el-button
              type="primary"
              class="buy_btn"
              :disabled="!hasSelectedFeature(product)"
              @click="goToPayment(product)"
            >
              Buy
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import CommonHeader from "../components/common/Header.vue";

export default {
  name: "PurchasePage",
  components: {
    CommonHeader,
  },
  data() {
    return {
      loading: false,
      products: [],
      productId: "",
      purchasedProducts: [],
    };
  },
  methods: {
    displayPrice(product) {
      const base = Number(product.price) || 0;
      if (product.type_switch) {
        return product.price_type2 || Math.round(base * 1.15);
      }
      return base;
    },
    hasSelectedFeature(product) {
      return Object.values(product.selectedFeatures || {}).some(Boolean);
    },
    async list1() {
      this.loading = true;
      try {
        const res = await this.$api.list({});
        if (res.code == 0) {
          this.products = (res.data || []).map((product) => {
            const selectedFeatures = {};
            (product.features || []).forEach((feature) => {
              Vue.set(selectedFeatures, feature, false);
            });
            return {
              ...product,
              type_switch: !!product.type_switch,
              selectedFeatures,
            };
          });
        } else {
          this.$message({
            message: res.message || "Failed to load packages",
            type: "warning",
          });
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Failed to load packages");
      } finally {
        this.loading = false;
      }
    },
    async goToPayment(item) {
      if (!this.hasSelectedFeature(item)) {
        this.$message.warning("Please select at least one feature");
        return;
      }

      const selectedFeaturesList = Object.entries(item.selectedFeatures)
        .filter(([, selected]) => selected)
        .map(([feature]) => feature);

      const perm = {
        productId: item.product_id,
        auditType: item.type_switch ? "Type2" : "Type1",
        amount: this.displayPrice(item),
        selectFeatures: selectedFeaturesList.join(","),
        productName: item.product_name,
      };

      this.$router.push({
        path: "/payment",
        query: { item: JSON.stringify(perm) },
      });
    },
    async detailS(id) {
      const res = await this.$api.detail({ productId: id });
      if (res.code == 0) {
        this.purchasedProducts = res.data || [];
        this.updateSelectedFeatures();
      }
    },
    updateSelectedFeatures() {
      if (!this.products.length || !this.purchasedProducts.length) return;

      this.products.forEach((product) => {
        const purchased = this.purchasedProducts.find(
          (p) => p.product_id === product.product_id,
        );
        if (!purchased) return;

        product.type_switch = !!purchased.type_switch;
        product.features.forEach((feature) => {
          Vue.set(product.selectedFeatures, feature, false);
        });
        (purchased.features || []).forEach((feature) => {
          if (Object.prototype.hasOwnProperty.call(product.selectedFeatures, feature)) {
            Vue.set(product.selectedFeatures, feature, true);
          }
        });
      });
    },
  },
  async created() {
    await this.list1();
    if (this.$route.query.item) {
      try {
        this.productId = JSON.parse(this.$route.query.item);
        if (this.productId && this.productId.product_id) {
          await this.detailS(this.productId.product_id);
        }
      } catch (e) {
        /* ignore bad query */
      }
    }
  },
};
</script>

<style lang="less" scoped>
.purchase_page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #eef3f7;
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
    rgba(255, 255, 255, 0.78) 0%,
    rgba(238, 243, 247, 0.72) 50%,
    rgba(255, 255, 255, 0.88) 100%
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

.purchase_container {
  width: 100%;
  max-width: 1120px;
}

.hero_banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 24px 28px;
  margin-bottom: 28px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(8px);
}

.hero_left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hero_logo {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: contain;
  background: #fff;
}

.hero_eyebrow {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 600;
  color: #0f766e;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero_title {
  margin: 0 0 6px;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
}

.hero_desc {
  margin: 0;
  max-width: 560px;
  font-size: 13px;
  line-height: 1.5;
  color: #64748b;
}

.hero_tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;

  span {
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(15, 118, 110, 0.08);
    color: #0f766e;
    font-size: 12px;
    font-weight: 600;
  }
}

.loading_state {
  text-align: center;
  color: #64748b;
  padding: 48px 0;
}

.product_options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.product_card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
  padding: 24px 22px 20px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.1);
    border-color: #99f6e4;
  }

  &.is-featured {
    border-color: #0f766e;
    box-shadow: 0 16px 40px rgba(15, 118, 110, 0.16);
  }
}

.card_badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #0f766e;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.product_name {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.product_hint {
  margin: 0 0 16px;
  font-size: 12px;
  color: #94a3b8;
}

.product_features {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #dbe3ee;
}

.feature_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;

  span {
    font-size: 14px;
    color: #334155;
    font-weight: 500;
  }

  &:hover,
  &.checked {
    background: rgba(15, 118, 110, 0.06);
  }

  &.checked span {
    color: #0f766e;
  }
}

.product_types {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;

  .type_copy {
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong {
      font-size: 13px;
      color: #0f172a;
    }

    small {
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.3;
    }
  }

  /deep/ .el-switch__label {
    color: #94a3b8;
  }

  /deep/ .el-switch__label.is-active {
    color: #0f766e;
  }

  /deep/ .el-switch.is-checked .el-switch__core {
    border-color: #0f766e;
    background-color: #0f766e;
  }
}

.product_price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;

  .price_label {
    font-size: 13px;
    color: #64748b;
    font-weight: 600;
  }

  .price_value {
    font-size: 28px;
    font-weight: 800;
    color: #0f766e;
    letter-spacing: -0.02em;
  }
}

.buy_btn {
  width: 100%;
  height: 42px;
  border-radius: 8px !important;
  border: none !important;
  background: #0f766e !important;
  font-weight: 700;
  font-size: 15px;

  &:hover,
  &:focus {
    background: #0d9488 !important;
  }

  &.is-disabled,
  &.is-disabled:hover {
    background: #94a3b8 !important;
    border-color: #94a3b8 !important;
  }
}

@media screen and (max-width: 960px) {
  .product_options {
    grid-template-columns: 1fr;
  }

  .hero_banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero_tags {
    justify-content: flex-start;
  }
}
</style>
