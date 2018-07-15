<template>
  <div v-if="settings" id="app" class="auction-app">
    <div class="auction-app__header">

      <div class="auction-app__header-text">Аукцион</div>
      <div class="auction-app__buttons">
        <button type=button @click=setSettings(false)>Назад</button>
      </div>
    </div>
    <div class="auction-app__body">
      <Settings :getStreamlabsKey=getStreamlabsKey :getDonationalertsKey=getDonationalertsKey :setStreamlabsKey=setStreamlabsKey :setDonationalertsKey=setDonationalertsKey />
    </div>
  </div>
  
  <div v-else id="app" class="auction-app">
    <div class="auction-app__header">
      <div class="auction-app__header-text">Аукцион</div>
      <div class="auction-app__buttons">
        <button type=button @click=setSettings(true)>Настроить</button>
        <button type=button @click=fullReset>Сбросить</button>
      </div>
    </div>
    <div class="auction-app__body">
      <div class="auction-items">
        <div v-for="(item) in getItems()" :key="item.name">
          <AuctionItem :item=item :getTopAmount=getTopAmount />
        </div>
      </div>
      <div class="incoming-transactions">
        <div v-for="(incomingTransaction) in getincomingTransaсtions()"  :key="incomingTransaction.transactionID">
          <IncomingTransaction :incomingTransaction=incomingTransaction :addMoneyToItem=addMoneyToItem :getItems=getItems />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuctionItem from "./components/AuctionItem";
import IncomingTransaction from "./components/IncomingTransaction";
import Settings from "./components/Settings";
import DonationEvents from "./DonationEvents";

var data = function() {
  this.streamlabsKey = localStorage.getItem('streamlabsKey');
  this.donationalertsKey = localStorage.getItem("donationalertsKey");
  this.settings = false;
  this.eventListener = new DonationEvents();
  this.incomingTransaсtions = []
  var incT = JSON.parse(localStorage.getItem("incomingTransaсtions"))
  if (Array.isArray(incT)) {
    this.incomingTransaсtions = incT.sort((lItem, rItem) => rItem - lItem);
  }

  this.eventListener.addDonationListener(function(service, id, amount, name, text) {
    this.incomingTransaсtions.push({user:name, body: text, amount: amount, date: new Date().getTime()})
    this.incomingTransaсtions.sort((lItem, rItem) => rItem - lItem)
    localStorage.setItem(
        "incomingTransaсtions",
        JSON.stringify(this.incomingTransaсtions)
    );
  }.bind(this));
  this.items = JSON.parse(localStorage.getItem("items")).sort((lItem, rItem) => rItem.amount - lItem.amount);
      this.eventListener.connect({donationalerts: this.donationalertsKey, streamlabs: this.streamlabsKey});

  this.topAmount = 0;
  if (this.items.length > 0) this.topAmount = this.items[0].amount;
  return {
    settings: this.settings,
    getSettings: () => {
      return this.settings;
    },
    setSettings(bool) {
      this.settings = bool;
    },
    topAmount: this.topAmount,
    items: this.items,
    streamlabsKey: this.streamlabsKey,
    donationalertsKey: this.donationalertsKey,
    incomingTransaсtions: this.incomingTransaсtions,
    getTopAmount: () => {
      return this.topAmount;
    },
    getItems: () => {
      return this.items;
    },
    addMoneyToItem: (itemName, incomingTransaction) => {
      var itemFound = this.items.some((item, index) => {
        if (itemName !== item.name) return false;
        this.items[index].amount =
          this.items[index].amount + incomingTransaction.amount;
        return true;
      });
      if (itemFound === false) {
        this.items.push({ name: itemName, amount: incomingTransaction.amount });
      }
      this.items.sort((lItem, rItem) => rItem.amount - lItem.amount);
      if (this.items.length > 0) this.topAmount = this.items[0].amount;
      localStorage.setItem("items", JSON.stringify(this.items));
      this.incomingTransaсtions = this.incomingTransaсtions.filter(
        item => item !== incomingTransaction
      );
      localStorage.setItem(
        "incomingTransaсtions",
        JSON.stringify(this.incomingTransaсtions)
      );
    },
    getincomingTransaсtions: () => {
      return this.incomingTransaсtions;
    },
    fullReset: () => {
      this.items = [];
      this.incomingTransaсtions = [];
      localStorage.setItem("items", JSON.stringify(this.items));
      localStorage.setItem(
        "incomingTransaсtions",
        JSON.stringify(this.incomingTransaсtions)
      );
    },
    addIncomingTransatiions: item => {
      this.incomingTransaсtions.push(item);
      localStorage.setItem(
        "incomingTransaсtions",
        JSON.stringify(this.incomingTransaсtions)
      );
    },
    getStreamlabsKey: () => {
      return this.streamlabsKey;
    },
    setStreamlabsKey: streamlabsKey => {
      this.setStreamlabsKey = streamlabsKey;
      localStorage.setItem("streamlabsKey", streamlabsKey);
      this.eventListener.connect({streamlabs: streamlabsKey});
    },
    getDonationalertsKey: () => {
      return this.donationalertsKey;
    },
    setDonationalertsKey: donationalertsKey => {
      this.donationalertsKey = donationalertsKey;
      localStorage.setItem("donationalertsKey", donationalertsKey);
      this.eventListener.connect({donationalerts: donationalertsKey});

    }
  };
};

// import HelloWorld from "./components/HelloWorld"

export default {
  data: data,
  name: "App",
  components: { AuctionItem, IncomingTransaction, Settings }
};
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
}
html, body {
  margin: 0;
  padding: 0;
}
.auction-app {
  padding: 1rem;
}
.auction-app__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.auction-app__header-text{
  font-size: 2rem;
  font-weight: bolder;
  line-height: 2rem;
}
.auction-app__buttons > * {
  margin-left: 0.3rem;
  height: 2rem;
  font-size: 1.1rem;
}
.auction-app__body {
  position: fixed;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  top: 3rem;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
}
.auction-items {
  width: 70%;
  max-height: 100%;
  overflow-x: hidden;
  overflow-x: auto;
}
.incoming-transactions {
  width: 30%;
  padding-left: 1rem;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
