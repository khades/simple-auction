<template>
  <div class="timer-settings">
      <label for="auctionDuration">Длительность аукциона</label>
      <input type="number" v-model.number="auctionDuration" id="auctionDuration"/>
      <label for="auctionTimeout">ХЗ как назвать</label>
      <input type="number" v-model.number="auctionTimeout" id="auctionTimeout" />
      <label for="auctionTimeoutExtension">Насколько секунд продлять аукцион, если какойто вариант вырывается на первое место</label>
      <input type="number" v-model.number="auctionTimeoutExtension" id="auctionTimeoutExtension" />
      <button type=button @click="saveTimerSettings(auctionDuration, auctionTimeout, auctionTimeoutExtenson)">Сохранить</button>
  </div>
</template>

<script>
export default {
  name: "TimerSettings",
  props: [
    "getAuctionDuration",
    "getAuctionTimeout",
    "getAuctionTimeoutExtension",
    "saveTimerSettings"
  ],
  data: function() {
    return {
      auctionDuration: this.getAuctionDuration(),
      auctionTimeout: this.getAuctionTimeout(),
      auctionTimeoutExtension: this.getAuctionTimeoutExtension()
    };
  }
};
</script>
<style scoped>
.timer-settings{
    display:flex;
    flex-direction: column;
    width: 100%;
    text-align: left;
}
.timer-settings > input {
    font-size: 1.1rem;
    padding: 0.3rem;
}
.timer-settings > button + * {
    margin-top: 1rem;
}
.timer-settings > button  {
    margin-top: 1rem;
}
.timer-settings >* {
    width: 100%;
    margin-bottom:1rem;
}
.timer-settings > button {
    font-size: 1.1rem;
}
</style>