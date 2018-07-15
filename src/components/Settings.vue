<template>
  <div class="settings">
      <label for="donationalertsKey">Ключ Donationalerts</label>
      <input v-model="donationalertsKey" id="donationalertsKey"/>
      <button type=button @click=setDonationalertsKey(donationalertsKey)>Сохранить ключ для Donationalerts</button>
      <label for="streamlabsKey">Ключ Streamlabs</label>
      <input v-model="streamlabsKey" id="streamlabsKey" />
      <button type=button @click=setStreamlabsKey(streamlabsKey)>Сохранить ключ для Streamlabs</button>
  </div>
</template>

<script>
export default {
  name: "Settings",
  props: [
    "getStreamlabsKey",
    "getDonationalertsKey",
    "setStreamlabsKey",
    "setDonationalertsKey"
  ],
  data: function() {
    return {
      streamlabsKey: this.getStreamlabsKey(),
      donationalertsKey: this.getDonationalertsKey()
    };
  }
};
</script>
<style scoped>
.settings{
    display:flex;
    flex-direction: column;
    width: 100%;
    text-align: left;
}
.settings > input {
    font-size: 1.1rem;
    padding: 0.3rem;
}
.settings > button + * {
    margin-top: 1rem;
}
.settings >* {
    width: 100%;
    margin-bottom:1rem;
}
.settings > button {
    font-size: 1.1rem;
}
</style>