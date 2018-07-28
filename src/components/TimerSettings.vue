<template>
  <div class="timer-settings">
      <label for="auctionDuration">Длительность аукциона</label>
      <input type="number" v-model.number="auctionDuration" id="auctionDuration"/>
      <div class="timer-settings__checkbox">
        <input type="checkbox" id="restrictDuration"  v-model="restrictDuration"> 
        <label for="restrictDuration">Ограничить продление аукциона до его длительности</label>
       </div>
      <label for="auctionTimeout">Длительность специального времени чата, когда зачитываются нижеуказанные опции</label>
      <input type="number" v-model.number="auctionTimeout" id="auctionTimeout" />
      <label for="auctionWinnerChangeExtension">Насколько секунд продлять аукцион, если какойто вариант вырывается на первое место</label>
      <input type="number" v-model.number="auctionWinnerChangeExtension" id="auctionWinnerChangeExtension" />
      <label for="auctionExtension">Насколько секунд продлять аукцион, если пришёл донат</label>
      <input type="number" v-model.number="auctionExtension" id="auctionExtension" />
      <button type=button @click="saveTimerSettings(auctionDuration, auctionTimeout, auctionWinnerChangeExtension, auctionExtension, restrictDuration)">Сохранить</button>
  </div>
</template>

<script>
export default {
  name: "TimerSettings",
  props: [
    "getAuctionDuration",
    "getAuctionTimeout",
    "getAuctionWinnerChangeExtension",
    "getAuctionExtension",
    "getRestrictDuration",
    "saveTimerSettings"
  ],
  data: function() {
    return {
      auctionDuration: this.getAuctionDuration(),
      auctionTimeout: this.getAuctionTimeout(),
      auctionWinnerChangeExtension: this.getAuctionWinnerChangeExtension(),
      auctionExtension: this.getAuctionExtension(),
      restrictDuration: this.getRestrictDuration()
    };
  }
};
</script>
<style scoped>
.timer-settings {
  display: flex;
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
.timer-settings > button {
  margin-top: 1rem;
}
.timer-settings > * {
  width: 100%;
  margin-bottom: 1rem;
}
.timer-settings > button {
  font-size: 1.1rem;
}
</style>