/*
 * Author: 17030360
 * Email:wdnybbz@163.com
 */

<template>
	<div v-if="searchData.length>0">
		<el-form :model="formInline" ref="formInline" :inline="true" class="demo-form-inline" >
			<el-form-item v-for="(item,index) in searchData" :key="index" :label="item.name" :prop="item.key" :rules="item.rules">
				<el-input style="width:132px" v-if="item.type==='input'" v-model="formInline[item.key]" :placeholder="item.placeholder"></el-input>
				<el-date-picker style="width:192px" v-if="item.type==='date'" v-model="formInline[item.key]" type="datetime" :placeholder="item.placeholder" align="right" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss">
				</el-date-picker>
				<el-date-picker v-if="item.type==='datetimerange'" v-model="formInline[item.key]" type='daterange' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
				</el-date-picker>
				<el-select style="width:132px" v-if="item.type==='select'" v-model="formInline[item.key]" :placeholder="item.placeholder">
					<el-option v-for="(item1,index1) in item.options" :key="index1" :label="item1" :value="item1">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">查询</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: 'SearchForm',
	props: {
		searchData: Array
	},
	data() {
		return {
			formInline: {},
			pickerOptions: {
				shortcuts: [
					{
						text: "今天",
						onClick(picker) {
							picker.$emit("pick", new Date());
						}
					},
					{
						text: "昨天",
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit("pick", date);
						}
					},
					{
						text: "一周前",
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit("pick", date);
						}
					}
				]
			}
		};
	},
	created() {
		this.onClear();
	},
	mounted() {},
	methods: {
		onSubmit() {
			let self = this;
			self.$refs["formInline"].validate(valid => {
				if (valid) {
					//	console.log("81----", this.formInline);
					self.$emit("handleSubmit", this.formInline);
				} else {
					return false;
				}
			});
		},
		onClear() {
			let obj = {};
			for (let index = 0; index < this.searchData.length; index++) {
				const element = this.searchData[index];
				obj[element.key] = "";
			}
			this.formInline = Object.assign({}, obj);
		}
	}
};
</script>

<style scoped>
.el-date-editor .el-range-separator {
	padding: 0 !important;
}
</style>
