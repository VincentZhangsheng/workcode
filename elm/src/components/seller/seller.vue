<template>
	<div>
		<div class="seller" ref="seller-wrap">
			<div class="seller-content">
				<div class="overview">
					<h1 class="title">{{seller.name}}</h1>
					<div class="favorite" @click="toggleFavorite">
						<span class="icon-favorite" :class="{active:favorite}"></span>
						<p class="txt" v-html="favorite ? '已收藏':'收藏'"></p>
					</div>
					<div class="desc clearfix">
						<div class="star-box fl">
							<vueStar :size="36" :score="seller.score"></vueStar>
						</div>
						<span class="fl txt1">({{seller.ratingCount}})</span>
						<span class="fl txt">月售{{seller.sellCount}}单</span>
					</div>
					<ul class="remark">
						<li class="block">
							<h2 class="block-tit">起送价</h2>
							<div class="block-content">
								<span class="num">{{seller.minPrice}}</span>
								<span class="yuan">元</span>
							</div>
						</li>
						<li class="block">
							<h2 class="block-tit">商家配送</h2>
							<div class="block-content">
								<span class="num">{{seller.deliveryPrice}}</span>
								<span class="yuan">元</span>
							</div>
						</li>
						<li class="block">
							<h2 class="block-tit">平均配送时间</h2>
							<div class="block-content">
								<span class="num">{{seller.deliveryTime}}</span>
								<span class="yuan">分钟</span>
							</div>
						</li>
					</ul>
				</div>
				<div class="bulletin">
					<h1 class="title">公告与活动</h1>
					<div class="bull-txt">{{seller.bulletin}}</div>
					<ul v-if="seller.supports" class="supports">
						<li class="support-item" v-for="(item, index) in seller.supports">
							<span class="icon" :class="classMap[seller.supports[index].type]"></span>
							<span class="txt">{{seller.supports[index].description}}</span>
						</li>
					</ul>
				</div>
				<div class="pics">
					<div class="title">商家实景</div>
					<div class="pic-wrap" ref="pic-wrap">
						<ul class="pic-list clearfix" ref="pic-list">
							<li class="pic-item fl" v-for="pic in seller.pics">
								<img :src="pic" />
							</li>
						</ul>
					</div>
					<!--<swiper :options="swiperOption" ref="mySwiper">
						<swiper-slide class="pic-item" v-for="pic in seller.pics">
							<img :src="pic" />
						</swiper-slide>
					</swiper>-->
				</div>
				<div class="infos">
					<div class="title">商家信息</div>
					<ul class="info-wrap">
						<li class="info-item" v-for="item in seller.infos">{{item}}</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import vueStar from '../star/star'
	import {saveToLocal,loadFromLocal} from '../../common/js/store.js'

	export default {
		props: ['seller'],
		components: {
			vueStar
		},
		data() {
			return {
				favorite: (() => {
					return loadFromLocal(this.seller.id,'favorite',false);
				})(),
				swiperOption: {
					slidesPerView: 2.8,
					spaceBetween: 0,
				}
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
		},
		mounted() {
			this.$nextTick(() => {
				if(!this.scroll) {
					this.scroll = new BScroll(this.$refs['seller-wrap'], {
						click: true
					});
				} else {
					this.scroll.refresh();
				}
				
				if(this.seller.pics) {
					var pic_w = 240;
					var margin = 12;
					var ul_w = (pic_w + margin) * this.seller.pics.length - margin;
					this.$refs['pic-list'].style.width = ul_w + 'px';
					this.$nextTick(() => {
						if(!this.picScroll) {
							this.picScroll = new BScroll(this.$refs['pic-wrap'],{
								scrollX: true,
								evenPassthrough: 'vertical'
							})
						} else {
							this.picScroll.refresh();
						}
					})
				}
			})
		},
		watch: {
			'seller'() {
				this._initPic();
			}
		},
		methods: {
			toggleFavorite() {
				this.favorite = !this.favorite;
				saveToLocal(this.seller.id,'favorite',this.favorite);
			},
			_initPic() {}
		}
	}
</script>

<style>
	.seller {
		position: absolute;
		top: 7.424rem;
		bottom: 0;
		width: 100%;
		overflow: hidden;
		background: #f3f5f7;
	}
	
	.seller .overview {
		position: relative;
		margin-bottom: 0.768rem;
		padding: 0.768rem 0;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
		background: #fff;
	}
	
	.seller .overview .title {
		margin: 0 0.768rem;
		font-size: 0.59733rem;
		color: #07111b;
	}
	
	.seller .overview .favorite {
		position: absolute;
		top: 0.768rem;
		right: 0.768rem;
		width: 1.28rem;
		text-align: center;
	}
	
	.seller .overview .favorite .icon-favorite {
		font-size: 1.024rem;
		color: #d4d6d9;
	}
	
	.seller .overview .favorite .icon-favorite.active {
		color: #f01414;
	}
	
	.seller .overview .favorite .txt {
		margin-top: 0.17067rem;
		font-size: 0.42667rem;
		color: #4d555d;
	}
	
	.seller .overview .desc {
		margin: 0.34133rem 0.768rem 0;
		padding-bottom: 0.512rem;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	}
	
	.seller .overview .desc .txt1,
	.seller .overview .desc .txt {
		line-height: 0.768rem;
		font-size: 0.42667rem;
		color: #4d555d;
	}
	
	.seller .overview .desc .txt1 {
		margin: 0 0.512rem 0 0.34133rem;
	}
	
	.seller .overview .star-box {
		width: 4.26667rem;
	}
	
	.seller .remark {
		display: flex;
		padding-top: 0.768rem;
	}
	
	.seller .remark .block {
		flex: 1;
		border-right: 1px solid rgba(7, 17, 27, 0.1);
		text-align: center;
	}
	
	.seller .remark .block:last-child {
		border-right: none;
	}
	
	.seller .remark .block-tit {
		margin-bottom: 0.17067rem;
		font-size: 20px;
		color: #93999f;
	}
	
	.seller .remark .block-content {
		font-size: 0;
	}
	
	.seller .remark .num {
		font-size: 1.024rem;
		color: #07111b;
	}
	
	.seller .remark .yuan {
		font-size: 0.42667rem;
	}
	
	.bulletin {
		margin-bottom: 0.768rem;
		padding: 0.768rem;
		padding-bottom: 0;
		border-top: 1px solid rgba(7, 17, 27, 0.1);
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
		background: #fff;
	}
	
	.bulletin .title {
		margin-bottom: 0.34133rem;
		font-size: 0.59733rem;
		color: #07111b;
	}
	
	.bulletin .bull-txt {
		padding: 0 0.512rem 0.68267rem;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
		line-height: 1.024rem;
		font-size: 0.512rem;
		font-weight: 200;
		color: #c81414;
	}
	
	.bulletin .supports .icon {
		display: inline-block;
		width: 0.512rem;
		height: 0.512rem;
		margin-right: 0.17067rem;
		background-size: 100%;
	}
	
	.bulletin .supports .icon.decrease {
		background: url(../../assets/decrease1.png) no-repeat left top;
	}
	
	.bulletin .supports .icon.discount {
		background: url(../../assets/discount1.png) no-repeat left top;
	}
	
	.bulletin .supports .icon.guarantee {
		background: url(../../assets/guarantee1.png) no-repeat left top;
	}
	
	.bulletin .supports .icon.invoice {
		background: url(../../assets/invoice1.png) no-repeat left top;
	}
	
	.bulletin .supports .icon.special {
		background: url(../../assets/special1.png) no-repeat left top;
	}
	
	.bulletin .supports .support-item {
		padding: 0.68267rem 0.512rem;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	}
	
	.bulletin .supports .support-item:last-child {
		border-bottom: none;
	}
	
	.bulletin .supports .support-item .txt {
		line-height: 0.68267rem;
		font-size: 0.512rem;
		font-weight: 200;
		color: #07111b;
	}
	
	.pics {
		margin-bottom: 0.768rem;
		padding: 0.768rem 0 0.768rem 0.768rem;
		border-top: 1px solid rgba(7, 17, 27, 0.1);
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
		background: #fff;
	}
	
	.swiper-container{
		height: 3.84rem;
		overflow: hidden;
	}
	
	.pics .title {
		margin-bottom: 0.34133rem;
		font-size: 0.59733rem;
		color: #07111b;
	}
	
	.pics .pic-wrap {
		width: 100%;
		height: 3.84rem;
		overflow: hidden;
		white-space: nowrap;
	}
	
	/*.pics .pic-list {
		width: auto;
		overflow-x: scroll;
	}*/
	
	.pics .pic-wrap .pic-item {
		margin-right: 0.256rem;
		width: 5.12rem;
		height: 3.84rem;
		overflow: hidden;
	}
	
	.pics .pic-wrap .pic-item:last-child {
		margin-right: 0;
	}
	
	.pics .pic-wrap .pic-item img {
		width: 100%;
	}
	
	.infos {
		padding: 0.768rem 0.768rem 0;
		border-top: 1px solid rgba(7, 17, 27, 0.1);
		background: #fff;
	}
	
	.infos .title {
		padding-bottom: 0.34133rem;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
		font-size: 0.59733rem;
		color: #07111b;
	}
	
	.infos .info-item {
		padding: 0.68267rem 0.512rem;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
		line-height: 0.68267rem;
		font-size: 0.512rem;
		font-weight: 200;
		color: #07111b;
	}
	
	.infos .info-item:last-child {
		border-bottom: none;
	}
</style>