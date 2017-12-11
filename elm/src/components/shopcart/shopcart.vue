<template>
	<div>
		<div class="shopcart">
			<div class="content" @click="toggleList">
				<div class="content-left clearfix">
					<div class="logo-wrap">
						<div class="logo" :class="{'highlight':totalCount>0}">
							<span class="icon icon-shopping_cart"></span>
						</div>
						<span class="num" v-show="totalCount>0">{{totalCount}}</span>
					</div>
					<div class="price-wrap fl" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
					<div class="desc-wrap fl">另需配送费￥{{deliveryPrice}}元</div>
				</div>
				<div class="content-right" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
			</div>
			<transition name="fold">
				<div class="shopcart-list" v-show="listShow">
					<div class="list-header">
						<h1 class="title">购物车</h1>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="list-content" ref="list-content">
						<ul>
							<li class="food-list" v-for="(food, index) in selectFoods">
								<span class="name">{{food.name}}</span>
								<div class="price clearfix">
									<span class="icon-yuan fl">￥</span>
									<span class="num fl">{{food.price*food.count}}</span>
								</div>
								<div class="cartcontrol-wrap">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name="fade">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import cartcontrol from '../cartcontrol/cartcontrol'

	export default {
		components: {
			cartcontrol
		},
		props: {
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			},
			selectFoods: {
				type: Array,
				default() {
					return []
				}
			}
		},
		data() {
			return {
				fold: true
			}
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count
				})
				return total;
			},
			totalCount() {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count
				})
				return count;
			},
			payDesc() {
				if(this.totalPrice === 0) {
					return `￥${this.minPrice}起送`;
				} else if(this.totalPrice < this.minPrice) {
					var diff = this.minPrice - this.totalPrice
					return `还差￥${diff}元起送`
				} else {
					return '去结算';
				}
			},
			payClass() {
				if(this.totalPrice < this.minPrice) {
					return 'not-enough'
				} else {
					return 'enough'
				}
			},
			listShow() {
				if(!this.totalCount) {
					this.fold = true;
					return false;
				}
				var show = !this.fold;
				if(show) {
					this.$nextTick(() => {
						if(!this.scroll) {
							this.scroll = new BScroll(this.$refs['list-content'], {
								click: true
							});
						} else {
							this.scroll.refresh();
						}
					})
				}
				return show;
			}
		},
		methods: {
			toggleList() {
				if(!this.totalCount) {
					return;
				}
				this.fold = !this.fold;
			},
			empty() {
				this.selectFoods.forEach((food) => {
					food.count = 0;
				})
			},
			hideList() {
				this.fold = true;
			},
			pay() {
				if(this.totalPrice < this.minPrice) {
					return;
				}
				window.alert(`需要支付￥${this.totalPrice}元`)
			}
		}
	}
</script>

<style>
	.shopcart {
		display: flex;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 99;
		width: 100%;
		height: 2.048rem;
	}
	
	.shopcart .content {
		display: flex;
		position: relative;
		z-index: 99;
		width: 100%;
		background: #141d27;
	}
	
	.shopcart .content .content-left {
		flex: 1;
		position: relative;
		padding-left: 3.41333rem;
		background: #141d27;
	}
	
	.shopcart .content .content-right {
		width: 4.48rem;
		background: #2b333b;
	}
	
	.shopcart .content .content-left .logo-wrap {
		position: absolute;
		left: 0.512rem;
		bottom: 0.08533rem;
		border-radius: 50%;
		width: 2.38933rem;
		height: 2.38933rem;
		background: #141d27;
	}
	
	.shopcart .content .content-left .logo {
		margin: 0.256rem auto;
		width: 1.87733rem;
		height: 1.87733rem;
		text-align: center;
		line-height: 1.87733rem;
		border-radius: 50%;
		background: #252e36;
	}
	
	.shopcart .content .content-left .logo.highlight {
		background: #00a0dc;
	}
	
	.shopcart .content .content-left .icon {
		font-size: 1.024rem;
		color: rgba(255, 255, 255, .4);
	}
	
	.shopcart .content .content-left .logo.highlight .icon {
		color: #fff;
	}
	
	.shopcart .content .content-left .num {
		display: block;
		position: absolute;
		top: 0;
		right: -0.128rem;
		z-index: 199;
		width: 1.06667rem;
		height: 0.64rem;
		text-align: center;
		line-height: 0.64rem;
		border-radius: 0.32rem;
		font-size: 0.42667rem;
		color: #fff;
		background: #ed171f;
	}
	
	.shopcart .content .content-left .price-wrap {
		margin: 0.512rem 0.512rem 0 0;
		padding-right: 0.512rem;
		border-right: 1px solid rgba(255, 255, 255, 0.1);
		height: 1.024rem;
		line-height: 1.024rem;
		font-size: 0.68267rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.4);
	}
	
	.shopcart .content .content-left .price-wrap.highlight {
		color: #fff;
	}
	
	.shopcart .content .content-left .desc-wrap {
		margin-top: 0.512rem;
		height: 1.024rem;
		line-height: 1.024rem;
		font-size: 0.42667rem;
		color: rgba(255, 255, 255, 0.4);
	}
	
	.shopcart .content .content-right {
		width: 4.48rem;
		text-align: center;
		line-height: 2.048rem;
		font-size: 0.512rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.4);
		background: #2b333b;
	}
	
	.shopcart .content .content-right.enough {
		color: #fff;
		background: #00b43c;
	}
	
	.shopcart-list {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 9;
		width: 100%;
		transition: all .5s;
		transform: translate3d(0, -100%, 0);
	}
	
	.shopcart-list.fold-leave,
	.shopcart-list.fold-enter {
		transform: translate3d(0, 0, 0);
	}
	
	.shopcart-list.fold-leave-active {
		transition: all .5s;
		transform: translate3d(0, 0, 0);
	}
	
	.shopcart-list .list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 1.70667rem;
		border-bottom: 2px solid rgba(7, 17, 27, 0.1);
		background: #F3F5F7;
	}
	
	.shopcart-list .list-header .title {
		padding-left: 0.74667rem;
		font-size: 0.59733rem;
		color: #07111b;
	}
	
	.shopcart-list .list-header .empty {
		display: block;
		height: 100%;
		line-height: 1.70667rem;
		padding: 0 0.74667rem;
		font-size: 0.512rem;
		color: #00a0dc;
	}
	
	.shopcart-list .list-content {
		padding: 0 0.74667rem;
		max-height: 11.30667rem;
		background: #fff;
		overflow: hidden;
	}
	
	.shopcart-list .list-content .food-list {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 2.048rem;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	}
	
	.shopcart-list .list-content .food-list .name {
		width: 9.70667rem;
		font-size: 0.59733rem;
		color: #07111b;
	}
	
	.shopcart-list .list-content .food-list .price {
		width: 1.6rem;
		color: #f01414;
	}
	
	.shopcart-list .list-content .food-list .price .icon-yuan {
		font-size: 0.42667rem;
	}
	
	.shopcart-list .list-content .food-list .price .num {
		font-size: 0.59733rem;
		font-weight: 700;
	}
	
	.list-mask {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 50;
		width: 100%;
		height: 100%;
		background: rgba(7, 17, 27, 0.6);
		opacity: 1;
		transition: all .5s;
	}
	
	.list-mask.fade-leave,
	.list-mask.fade-enter {
		opacity: 0;
	}
	
	.list-mask.fade-leave-active {
		transition: all .5s;
	}
</style>