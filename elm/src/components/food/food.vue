<template>
	<div>
		<transition name="move">
			<div class="food" v-show="showFlag" ref="food">
				<div>
					<div class="img-header">
						<img :src="food.image" />
						<i class="icon-arrow_lift" @click="hide"></i>
					</div>
					<div class="content">
						<h1 class="title">{{food.name}}</h1>
						<div class="detail">
							<span class="food-count">月售{{food.sellCount}}份</span>
							<span class="rating">好评率{{food.rating}}%</span>
						</div>
						<div class="price">
							<div class="now-price clearfix">
								<span class="icon-yuan fl">￥</span>
								<span class="num fl">{{food.price}}</span>
							</div>
							<div class="old-price clearfix" v-if="food.oldPrice">
								<span class="icon-yuan fl">￥</span>
								<span class="num fl">{{food.oldPrice}}</span>
							</div>
						</div>
						<transition name="fade">
							<div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count===0">加入购物车</div>
						</transition>
						<div class="cartcontrol-wrap">
							<cartcontrol :food="food"></cartcontrol>
						</div>
					</div>
					<div class="info" v-show="food.info">
						<h1 class="title">商品介绍</h1>
						<p class="txt">{{food.info}}</p>
					</div>
					<div class="ratings">
						<h1 class="title">商品评价</h1>
						<ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings" @selected="onselected" @content-toggle="ontoggle"></ratingselect>
						<div class="rating-wrap">
							<ul v-show="food.ratings && food.ratings.length">
								<li v-for="rate in food.ratings" class="rate-item">
									<div class="user">
										<span class="name">{{rate.username}}</span>
										<div class="avatar-box"><img :src="rate.avatar" /></div>
									</div>
									<div class="rate-time">{{rate.rateTime | formatDate}}</div>
									<p class="txt-wrap clearfix">
										<span class="fl" :class="{'icon-thumb_up':rate.rateType===0,'icon-thumb_down':rate.rateType===1}"></span>
										<span class="txt fl">{{rate.text}}</span>
									</p>
								</li>
							</ul>
							<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import Vue from 'vue'
	import BScroll from 'better-scroll'
	import {formatDate} from '../../common/js/date.js'
	import cartcontrol from '../cartcontrol/cartcontrol'
	import ratingselect from '../ratingselect/ratingselect'

	var positive = 0;
	var negative = 1;
	var all = 2;

	export default {
		components: {
			cartcontrol,
			ratingselect
		},
		props: {
			food: {
				type: Object
			}
		},
		data() {
			return {
				showFlag: false,
				selectType: all,
				onlyContent: true,
				desc: {
					all: "全部",
					positive: "推荐",
					negative: "吐槽"
				}
			}
		},
		filters: {
			formatDate(time) {
				var _date = new Date(time);
				return formatDate(_date, 'yyyy-MM-dd hh:mm')
			}
		},
		methods: {
			show() {
				this.showFlag = true;
				this.selectType = all;
				this.onlyContent = true;
				this.$nextTick(() => {
					if(!this.scroll) {
						this.scroll = new BScroll(this.$refs['food'], {
							click: true
						});
					} else {
						this.scroll.refresh();
					}
				})
			},
			hide() {
				this.showFlag = false
			},
			addFirst() {
				Vue.set(this.food, 'count', 1)
			},
			onselected(type) {
				this.selectType = type
			},
			ontoggle(content) {
				this.onlyContent = content;
			}
		}
	}
</script>

<style scoped>
	.food {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 2.048rem;
		z-index: 30;
		width: 100%;
		background: #f3f5f7;
		transition: all .3s linear;
		transform: translate3d(0, 0, 0);
	}
	
	.food.move-leave,
	.food.move-enter {
		transform: translate3d(100%, 0, 0);
	}
	
	.food.move-leave-active {
		transition: all .3s linear;
		transform: translate3d(100%, 0, 0);
	}
	
	.food .img-header {
		position: relative;
		width: 100%;
		padding-top: 100%;
		background: #fff;
	}
	
	.food .img-header img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}
	
	.food .img-header .icon-arrow_lift {
		position: absolute;
		top: 0.42667rem;
		left: 0.21333rem;
		z-index: 35;
		display: block;
		padding: 0.42667rem;
		font-size: 0.85333rem;
		color: #fff;
	}
	
	.food .content {
		position: relative;
		margin-bottom: 0.68267rem;
		padding: 0.768rem;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
		background: #fff;
	}
	
	.food .content .title {
		font-size: 0.59733rem;
		font-weight: 700;
		color: #07111b;
	}
	
	.food .content .detail {
		display: flex;
		margin: 0.34133rem 0 0.768rem;
		font-size: 0.42667rem;
		color: #93999f;
	}
	
	.food .content .detail .rating {
		display: inline-block;
		margin-left: 0.512rem;
	}
	
	.food .content .price {
		display: flex;
	}
	
	.food .content .now-price {
		color: #f01414;
	}
	
	.food .content .icon-yuan {
		font-size: 0.42667rem;
	}
	
	.food .content .num {
		font-size: 0.59733rem;
		font-weight: 700;
	}
	
	.food .content .old-price {
		margin-left: 0.512rem;
		color: #93999f;
		text-decoration: line-through;
	}
	
	.food .content .old-price .num,
	.food .content .old-price .icon-yuan {
		text-decoration: line-through;
	}
	
	.food .content .cartcontrol-wrap {
		position: absolute;
		right: 0.768rem;
		bottom: 0.64rem;
		z-index: 31;
		width: 3.2rem;
	}
	
	.food .content .buy {
		position: absolute;
		right: 0.768rem;
		bottom: 0.768rem;
		z-index: 32;
		width: 3.2rem;
		height: 1.06667rem;
		line-height: 1.06667rem;
		text-align: center;
		border-radius: 0.53333rem;
		font-size: 0.42667rem;
		color: #fff;
		background: #00a0dc;
		opacity: 1;
		transition: all .3s;
	}
	
	.food .content .buy.fade-leave,
	.food .content .buy.fade-enter {
		opacity: 0;
	}
	
	.food .content .buy.move-leave-active {
		opacity: 0;
		transition: all .3s;
	}
	
	.food .info {
		padding: 0.768rem;
		border-top: 1px solid rgba(7, 17, 27, 0.1);
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
		background: #fff;
	}
	
	.food .info .title {
		font-size: 0.59733rem;
		color: #07111b;
	}
	
	.food .info .txt {
		padding: 0 0.34133rem;
		font-size: 0.512rem;
		font-weight: 200;
		line-height: 1.024rem;
		color: #4d555d;
	}
	
	.food .ratings {
		padding: 0.768rem 0;
		border-top: 1px solid rgba(7, 17, 27, 0.1);
		background: #fff;
	}
	
	.food .ratings .title {
		margin-left: 0.768rem;
		font-size: 0.59733rem;
		color: #07111b;
	}
	
	.rating-wrap {
		padding: 0 0.768rem;
	}
	
	.rating-wrap .rate-item {
		position: relative;
		padding: 0.68267rem 0;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	}
	
	.rating-wrap .rate-item:last-child {
		border-bottom: none;
	}
	
	.rating-wrap .rate-item .user {
		display: flex;
		justify-content: flex-end;
		position: absolute;
		right: 0;
		top: 0.68267rem;
	}
	
	.rating-wrap .rate-item .user .name {
		font-size: 0.42667rem;
		color: #93999f;
	}
	
	.rating-wrap .rate-item .user .avatar-box {
		margin-left: .256rem;
		width: 0.512rem;
		height: 0.512rem;
		border-radius: 50%;
		overflow: hidden;
	}
	
	.rating-wrap .rate-item .user .avatar-box img {
		float: left;
		width: 100%;
	}
	
	.rating-wrap .rate-item .rate-time {
		margin-bottom: 0.256rem;
		font-size: 0.42667rem;
		color: #93999f;
	}
	
	.rating-wrap .rate-item .txt {
		display: inline-block;
		margin-left: 0.17067rem;
		font-size: 0.512rem;
		color: #07111b;
	}
	
	.rating-wrap .rate-item .icon-thumb_up {
		font-size: 0.512rem;
		color: #00a0dc;
	}
	
	.rating-wrap .rate-item .icon-thumb_down {
		font-size: 0.512rem;
		color: #93999f;
	}
	
	.rating-wrap .no-rating {
		padding: 0.68267rem 0;
		text-align: center;
		font-size: 0.512rem;
		color: #93999f;
	}
</style>