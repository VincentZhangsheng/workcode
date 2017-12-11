<template>
	<div class="goods">
		<div class="menu-wrap" ref="menu-wrap">
			<ul class="menu-box">
				<li class="menu-item" v-for="(item, index) in goods" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
					<span class="txt">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span> {{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="goods-wrap" ref="goods-wrap">
			<ul>
				<li class="good-list good-list-hook" v-for="(item, index) in goods">
					<h3 class="title">{{item.name}}</h3>
					<ul class="good-box">
						<li class="good-item" v-for="(item, index) in item.foods" @click="selectFood(item,$event)">
							<div class="img-box">
								<img :src="item.icon" />
							</div>
							<div class="content">
								<h3 class="name">{{item.name}}</h3>
								<p class="desc">{{item.description}}</p>
								<p class="extra">
									<span class="sellcount">月售{{item.sellCount}}</span>
									<span class="rating">好评率{{item.rating}}</span>
								</p>
								<p class="price">
									<span class="now-price">￥{{item.price}}</span>
									<span class="old-price" v-show="item.oldPrice">{{item.oldPrice}}</span>
								</p>
								<div class="cartcontrol-wrap">
									<cartcontrol :food="item"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"></shopcart>
		<food :food="selectedFood" ref="food"></food>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import shopcart from '../shopcart/shopcart'
	import cartcontrol from '../cartcontrol/cartcontrol'
	import food from '../food/food'

	const err_ok = 0;

	export default {
		components: {
			shopcart,
			cartcontrol,
			food
		},
		props: ['seller'],
		data() {
			return {
				goods: [],
				listHeight: [],
				scrollY: 0,
				selectedFood: {}
			}
		},
		computed: {
			currentIndex() {
				for(let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i]
					let height2 = this.listHeight[i + 1]
					if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i;
					}
				}
				return 0
			},
			selectFoods() {
				var foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if(food.count) {
							foods.push(food)
						}
					})
				})
				return foods;
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
			this.$axios.get('/api/goods').then((response) => {
				response = response.data;
				if(response.errno === err_ok) {
					this.goods = response.data;
					this.$nextTick(() => {
						this._initScroll();
						this._calculateHeight();
					})
				}
			}).catch((error) => {
				console.log(error);
			})
		},
		methods: {
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs['menu-wrap'], {
					click: true
				});
				this.foodsScroll = new BScroll(this.$refs['goods-wrap'], {
					click: true,
					probeType: 3
				});
				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y))
				})
			},
			_calculateHeight() {
				var height = 0;
				var foodlist = this.$refs['goods-wrap'].getElementsByClassName('good-list-hook');
				this.listHeight.push(height);
				for(var i = 0; i < foodlist.length; i++) {
					var item = foodlist[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			},
			selectMenu: function(index, event) {
				let foodlist = this.$refs['goods-wrap'].getElementsByClassName('good-list-hook');
				let el = foodlist[index]
				this.foodsScroll.scrollToElement(el, 300)
			},
			selectFood(food,event) {
				this.selectedFood = food
				this.$refs['food'].show();
			}
		}
	}
</script>

<style>
	.goods {
		display: flex;
		position: absolute;
		top: 7.424rem;
		bottom: 1.96267rem;
		width: 100%;
		overflow: hidden;
	}
	
	.goods .menu-wrap {
		flex: 0 0 3.41333rem;
		width: 3.41333rem;
		height: 100%;
		background: #f3f5f7;
		/*overflow: auto;*/
	}
	
	.goods .menu-wrap .menu-item {
		display: table;
		padding: 0 0.512rem;
		height: 2.304rem;
		line-height: 0.59733rem;
	}
	
	.goods .menu-wrap .menu-item.current {
		position: relative;
		margin-top: -1px;
		background: #fff;
		font-weight: 700;
	}
	
	.goods .menu-wrap .menu-item.current .txt {
		border-bottom: none;
	}
	
	.goods .menu-wrap .menu-item .txt {
		display: table-cell;
		border-bottom: 1px solid rgba(7, 17, 27, 0.2);
		width: 2.38933rem;
		vertical-align: middle;
		font-size: 0.512rem;
		/*text-align: center;*/
	}
	
	.goods .menu-wrap .menu-item .icon {
		display: inline-block;
		width: 0.512rem;
		height: 0.512rem;
		margin-right: 0.17067rem;
		background-size: 100% 100%;
	}
	
	.goods .menu-wrap .menu-item .icon.decrease {
		background: url(../../assets/decrease3.png) no-repeat left top;
	}
	
	.goods .menu-wrap .menu-item .icon.discount {
		background: url(../../assets/discount3.png) no-repeat left top;
	}
	
	.goods .menu-wrap .menu-item .icon.guarantee {
		background: url(../../assets/guarantee3.png) no-repeat left top;
	}
	
	.goods .menu-wrap .menu-item .icon.invoice {
		background: url(../../assets/invoice3.png) no-repeat left top;
	}
	
	.goods .menu-wrap .menu-item .icon.special {
		background: url(../../assets/special3.png) no-repeat left top;
	}
	
	.goods .goods-wrap {
		flex: 1;
		background: #fff;
		/*overflow: auto;*/
	}
	
	.goods .goods-wrap .title {
		padding-left: 0.59733rem;
		height: 1.10933rem;
		line-height: 1.10933rem;
		border-left: 2px solid #d9dde1;
		font-size: 0.512rem;
		color: #93999f;
		background: #f3f5f7;
	}
	
	.goods .goods-wrap .good-box {
		padding: 0 0.768rem;
	}
	
	.goods .goods-wrap .good-item {
		display: flex;
		padding: 0.768rem 0;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	}
	
	.goods .goods-wrap .good-item:last-child {
		border-bottom: none;
	}
	
	.goods .goods-wrap .img-box {
		margin-right: 0.42667rem;
		width: 2.45333rem;
		height: 2.45333rem;
		overflow: hidden;
	}
	
	.goods .goods-wrap .img-box img {
		width: 100%;
	}
	
	.goods .goods-wrap .content {
		flex: 1;
		position: relative;
		padding: 0.08533rem 0;
	}
	
	.goods .goods-wrap .content .name {
		font-size: 0.59733rem;
		color: #07111b;
	}
	
	.goods .goods-wrap .content .desc {
		margin: 0.34133rem 0;
		font-size: 0.42667rem;
		color: #93999f;
	}
	
	.goods .goods-wrap .content .extra {
		font-size: 0.42667rem;
		color: #93999f;
	}
	
	.goods .goods-wrap .content .extra .sellcount {
		display: inline-block;
		margin-right: 0.512rem;
	}
	
	.goods .goods-wrap .content .now-price {
		display: inline-block;
		margin-right: 0.34133rem;
		font-size: 0.59733rem;
		font-weight: 700;
		line-height: 1.024rem;
		color: #f01414;
	}
	
	.goods .goods-wrap .content .old-price {
		text-decoration: line-through;
		font-size: 0.42667rem;
		line-height: 1.024rem;
		color: #93999f;
	}
	
	.goods .goods-wrap .content .cartcontrol-wrap {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 3.2rem;
	}
</style>