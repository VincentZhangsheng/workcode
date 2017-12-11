<template>
	<div class="star-wrap">
		<div class="star" :class="starType">
			<span v-for="itemClass in itemClasses" :class="itemClass" class="icon-star"></span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	const len      = 5;
	const cls_on   = "on";
	const cls_off  = "off";
	const cls_half = "half";
	export default {
		props: {
			size: {
				type: Number
			},
			score: {
				type: Number
			}
		},
		computed: {
			starType() {
				return 'star-' + this.size;
			},
			itemClasses () {
				let result     = [];
				let score      = Math.floor(this.score * 2) / 2;
				let hasDecimal = score % 1 !==0;
				let integer    = Math.floor(score);
				for (let i=0; i<integer; i++) {
					result.push(cls_on);
				}
				if (hasDecimal) {
					result.push(cls_half);
				}
				while (result.length < len) {
					result.push(cls_off);
				}
				return result;
			}
		}
	}
</script>

<style>
	.star {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.star.star-24 .icon-star {
		width: 0.64rem;
		height: 0.64rem;
		margin-right: 0.21333rem;
	}
	
	.star.star-24 .icon-star:last-child {
		margin-right: 0;
	}
	
	.star.star-24 .icon-star.on {
		background: url(../../assets/star24_on.png) no-repeat left top;
	}
	
	.star.star-24 .icon-star.off {
		background: url(../../assets/star24_off.png) no-repeat left top;
	}
	
	.star.star-24 .icon-star.half {
		background: url(../../assets/star24_half.png) no-repeat left top;
	}
	
	.star.star-36 .icon-star {
		width: 0.96rem;
		height: 0.96rem;
		margin-right: 0.35rem;
	}
	
	.star.star-36 .icon-star:last-child {
		margin-right: 0;
	}
	
	.star.star-36 .icon-star.on {
		background: url(../../assets/star36_on.png) no-repeat left top;
	}
	
	.star.star-36 .icon-star.off {
		background: url(../../assets/star36_off.png) no-repeat left top;
	}
	
	.star.star-36 .icon-star.half {
		background: url(../../assets/star36_half.png) no-repeat left top;
	}
	
	.star.star-48 .icon-star {
		width: 0.85333rem;
		height: 0.85333rem;
		margin-right: 0.42667rem;
	}
	
	.star.star-48 .icon-star:last-child {
		margin-right: 0;
	}
	
	.star.star-48 .icon-star.on {
		background: url(../../assets/star48_on.png) no-repeat left top;
	}
	
	.star.star-48 .icon-star.off {
		background: url(../../assets/star48_off.png) no-repeat left top;
	}
	
	.star.star-48 .icon-star.half {
		background: url(../../assets/star48_half.png) no-repeat left top;
	}
	
	.star .icon-star {
		display: block;
		background-size: 100%;
	}
</style>