<template>
  <div class="about">
    <tool-bar @add-item="addItem">
      <template slot="tooltip">
        <el-tooltip
          class="tool-item"
          effect="dark"
          content="提示文字"
          placement="bottom-start"
        >
          <el-button @click="deleteItems" size="mini">delete</el-button>
        </el-tooltip>
      </template>
    </tool-bar>
    <div class="table-container">
      <eff-table
        ref="table"
        v-model="columns"
        :data="data"
        :edit-stop="editStop"
        drag
        edit
        border
        :cell-class-name="cellClassName"
        :show-summary="true"
        sum-text="合计"
        @editColumnLastToNext="editColumnLastToNext"
        @selection-change="handleSelectionChange"
      >
        <!-- <div slot="toolbar">
          <el-button
            @click="add"
            size="mini"
          >新增</el-button>
          <el-button
            @click="deleteItems"
            size="mini"
          >删除</el-button>
        </div> -->
      </eff-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "about",
  data() {
    return {
      data: [],
      editStop: false,
      columns: [
        {
          show: true,
          type: "selection",
          width: 60,
          fixed: "left"
        },
        {
          show: true,
          prop: "whType",
          title: "仓库类型",
          cellRender: (h, { row, prop }) => {
            // const typeItem = this.whTypeOptions.find(item => {
            //   return item.value == row[prop]
            // })
            return row[prop];
          },
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-select
                  {...{
                    attrs: {
                      value: row[prop],
                      automaticDropdown: true,
                      filterable: true,
                      defaultFirstOption: true
                    },
                    on: {
                      "visible-change": this.visibleChange,
                      change: val => (row[prop] = val)
                    }
                  }}
                >
                  {this.whTypeOptions.map(item => {
                    return (
                      <el-option
                        key={item.value}
                        title={item.lable}
                        value={item.value}
                      />
                    );
                  })}
                </el-select>
              );
            }
          }
        },
        {
          show: true,
          prop: "whCode",
          title: "仓库编号",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-input
                  value={row[prop]}
                  disabled
                  on-input={val => (row[prop] = val)}
                />
              );
            },
            skip: ({ row }) => !row.switch
          }
        },
        {
          show: true,
          prop: "whDesc",
          title: "仓库描述",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-input
                  value={row[prop]}
                  on-input={val => (row[prop] = val)}
                />
              );
            }
          }
        },
        {
          show: true,
          prop: "companyCode",
          title: "公司代码",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-select
                  {...{
                    attrs: {
                      value: row[prop],
                      automaticDropdown: true,
                      filterable: true,
                      defaultFirstOption: true
                    },
                    on: {
                      "visible-change": this.visibleChange,
                      change: val => (row[prop] = val)
                    }
                  }}
                >
                  {this.whCompany.map(item => {
                    return (
                      <el-option
                        key={item.value}
                        title={item.lable}
                        value={item.value}
                      />
                    );
                  })}
                </el-select>
              );
            }
          }
        },
        {
          show: true,
          prop: "remark",
          title: "备注说明",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-input
                  value={row[prop]}
                  on-input={val => (row[prop] = val)}
                />
              );
            }
          }
        },
        {
          show: true,
          prop: "grade",
          title: "优先级",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-input
                  value={row[prop]}
                  on-input={val => (row[prop] = val)}
                />
              );
            }
          }
        },
        {
          show: true,
          prop: "capacityManage",
          title: "启用库容管理",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-switch
                  value={row[prop]}
                  active-value="Y"
                  inactive-value="N"
                  on-change={val => (row[prop] = val)}
                />
              );
            }
          }
        },
        {
          show: true,
          prop: "batchManage",
          title: "启用批次管理",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-switch
                  value={row[prop]}
                  active-value="Y"
                  inactive-value="N"
                  on-change={val => (row[prop] = val)}
                />
              );
            }
          }
        },
        {
          show: true,
          prop: "startMedium",
          title: "启用容器管理",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-switch
                  value={row[prop]}
                  active-value="Y"
                  inactive-value="N"
                  on-change={val => (row[prop] = val)}
                />
              );
            }
          }
        },
        {
          show: true,
          prop: "shippingPoint",
          title: "装运点",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-select
                  {...{
                    attrs: {
                      value: row[prop],
                      automaticDropdown: true,
                      filterable: true,
                      defaultFirstOption: true
                    },
                    on: {
                      "visible-change": this.visibleChange,
                      change: val => (row[prop] = val)
                    }
                  }}
                >
                  {this.whLoadingPoint.map(item => {
                    return (
                      <el-option
                        key={item.value}
                        title={item.lable}
                        value={item.value}
                      />
                    );
                  })}
                </el-select>
              );
            }
          }
        },
        {
          show: true,
          prop: "pickPoint",
          title: "拣配点",
          edit: {
            render: (h, { prop, row }) => {
              return (
                <el-select
                  {...{
                    attrs: {
                      value: row[prop],
                      automaticDropdown: true,
                      filterable: true,
                      defaultFirstOption: true
                    },
                    on: {
                      "visible-change": this.visibleChange,
                      change: val => (row[prop] = val)
                    }
                  }}
                >
                  {this.whLoadingPoint.map(item => {
                    return (
                      <el-option
                        key={item.value}
                        title={item.lable}
                        value={item.value}
                      />
                    );
                  })}
                </el-select>
              );
            }
          }
        }
      ],
      whTypeOptions: [
        {
          label: "44",
          value: "3R"
        },
        {
          label: "赠品仓",
          value: "A001"
        },
        {
          label: "我问问",
          value: "www"
        }
      ],
      whCompany: [
        {
          label: "44",
          value: "444"
        },
        {
          label: "全棉",
          value: "A001"
        }
      ],
      whLoadingPoint: [
        {
          label: "sdfs",
          value: "wdadsdfs"
        }
      ],
      whPikingPoint: [
        {
          label: "拣配点",
          value: "1"
        }
      ],
      multipleSelection: []
    };
  },
  created() {
    this.getCodeList();
  },
  methods: {
    async getCodeList() {
      let codeList = (await this.$http.post("/whInfo/queryWhInfoList", {
        pageNum: 1,
        pageSize: 10
      })).data.list;
      this.data.splice(0, this.data.length, ...codeList);
    },
    visibleChange(val) {
      this.editStop = val;
    },
    addItem() {
      this.data.push({
        whType: "",
        whCode: "",
        whDesc: "",
        companyCode: "",
        grade: "",
        shippingPoint: "",
        remark: "",
        batchManage: "",
        startMedium: "",
        pickPoint: ""
      });
      this.$refs.table.focus(this.data.length - 1);
    },
    editColumnLastToNext({ placement, rowIndex }) {
      if (placement === "right") {
        this.data[rowIndex + 1] && this.$refs.table.focus(rowIndex + 1);
      }
    },
    focus() {
      this.$refs.table.focus(9);
    },
    summary({ colums, data }) {
      console.log(colums, data);
    },
    cellClassName({ column }) {
      if (column.prop == "whCode") return "gray";
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteItems() {
      console.log(this.multipleSelection);
      if (!this.data.length) return;
      if (!this.multipleSelection.length) {
        this.$message.error("请先选择要删除的数据！");
        return;
      }
      let filterList = this.data.filter(item => {
        return !this.multipleSelection.includes(item);
      });
      this.data.splice(0, this.data.length, ...filterList);
    }
  }
};
</script>
<style lang="scss" scoped>
.table-container {
  padding: 10px;
}
</style>