<template>
  <div class="header-wrapper">
    <img
      class="logo"
      width="130px"
      src="https://purcotton-omni.oss-cn-shenzhen.aliyuncs.com/SaaS/application/material/system-logo.png"
      alt="logo"
    />
    <div class="header-right">
      <img
        class="avatar"
        src="https://thirdwx.qlogo.cn/mmopen/vi_32/JlibYlfzWaBicvc8ge8EwLgRB4mA6rnDS3tvdxbDKqp5D3KOHwtliceAWIHkSojAdJV2pwqamBC3p8sWhCjGfe3Jw/132"
        alt="avatar"
        @click="showUserPopover"
      />
      <span class="user-name">User Name</span>
    </div>

    <!--个人中心-->
    <div
      class="user-popover"
      v-show="showUser"
    >
      <div class="user-content">
        <div class="link-item">个人中心</div>
        <div class="link-item">商户信息</div>
        <div class="link-item">账号设置</div>
      </div>
      <div class="logout">
        <span class="p-cursor">退出登录</span>
        <span class="switch-btn p-cursor">切换</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Header",
  data() {
    return {
      showUser: false //个人设置
    };
  },
  methods: {
    showUserPopover() {
      this.showUser = !this.showUser;
    },
    closePersonal() {
      this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.header-wrapper {
  position: fixed;
  top: 0;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  background: #75ccb9;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
  padding-left: 10px;
  padding-right: 10px;

  /**基础设置**/
  .header-right {
    display: flex;
    align-items: center;

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
    }

    .user-name {
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .user-popover {
    position: fixed;
    top: 36px;
    right: 10px;
    z-index: 10;
    width: 200px;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    .user-content {
      box-sizing: border-box;
      padding: 8px 0;
    }
    .link-item {
      height: 32px;
      box-sizing: border-box;
      line-height: 32px;
      padding-left: 16px;
      padding-right: 16px;
      cursor: pointer;

      &:hover {
        background-color: #dae6e5;
      }
    }

    .logout {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 47px;
      box-sizing: border-box;
      border-top: 1px solid #e8e8e8;
      line-height: 46px;
      padding-left: 16px;
      padding-right: 16px;
      .switch-btn {
        display: inline-block;
        overflow: hidden;
        width: 48px;
        height: 20px;
        line-height: 20px;
        border-radius: 2px;
        border: 1px solid #00aa91;

        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #00aa91;
        text-align: center;
      }
    }
  }
}
</style>
