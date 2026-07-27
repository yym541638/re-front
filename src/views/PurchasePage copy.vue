<template>
  <div class="purchase_page">
    <!-- 导航栏 -->
    <CommonHeader />

    <!-- 主要内容区域 -->
    <div class="main_content">
      <div class="purchase_container">
        <!-- SOC2 介绍区域 -->
        <div class="soc2_intro">
          <div class="intro_image"></div>
          <div class="intro_title">Introduction of SOC2</div>
        </div>

        <!-- 产品选项区域 -->
        <div class="product_options">
          <!-- 动态生成产品卡片 -->
          <div
            v-for="product in products"
            :key="product.product_id"
            class="product_card"
          >
            <div class="product_name">{{ product.product_name }}</div>

            <div class="product_features">
              <div
                v-for="(feature, index) in product.features"
                :key="index"
                class="feature_item"
              >
                <span>{{ feature }}</span>
                <el-checkbox
                  v-model="product.selectedFeatures[feature]"
                ></el-checkbox>
              </div>
            </div>

            <div class="product_types">
              <el-switch
                v-model="product.type_switch"
                active-text="Type2"
                inactive-text="Type1"
              ></el-switch>
            </div>

            <div class="product_price">
              Annual
              <span>${{ product.price }}</span>
            </div>

            <el-button
              type="primary"
              class="buy_btn"
              @click="goToPayment(product)"
              >Buy</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonHeader from "../components/common/Header.vue";

export default {
  name: "PurchasePage",
  components: {
    CommonHeader,
  },
  data() {
    return {
      products: [],
    };
  },
  methods: {
    async detail() {
      let res = await this.$api.list({});
      if (res.code == 0) {
        console.log(res);
        // 将 features 数组转换为对象格式，用于跟踪勾选状态
        this.products = res.data.map((product) => ({
          ...product,
          selectedFeatures: product.features.reduce((acc, feature) => {
            acc[feature] = true; // 默认都勾选
            return acc;
          }, {}),
        }));
      } else {
        this.$message({
          message: res.message,
          type: "warning",
        });
      }
    },
    async goToPayment(item) {
      // 获取勾选的 features
      const selectedFeaturesList = Object.entries(item.selectedFeatures)

        .filter(([_, selected]) => selected)
        .map(([feature, _]) => feature);

      const selectFeatures = selectedFeaturesList.join(",");
     console.log("Item features:", selectFeatures);
      // let perm = {
      //   productId: item.product_id,
      //   packageId: item.product_id,
      //   audit_type: item.type_switch == false ? "Type1" : "Type2",
      //   amount: item.price,
      //   selectFeatures: selectFeatures,
      // };
      // console.log("permkkkkkkkkkk", perm);
      // let res = await this.$api.create0rder(perm);
      // if (res.code == 0) {
      //   console.log(res);
      // } else {
      //   this.$message({
      //     message: res.message,
      //     type: "warning",
      //   });
      // }
    },
  },
  created() {
    this.detail();
  },
};
</script>

<style lang="less" scoped>
.purchase_page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  /deep/.el-switch__label {
    color: #fafafa;
  }
  /deep/.el-switch__label.is-active {
    color: #0775db;
  }
}

.main_content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.purchase_container {
  width: 100%;
  max-width: 1200px;
}

/* SOC2 介绍区域 */
.soc2_intro {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  background-color: rgba(17, 17, 61);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;

  .intro_image {
    margin-right: 30px;
    img {
      width: 120px;
      height: 120px;
    }
  }

  .intro_title {
    font-size: 24px;
    font-weight: bold;
    color: #0775db;
  }
}

/* 产品选项区域 */
.product_options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* 产品卡片 */
.product_card {
  background-color: rgba(17, 17, 61);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 8px 24px rgba(85, 124, 245, 0.3);
    background-color: rgba(20, 20, 70);
  }

  .product_name {
    font-size: 18px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 20px;
    text-align: center;
  }

  .product_features {
    margin-bottom: 20px;
    border-bottom: 1px dashed #d8dce5;
    padding-bottom: 20px;

    .feature_item {
      font-family: "PingFang SC";
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      span {
        font-size: 14px;
        color: #fafafa;
      }

      .el-radio {
        .el-icon-checked {
          color: #557cf5;
        }
        .el-icon-close {
          color: #d8dce5;
        }
      }
    }
  }

  .product_types {
    font-family: "PingFang SC";
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    span {
      font-size: 14px;
      color: #666666;
      margin-right: 12px;
    }

    .el-checkbox {
      margin-right: 16px;
    }
  }

  .product_price {
    font-size: 20px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 20px;
    text-align: center;
    span {
      color: #fe5f57;
    }
  }

  .buy_btn {
    width: 100%;
  }
}
</style>
