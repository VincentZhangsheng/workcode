<template>
	<div class="cartcontrol clearfix">
		<div class="cart-decrease fl icon-remove_circle_outline" v-show="food.count>0" @click.stop.prevent="decreaseGoods"></div>
		<div class="cart-count fl" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add fr icon-add_circle" @click.stop.prevent="addGoods"></div>
	</div>
</template>

<script>
	import Vue from 'vue'
	export default {
		props: {
			food: {
				type: Object
			}
		},
		methods: {
			addGoods() {
				if(!this.food.count) {
					Vue.set(this.food, 'count', 1)
				} else {
					this.food.count++
				}
			},
			decreaseGoods() {
				if(this.food.count) {
					this.food.count--
				}
			}
		}
	}
</script>

<style>
	.cartcontrol .cart-decrease,
	.cartcontrol .cart-count,
	.cartcontrol .cart-add {
		width: 1.06667rem;
		text-align: center;
		padding: 0.21333rem 0;
	}
	
	.cartcontrol .cart-decrease,
	.cartcontrol .cart-add {
		font-size: 1.024rem;
		color: #00a0dc;
	}
	
	.cartcontrol .cart-count {
		line-height: 1.024rem;
		font-size: 0.42667rem;
		color: #93999f;
	}
</style>