<template>
  <div class="auction-item">
    <div class="auction-item__body">
      <div class="auction-item__name"> {{ item.name }} </div>
      <div class="auction-item__amount"> {{ item.amount }}р </div>
    </div>
    <div class="auction-item__progress-bar" :style=generateStyle></div>
  </div>
</template>

<script>
export default {
  name: "AuctionItem",
  props: ["item", "getTopAmount"],
  computed: {
    generateStyle: function() {
      var value = this.item.amount / this.getTopAmount() * 100;
      return `width: ${value}%;`;
    }
  }
};
</script>
<style scoped>
.auction-item {
  font-size: 2rem;
  font-weight: bolder;
  padding: 1rem;
  border: 1px solid grey;
  margin-bottom: 1rem;
    position: relative;

}

.auction-item__progress-bar {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #aaaaaa;
  transition: width 1s ease-in-out;
}
.auction-item__body {
  position: relative;
  z-index: 5;
  display: flex;
  justify-content: space-between;
}
</style>