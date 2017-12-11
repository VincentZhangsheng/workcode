<template>
	<div>
		<div class="ratings-wrap" ref="rate-wrap">
			<div class="ratings-content">
				<div class="overview">
					<div class="overview-left">
						<p class="score">{{seller.score}}</p>
						<p class="title">综合评分</p>
						<p class="rank">高于周边商家{{seller.rankRate}}</p>
					</div>
					<div class="overview-right">
						<div class="score-wrap">
							<div class="title">服务态度</div>
							<div class="star-wrap">
								<vueStar :size="36" :score="seller.serviceScore"></vueStar>
							</div>
							<div class="score">{{seller.serviceScore}}</div>
						</div>
						<div class="score-wrap">
							<div class="title">商品评分</div>
							<div class="star-wrap">
								<vueStar :size="36" :score="seller.foodScore"></vueStar>
							</div>
							<div class="score">{{seller.foodScore}}</div>
						</div>
						<div class="delivery-wrap">
							<div class="title">送达时间</div>
							<div class="delivery">{{seller.deliveryTime}}分钟</div>
						</div>
					</div>
				</div>
				<div class="rate-detail">
					<ratingselect :select-type="selectType" :only-content="onlyContent" :ratings="ratings" @selected="onselected" @content-toggle="ontoggle"></ratingselect>
					<ul class="ratings">
						<li v-for="rate in ratings" class="rate-item">
							<div class="avatar">
								<img :src="rate.avatar" />
							</div>
							<div class="content">
								<p class="name">{{rate.username}}</p>
								<div class="star-wrap clearfix">
									<div class="star-box fl">
										<vueStar :size="24" :score="rate.score"></vueStar>
									</div>
									<span class="fl delivery" v-show="rate.deliveryTime">{{rate.deliveryTime}}分钟送达</span>
								</div>
								<p class="txt">{{rate.text}}</p>
								<div class="recommend clearfix" v-show="rate.recommend && rate.recommend.length">
									<span class="fl icon-thumb_up"></span>
									<span v-for="item in rate.recommend" class="fl item">{{item}}</span>
								</div>
							</div>
							<div class="rate-time">{{rate.rateTime | formatDate}}</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import vueStar from '../star/star'
	import ratingselect from '../ratingselect/ratingselect'
	import { formatDate } from '../../common/js/date.js'

	var positive = 0;
	var negative = 1;
	var all = 2;
	var err_ok = 0;

	export default {
		props: ['seller'],
		components: {
			vueStar,
			ratingselect
		},
		data() {
			return {
				ratings: [],
				selectType: all,
				onlyContent: true
			}
		},
		created() {
			this.$axios.get('/api/ratings').then((response) => {
				response = response.data;
				if(response.errno === err_ok) {
					this.ratings = response.data;
					this.$nextTick(() => {
						this._initScroll();
					})
				}
			}).catch((error) => {
				console.log(error);
			})
		},
		filters: {
			formatDate(time) {
				var _date = new Date(time);
				return formatDate(_date, 'yyyy-MM-dd hh:mm')
			}
		},
		methods: {
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs['rate-wrap'], {
					click: true
				});
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
	.ratings-wrap {
		position: absolute;
		top: 7.424rem;
		bottom: 0;
		width: 100%;
		overflow: hidden;
		background: #f3f5f7;
	}
	
	.overview {
		display: flex;
		margin-bottom: 0.768rem;
		padding: 0.768rem 0;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
		background: #fff;
	}
	
	.overview .overview-left {
		padding: 0.256rem 0;
		border-right: 1px solid rgba(7, 17, 27, 0.1);
		width: 5.86667rem;
		text-align: center;
	}
	
	.overview .overview-left .score {
		font-size: 1.024rem;
		color: #ff9900;
	}
	
	.overview .overview-left .title {
		margin: 0.256rem 0 0.34133rem;
		font-size: 0.512rem;
		color: #07111b;
	}
	
	.overview .overview-left .rank {
		font-size: 0.42667rem;
		color: #93999f;
	}
	
	.overview .overview-right {
		flex: 1;
		padding-left: 1.024rem;
		padding-top: 0.256rem;
	}
	
	.overview .overview-right .score-wrap {
		display: flex;
		margin-bottom: 0.34133rem;
	}
	
	.overview .overview-right .delivery-wrap {
		display: flex;
	}
	
	.overview .overview-right .title {
		margin-right: 0.512rem;
		font-size: 0.512rem;
		line-height: 0.768rem;
		color: #07111b;
	}
	
	.overview .overview-right .star-wrap {
		margin-right: 0.512rem;
		width: 4.26667rem;
		line-height: 0.768rem;
	}
	
	.overview .overview-right .score {
		font-size: 0.512rem;
		line-height: 0.768rem;
		color: #ff9900;
	}
	
	.overview .overview-right .delivery {
		font-size: 0.512rem;
		line-height: 0.768rem;
		color: #93999f;
	}
	
	.rate-detail {
		border-top: 1px solid rgba(7, 17, 27, 0.1);
		background: #fff;
	}
	
	.rate-detail .ratings {
		padding: 0 0.768rem;
	}
	
	.rate-detail .ratings .rate-item {
		display: flex;
		position: relative;
		padding: 0.768rem 0;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	}
	
	.rate-detail .ratings .rate-item:last-child {
		border-bottom: none;
	}
	
	.rate-detail .ratings .avatar {
		margin-right: 0.512rem;
		width: 1.19467rem;
		height: 1.19467rem;
		border-radius: 50%;
		overflow: hidden;
	}
	
	.rate-detail .ratings .avatar img {
		width: 100%;
	}
	
	.rate-detail .ratings .content {
		flex: 1;
	}
	
	.rate-detail .ratings .content .name {
		margin-bottom: 0.17067rem;
		font-size: 0.42667rem;
		color: #07111b;
	}
	
	.rate-detail .ratings .content .star-box {
		width: 3.41333rem;
		margin-right: 0.256rem;
		line-height: 0.512rem;
	}
	
	.rate-detail .ratings .content .delivery {
		font-size: 0.42667rem;
		font-weight: 200;
		line-height: 0.512rem;
		color: #93999f;
	}
	
	.rate-detail .ratings .content .txt {
		margin: 0.256rem 0 0.34133rem;
		font-size: 0.512rem;
		line-height: 0.768rem;
		color: #07111b;
	}
	
	.rate-detail .ratings .content .recommend {
		line-height: 0.68267rem;
	}
	
	.rate-detail .ratings .content .recommend .icon-thumb_up {
		margin-right: 0.34133rem;
		font-size: 0.512rem;
		color: #00a0dc;
	}
	
	.rate-detail .ratings .content .recommend .item {
		margin: 0 0.34133rem 0.17067rem 0;
		padding: 0 0.256rem;
		width: 2.64533rem;
		height: 0.68267rem;
		border: 1px solid rgba(7, 17, 27, 0.1);
		border-radius: 2px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 0.384rem;
		color: #93999f;
	}
	
	.rate-detail .ratings .rate-time {
		position: absolute;
		top: 0.768rem;
		right: 0;
		font-size: 0.42667rem;
		line-height: 0.512rem;
		color: #93999f;
	}
</style>