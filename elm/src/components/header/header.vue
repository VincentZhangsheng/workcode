<template>
	<div class="header">
		<div class="content-wrap">
			<div class="avatar">
				<img :src="seller.avatar" />
			</div>
			<div class="content">
				<div class="title clearfix">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
				<div class="support clearfix" v-if="seller.supports">
					<span class="icon fl" :class="classMap[seller.supports[0].type]"></span>
					<span class="txt fl">{{seller.supports[0].description}}{{seller.supports[0].type}}</span>
				</div>
			</div>
			<div class="supports-count" v-if="seller.supports" @click="showDialog">
				<span class="count">{{seller.supports.length}}个</span>
				<span class="icon-keyboard_arrow_right"></span>
			</div>
		</div>
		<div class="bulletin-wrap" @click="showDialog">
			<span class="bull-tit"></span>
			<span class="bull-txt">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="bg-img">
			<img :src="seller.avatar" />
		</div>
		<transition name="fade">
			<div class="dialog-wrap" v-show="dialogShow" name="fade">
				<div class="dialog-content clearfix">
					<div class="dialog-main">
						<h1 class="name">{{seller.name}}</h1>
						<vueStar :size="48" :score="seller.score"></vueStar>
						<div class="title">
							<div class="line"></div>
							<div class="txt">优惠信息</div>
							<div class="line"></div>
						</div>
						<ul v-if="seller.supports" class="supports">
							<li class="support-item" v-for="(item, index) in seller.supports">
								<span class="icon" :class="classMap[seller.supports[index].type]"></span>
								<span class="txt">{{seller.supports[index].description}}</span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="txt">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">{{seller.bulletin}}</div>
					</div>
				</div>
				<div class="close-btn" @click="closeDialog">
					<i class="icon-close"></i>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import vueStar from '../star/star'
	
	export default {
		props: ['seller'],
		data() {
			return {
				dialogShow: false
			}
		},
		methods: {
			showDialog: function() {
				this.dialogShow = true
			},
			closeDialog: function() {
				this.dialogShow = false
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
		},
		components: {
			vueStar
		}
	}
</script>

<style>
	@import '../../common/stylus/icon.css';
	.header {
		color: #fff;
		position: relative;
		background: rgba(7, 17, 27, .5);
	}
	
	.content-wrap {
		display: flex;
		padding: 1.024rem 0.512rem 0;
		margin-bottom: 0.768rem;
		position: relative;
	}
	
	.content-wrap .title {
		margin-top: 0.08533rem;
		font-size: 0;
	}
	
	.content-wrap .title .brand {
		float: left;
		width: 1.28rem;
		height: 0.768rem;
		margin-right: 0.256rem;
		background: url(../../assets/brand.png) no-repeat left top;
		background-size: 100%;
	}
	
	.content-wrap .title .name {
		float: left;
		font-size: 0.68267rem;
		font-weight: bold;
		line-height: 0.768rem;
	}
	
	.content-wrap .description {
		margin: 0.34133rem 0 0.42667rem;
		font-size: 0.512rem;
	}
	
	.content-wrap .support {
		font-size: 0.42667rem;
		font-weight: 200;
		line-height: 0.512rem;
	}
	
	.content-wrap .support .icon {
		width: 0.512rem;
		height: 0.512rem;
		margin-right: 0.17067rem;
		background-size: 100%;
	}
	
	.content-wrap .support .icon.decrease {
		background: url(../../assets/decrease1.png) no-repeat left top;
	}
	
	.content-wrap .support .icon.discount {
		background: url(../../assets/discount1.png) no-repeat left top;
	}
	
	.content-wrap .support .icon.guarantee {
		background: url(../../assets/guarantee1.png) no-repeat left top;
	}
	
	.content-wrap .support .icon.invoice {
		background: url(../../assets/invoice1.png) no-repeat left top;
	}
	
	.content-wrap .support .icon.special {
		background: url(../../assets/special1.png) no-repeat left top;
	}
	
	.avatar {
		width: 2.73067rem;
		height: 2.73067rem;
		margin: 0 0.68267rem 0 0.512rem;
		border-radius: 0.08533rem;
		overflow: hidden;
	}
	
	.avatar img {
		width: 100%;
	}
	
	.content-wrap .supports-count {
		height: 1.024rem;
		font-size: 0;
		padding: 0.29867rem 0.10667rem 0.29867rem 0.34133rem;
		color: #fff;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 0.512rem;
		position: absolute;
		right: 0.512rem;
		top: 2.77333rem;
	}
	
	.content-wrap .supports-count .count {
		display: inline-block;
		font-size: 0.42667rem;
		margin-right: 0.08533rem;
	}
	
	.content-wrap .supports-count .icon-keyboard_arrow_right {
		float: right;
		font-size: 0.59733rem;
		margin-top: -0.08533rem;
	}
	
	.bulletin-wrap {
		height: 1.19467rem;
		padding: 0 0.256rem 0 0.512rem;
		background: rgba(7, 17, 27, 0.2);
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	
	.bulletin-wrap .bull-tit {
		display: block;
		width: 0.93867rem;
		height: 0.512rem;
		background: url(../../assets/bulletin.png) no-repeat left top;
		background-size: 100%;
	}
	
	.bulletin-wrap .bull-txt {
		display: block;
		width: 13.86667rem;
		margin: 0 0.17067rem;
		font-size: 0.42667rem;
		font-weight: 200;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.bulletin-wrap .icon-keyboard_arrow_right {
		font-size: 0.59733rem;
	}
	
	.header .bg-img {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
		overflow: hidden;
		filter: blur(10px);
	}
	
	.header .bg-img img {
		width: 100%;
		height: 100%;
	}
	
	.dialog-wrap {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 200;
		width: 100%;
		height: 100%;
		overflow: auto;
		background: rgba(7, 17, 27, 0.8);
		backdrop-filter: blur(10px);
	}
	.fade-enter-active{
		opacity: 1;
		transition: all .5s;
	}
	.fade-enter, .fade-leave{
		opacity: 1;
		background: rgba(7, 17, 27, 0.8);
	}
	.dialog-wrap .dialog-content {
		min-height: 100%;
	}
	
	.dialog-wrap .dialog-content .dialog-main {
		padding-top: 2.73067rem;
		padding-bottom: 2.73067rem;
	}
	
	.dialog-wrap .dialog-content .dialog-main .name {
		margin-bottom: 0.68267rem;
		font-size: 0.68267rem;
		font-weight: 700;
		text-align: center;
	}
	
	.dialog-wrap .dialog-content .dialog-main .title {
		display: flex;
		margin: 1.19467rem 0 1.024rem;
		width: 100%;
		padding: 0 1.536rem;
	}
	
	.dialog-wrap .dialog-content .dialog-main .title .line {
		flex: 1;
		height: 0;
		position: relative;
		top: 0.29867rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}
	
	.dialog-wrap .dialog-content .dialog-main .title .txt {
		padding: 0 0.512rem;
		font-size: 0.59733rem;
		font-weight: 700;
	}
	
	.dialog-wrap .close-btn {
		position: relative;
		width: 1.36533rem;
		height: 1.36533rem;
		margin: -2.73067rem auto 0;
		font-size: 1.36533rem;
		clear: both;
	}
	
	.dialog-wrap .dialog-content .supports {
		padding-left: 2.02667rem;
	}
	
	.dialog-wrap .dialog-content .supports .support-item {
		display: flex;
		margin-bottom: 0.512rem;
	}
	
	.dialog-wrap .dialog-content .supports .support-item:last-child {
		margin-bottom: 0;
	}
	
	.dialog-wrap .dialog-content .supports .icon {
		display: block;
		margin-right: 0.256rem;
		width: 0.68267rem;
		height: 0.68267rem;
		background-size: 100% 100%;
	}
	
	.dialog-wrap .supports .icon.decrease {
		background: url(../../assets/decrease1.png) no-repeat left top;
	}
	
	.dialog-wrap .supports .icon.discount {
		background: url(../../assets/discount1.png) no-repeat left top;
	}
	
	.dialog-wrap .supports .icon.guarantee {
		background: url(../../assets/guarantee1.png) no-repeat left top;
	}
	
	.dialog-wrap .supports .icon.invoice {
		background: url(../../assets/invoice5.png) no-repeat left top;
	}
	
	.dialog-wrap .supports .icon.special {
		background: url(../../assets/special5.png) no-repeat left top;
	}
	
	.dialog-wrap .dialog-content .supports .txt {
		line-height: 0.68267rem;
		font-size: 0.512rem;
		font-weight: 200;
		color: #fff;
	}
	
	.dialog-wrap .dialog-content .bulletin {
		padding: 0 2.02667rem;
		font-size: 0.512rem;
		font-weight: 200;
		line-height: 1.024rem;
		color: #fff;
	}
</style>