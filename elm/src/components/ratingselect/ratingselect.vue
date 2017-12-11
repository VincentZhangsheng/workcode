<template>
	<div>
		<div class="rating-type">
			<span class="item positive" :class="{'active':sectype===2}" @click="select(2,$event)">
				{{desc.all}}<span class="count">{{ratings.length}}</span>
			</span>
			<span class="item positive" :class="{'active':sectype===0}" @click="select(0,$event)">
				{{desc.positive}}<span class="count">{{positives.length}}</span>
			</span>
			<span class="item negative" :class="{'active':sectype===1}" @click="select(1,$event)">
				{{desc.negative}}<span class="count">{{nagetives.length}}</span>
			</span>
		</div>
		<div class="switch" :class="{'on':seconly}" @click="toggleContent">
			<span class="icon icon-check_circle"></span>
			<span class="txt">只看有内容的评价</span>
		</div>
	</div>
</template>

<script>
	var positive = 0;
	var negative = 1;
	var all = 2;

	export default {
		props: {
			ratings: {
				type: Array,
				default() {
					return []
				}
			},
			selectType: {
				type: Number,
				default: all
			},
			onlyContent: {
				type: Boolean,
				default: true
			},
			desc: {
				type: Object,
				default() {
					return {
						all: "全部",
						positive: "满意",
						negative: "不满意"
					}
				}
			}
		},
		data() {
			return {
				secrate:[],
				sectype:0,
				seconly: true,
				secdesc: {}
			}
		},
		created() {
			this.secrate = this.ratings
			this.sectype = this.selectType
			this.seconly = this.onlyConten
			this.secdesc = this.desc
		},
		computed: {
			positives() {
				return this.ratings.filter((rating) => {
					return rating.rateType == positive
				})
			},
			nagetives() {
				return this.ratings.filter((rating) => {
					return rating.rateType == negative
				})
			}
		},
		methods: {
			select(type,event) {
				this.sectype = type;
				this.$emit('selected',type)
			}, 
			toggleContent(event) {
				this.seconly = !this.seconly
				this.$emit('content-toggle',this.seconly)
			}
		}
	}
</script>

<style scoped>
	.rating-type {
		display: flex;
		margin: 0 0.768rem;
		padding: 0.768rem 0;
		width: 100%;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	}
	
	.rating-type .item {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 0.34133rem;
		width: 2.56rem;
		height: 1.28rem;
		border-radius: 2px;
		font-size: 0.512rem;
		color: rgb(77, 85, 93);
	}
	
	.rating-type .item .count {
		font-size: 0.384rem;
		margin: 0.128rem 0 0 0.10667rem;
	}
	
	.rating-type .positive {
		background: rgba(0, 160, 220, 0.2);
	}
	
	.rating-type .positive.active {
		background: #00a0dc;
		color: #fff;
	}
	
	.rating-type .negative {
		background: rgba(77, 85, 93, 0.2);
	}
	
	.rating-type .negative.active {
		color: #fff;
		background: rgb(77, 85, 93);
	}
	
	.switch {
		display: flex;
		padding: 0.512rem 0.768rem;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
		color: rgb(147,153,159);
	}
	
	.switch .icon {
		font-size: 1.024rem;
	}
	
	.switch.on .icon{
		color: #00b43c;
	}
	
	.switch .txt {
		display: inline-block;
		margin-left: 0.17067rem;
		font-size: 0.512rem;
		line-height: 1.024rem;
	}
</style>