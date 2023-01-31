<template>
    <div class="add-polyline">
        <el-tabs type="border-card" stretch>
            <el-tab-pane label="编辑属性">
                <div class="content">
                    <el-row class="attribute">
                        <el-col :span="12">
                            <span>宽度 </span>
                            <el-input-number
                                :min="0"
                                :max="10"
                                :step="0.1"
                                size="small"
                                controls-position="right"
                            />
                        </el-col>
                        <el-col :span="12">
                            <span>高度 </span>
                            <el-input-number
                                v-model="pointHeight"
                                :min="0"
                                :max="10"
                                :step="0.1"
                                size="small"
                                controls-position="right"
                            />
                        </el-col>
                    </el-row>
                    <el-row class="attribute">
                        <el-col :span="12">
                            <span>颜色 </span>
                            <el-input-number
                                v-model="pointHeight"
                                :min="0"
                                :max="10"
                                :step="0.1"
                                size="small"
                                controls-position="right"
                            />
                        </el-col>
                        <el-col :span="12">
                            <span>长度 </span>
                            <el-input-number
                                v-model="pointHeight"
                                :min="0"
                                :max="10"
                                :step="0.1"
                                size="small"
                                controls-position="right"
                            />
                        </el-col>
                    </el-row>
                </div>
                <div class="input">
                    <el-row class="title">
                        <el-col :span="12"><el-button size="small" @click="open">选择图片</el-button></el-col>
                        <el-col :span="12"><span>说明</span></el-col>
                    </el-row>
                    <el-row >
                        <el-col :span="12">
                            <img v-if="objectURL" style="width: 200px; height: 100px;padding: 5px;" :src="objectURL" fit="cover" />
                            <el-image v-else style="width: 200px; height: 160px;padding: 5px;" />
                        </el-col>
                        <el-col :span="12">
                            <el-input
                                v-model="textarea"
                                :rows="7"
                                type="textarea"
                                placeholder="请输入文字描述"
                                style="padding:3px"
                            />
                        </el-col>
                  </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="数据列表">

            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'addPolyline',
  setup () {

  }
})
</script>

<style scoped lang="scss">
.add-polyline{
  padding: 10px;
  width: 455px;
  height: 380px;
  position: absolute;
  top: 5px;
  right: 5px;
  background-color:#fff;
  z-index: 999;
  .title{
    text-align: center;
    .el-col {
        display: flex;
        justify-content:center;
        align-items:center;
        min-height: 36px;
    }
  }
  .content{
    height: 75px;
    text-align: center;
    // background-color: red;
    .attribute{
        margin-bottom: 15px;
        display: flex;
        justify-content:center;
        align-items:center;
    }
  }

}
</style>
