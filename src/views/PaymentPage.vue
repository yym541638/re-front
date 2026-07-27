<template>
  <div class="payment_page">
    <div class="page_bg" aria-hidden="true"></div>
    <div class="page_bg_mask" aria-hidden="true"></div>

    <CommonHeader variant="light" buttonText="Login" />

    <div class="main_content">
      <div class="payment_layout">
        <aside class="order_summary">
          <div class="summary_header">
            <img
              class="summary_logo"
              src="@/assets/brand/complimind-logo.png"
              alt="CompliMind"
            />
            <div>
              <p class="summary_eyebrow">Order Summary</p>
              <h2 class="summary_title">SOC 2 Package</h2>
            </div>
          </div>

          <div class="summary_rows">
            <div class="summary_row">
              <span>Product</span>
              <strong>{{ paymentItem.productName || "SOC2 Package" }}</strong>
            </div>
            <div class="summary_row">
              <span>Audit Type</span>
              <strong>{{ paymentItem.auditType || "-" }}</strong>
            </div>
            <div class="summary_row features_row">
              <span>Selected Scope</span>
              <strong>{{ featureText }}</strong>
            </div>
          </div>

          <div class="summary_total">
            <span>Annual Total</span>
            <em>${{ paymentItem.amount || "0" }}</em>
          </div>

          <button class="back_link" type="button" @click="goBack">
            ← Back to packages
          </button>
        </aside>

        <section class="payment_card">
          <h1 class="card_title">Complete Payment</h1>
          <p class="card_desc">
            Choose a payment method to activate your compliance workspace.
          </p>

          <el-tabs v-model="activeName" class="payment_tabs">
            <el-tab-pane label="Paypal" name="Paypal">
              <el-form
                class="paypal_form"
                label-position="top"
                @submit.native.prevent="Paynow"
              >
                <el-form-item label="Paypal Account" required>
                  <div class="input_with_button">
                    <el-input
                      v-model.trim="paypalAccount"
                      placeholder="Paypal account"
                    />
                    <el-button
                      class="send_code_btn"
                      :loading="sendingCode"
                      @click="sendCode"
                    >
                      Send validation code
                    </el-button>
                  </div>
                </el-form-item>

                <el-form-item label="Validation code" required>
                  <el-input
                    v-model.trim="validationCode"
                    placeholder="Code"
                    maxlength="8"
                  />
                </el-form-item>

                <el-button
                  class="payment_btn"
                  type="primary"
                  :loading="paying"
                  @click="Paynow"
                >
                  Pay Now
                </el-button>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="QR Code payment" name="payment">
              <div class="qr_panel">
                <div class="qr_code_placeholder">
                  <div class="qr_fake" aria-hidden="true"></div>
                </div>
                <p class="qr_tip">
                  Scan the QR code with your payment app to complete checkout.
                </p>
                <el-button
                  class="payment_btn"
                  type="primary"
                  :loading="paying"
                  @click="Paynow"
                >
                  I have paid
                </el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import CommonHeader from "../components/common/Header.vue";

export default {
  name: "PaymentPage",
  components: {
    CommonHeader,
  },
  data() {
    return {
      activeName: "Paypal",
      paymentItem: {},
      paypalAccount: "",
      validationCode: "",
      sendingCode: false,
      paying: false,
    };
  },
  computed: {
    featureText() {
      const raw = this.paymentItem.selectFeatures;
      if (!raw) return "Not selected";
      return String(raw)
        .split(",")
        .filter(Boolean)
        .join(" · ");
    },
  },
  created() {
    const itemStr = this.$route.query.item;
    if (itemStr) {
      try {
        this.paymentItem = JSON.parse(itemStr) || {};
      } catch (e) {
        this.paymentItem = {};
      }
    }
  },
  methods: {
    goBack() {
      this.$router.push({ path: "/purchase", query: { product: "soc2" } });
    },
    sendCode() {
      if (!this.paypalAccount) {
        this.$message.warning("Please enter Paypal account");
        return;
      }
      this.sendingCode = true;
      setTimeout(() => {
        this.sendingCode = false;
        this.$message.success("Validation code sent");
      }, 600);
    },
    async Paynow() {
      if (this.activeName === "Paypal") {
        if (!this.paypalAccount) {
          this.$message.warning("Please enter Paypal account");
          return;
        }
        if (!this.validationCode) {
          this.$message.warning("Please enter validation code");
          return;
        }
      }
      if (!this.paymentItem || !this.paymentItem.productId) {
        this.$message.warning("Missing order information");
        return;
      }

      this.paying = true;
      try {
        const payload = {
          ...this.paymentItem,
          paymentMethod: this.activeName,
          paypalAccount: this.paypalAccount,
          validationCode: this.validationCode,
        };
        const res = await this.$api.submit(payload);
        if (res.code == 0) {
          this.$message.success("Purchase succeeded");
          sessionStorage.setItem("purchase_status", "1");
          this.$router.push({ path: "/products" });
        } else {
          this.$message({
            message: res.message || "Payment failed",
            type: "warning",
          });
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Payment failed");
      } finally {
        this.paying = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.payment_page {
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
  align-items: center;
  justify-content: center;
  padding: 100px 24px 48px;
  box-sizing: border-box;
}

.payment_layout {
  width: 100%;
  max-width: 980px;
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
}

.order_summary,
.payment_card {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.07);
  backdrop-filter: blur(8px);
}

.order_summary {
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.summary_header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.summary_logo {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: contain;
  background: #fff;
}

.summary_eyebrow {
  margin: 0 0 2px;
  font-size: 11px;
  font-weight: 700;
  color: #0f766e;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.summary_title {
  margin: 0;
  font-size: 18px;
  color: #0f172a;
}

.summary_rows {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

.summary_row {
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 600;
  }

  strong {
    font-size: 14px;
    color: #0f172a;
    font-weight: 600;
    line-height: 1.4;
    word-break: break-word;
  }
}

.summary_total {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px dashed #dbe3ee;
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  span {
    font-size: 13px;
    color: #64748b;
    font-weight: 600;
  }

  em {
    font-style: normal;
    font-size: 28px;
    font-weight: 800;
    color: #0f766e;
  }
}

.back_link {
  margin-top: 16px;
  border: none;
  background: transparent;
  color: #0f766e;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
}

.payment_card {
  padding: 28px 28px 24px;
}

.card_title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

.card_desc {
  margin: 0 0 18px;
  font-size: 13px;
  color: #64748b;
}

.payment_tabs {
  /deep/ .el-tabs__item {
    font-size: 15px;
    font-weight: 600;
    color: #64748b;
  }

  /deep/ .el-tabs__item.is-active {
    color: #0f766e;
  }

  /deep/ .el-tabs__active-bar {
    background-color: #0f766e;
  }

  /deep/ .el-tabs__nav-wrap::after {
    background-color: #e2e8f0;
  }
}

.paypal_form {
  padding-top: 8px;

  /deep/ .el-form-item__label {
    color: #334155;
    font-weight: 600;
    padding-bottom: 6px;
  }

  /deep/ .el-input__inner {
    height: 42px;
    border-radius: 8px;
    border-color: #cbd5e1;

    &:focus {
      border-color: #0f766e !important;
    }
  }
}

.input_with_button {
  display: flex;
  gap: 10px;
  width: 100%;

  .el-input {
    flex: 1;
  }
}

.send_code_btn {
  white-space: nowrap;
  border-radius: 8px !important;
  border: none !important;
  background: #0f766e !important;
  color: #fff !important;
  height: 42px;
  padding: 0 14px;

  &:hover,
  &:focus {
    background: #0d9488 !important;
    color: #fff !important;
  }
}

.payment_btn {
  width: 100%;
  height: 44px;
  margin-top: 8px;
  border-radius: 8px !important;
  border: none !important;
  background: #0f766e !important;
  font-size: 15px;
  font-weight: 700;

  &:hover,
  &:focus {
    background: #0d9488 !important;
  }
}

.qr_panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
}

.qr_code_placeholder {
  width: 220px;
  height: 220px;
  background: #f8fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #cbd5e1;
  margin-bottom: 14px;
}

.qr_fake {
  width: 168px;
  height: 168px;
  border-radius: 8px;
  background:
    linear-gradient(#0f172a 0 0) 0 0 / 28% 28%,
    linear-gradient(#0f172a 0 0) 100% 0 / 28% 28%,
    linear-gradient(#0f172a 0 0) 0 100% / 28% 28%,
    repeating-linear-gradient(
      90deg,
      #0f172a 0 6px,
      transparent 6px 12px
    ),
    repeating-linear-gradient(
      0deg,
      #0f172a 0 6px,
      transparent 6px 12px
    ),
    #fff;
  background-repeat: no-repeat;
  background-blend-mode: multiply;
  opacity: 0.85;
}

.qr_tip {
  margin: 0 0 16px;
  font-size: 13px;
  color: #64748b;
  text-align: center;
}

@media screen and (max-width: 860px) {
  .payment_layout {
    grid-template-columns: 1fr;
  }

  .input_with_button {
    flex-direction: column;
  }
}
</style>
