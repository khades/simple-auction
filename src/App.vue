<template>
<div>
    <div v-if="page === 'timerSettings'" id="app" class="auction-app">
         <div class="auction-app__header">
      <div class="auction-app__header-text">Аукцион</div>
      <Timer :getCurrentAuctionStart=getCurrentAuctionStart :getCurrentAuctionDuration=getCurrentAuctionDuration />
      <div class="auction-app__buttons">
        <button type=button @click=goToApp>Назад</button>
      </div>
    </div>
    <div class="auction-app__body">
      <TimerSettings :getRestrictDuration=getRestrictDuration :getAuctionExtension=getAuctionExtension :getAuctionDuration=getAuctionDuration :getAuctionTimeout=getAuctionTimeout :getAuctionWinnerChangeExtension=getAuctionWinnerChangeExtension :saveTimerSettings=saveTimerSettings />
    </div>
  </div>
  <div v-if="page === 'settings'" id="app" class="auction-app">
    <div class="auction-app__header">
      <div class="auction-app__header-text">Аукцион</div>
      <Timer :getCurrentAuctionStart=getCurrentAuctionStart :getCurrentAuctionDuration=getCurrentAuctionDuration />

      <div class="auction-app__buttons">
        <button type=button @click=goToApp>Назад</button>
      </div>
    </div>
    <div class="auction-app__body">
      <Settings :getStreamlabsKey=getStreamlabsKey :getDonationalertsKey=getDonationalertsKey :setStreamlabsKey=setStreamlabsKey :setDonationalertsKey=setDonationalertsKey />
    </div>
  </div>
  
  <div v-if="page === 'app'"  id="app" class="auction-app">
    <div class="auction-app__header">
      <div class="auction-app__header-text">Аукцион</div>
      <Timer :getCurrentAuctionStart=getCurrentAuctionStart :getCurrentAuctionDuration=getCurrentAuctionDuration />

      <div class="auction-app__buttons">
        <button type=button @click=goToTimerSettings>Настроить таймер</button>
        <button type=button @click=goToSettings>Настроить системы донатов</button>
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
        <div v-for="(incomingTransaction) in getincomingTransactions()"  :key="incomingTransaction.id" >
          <IncomingTransaction :incomingTransaction=incomingTransaction :addMoneyToItem=addMoneyToItem :getItems=getItems :dropItem=dropItem />
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import AuctionItem from "./components/AuctionItem";
import IncomingTransaction from "./components/IncomingTransaction";
import Settings from "./components/Settings";
import TimerSettings from "./components/TimerSettings";
import Timer from "./components/Timer";
import sha512 from "js-sha512";

import DonationEvents from "./DonationEvents";

var data = function() {
  this.auctionDuration =
    parseInt(localStorage.getItem("auctionDuration")) || 1200;
  this.auctionTimeout =
    parseInt(localStorage.getItem("auctionDurationTimeout")) || 120;
  this.auctionWinnerChangeExtension =
    parseInt(localStorage.getItem("auctionDurationTimeoutExtension")) || 120;
  this.auctionExtension =
    parseInt(localStorage.getItem("auctionExtension")) || 0;
  this.currentAuctionDuration =
    parseInt(localStorage.getItem("currentAuctionDuration")) || 1200;
  this.currentAuctionStart =
    parseInt(localStorage.getItem("currentAuctionStart")) ||
    new Date().getTime();
  this.restrictDuration = localStorage.getItem("restrictDuration") == "true";
  this.streamlabsKey = localStorage.getItem("streamlabsKey");
  this.donationalertsKey = localStorage.getItem("donationalertsKey");
  this.page = "app";
  this.eventListener = new DonationEvents();
  this.incomingTransactions = [];
  var incT = JSON.parse(localStorage.getItem("incomingTransactions"));
  if (Array.isArray(incT)) {
    this.incomingTransactions = incT.sort((lItem, rItem) => rItem - lItem);
  }
  this.items = [];
  var itemT = JSON.parse(localStorage.getItem("items"));
  if (Array.isArray(itemT)) {
    this.items = itemT.sort((lItem, rItem) => rItem.amount - lItem.amount);
  }
  this.eventListener.addDonationListener(
    function(service, id, amount, name, text) {
      var parsedAmount = Math.floor(parseFloat(amount));
      this.incomingTransactions.push({
        id: sha512(service + " " + name + amount + new Date().getTime()),
        user: name,
        body: text,
        amount: parsedAmount,
        date: new Date().getTime()
      });
      this.incomingTransactions.sort((lItem, rItem) => rItem - lItem);
      localStorage.setItem(
        "incomingTransactions",
        JSON.stringify(this.incomingTransactions)
      );
    }.bind(this)
  );

  this.eventListener.connect({
    donationalerts: this.donationalertsKey,
    streamlabs: this.streamlabsKey
  });

  this.topAmount = 0;
  if (this.items.length > 0) this.topAmount = this.items[0].amount;
  return {
    page: this.page,
    auctionDuration: this.auctionDuration,
    auctionTimeout: this.auctionTimeout,
    restrictDuration: this.restrictDuration,
    auctionWinnerChangeExtension: this.auctionWinnerChangeExtension,
    topAmount: this.topAmount,
    items: this.items,
    streamlabsKey: this.streamlabsKey,
    donationalertsKey: this.donationalertsKey,
    incomingTransactions: this.incomingTransactions,
    getRestrictDuration: () => {
      return this.restrictDuration;
    },
    getAuctionDuration: () => {
      return this.auctionDuration;
    },
    getAuctionTimeout: () => {
      return this.auctionTimeout;
    },
    getCurrentAuctionDuration: () => {
      return this.currentAuctionDuration;
    },
    getAuctionExtension: () => {
      return this.auctionExtension;
    },
    getCurrentAuctionStart: () => {
      return this.currentAuctionStart;
    },
    getAuctionWinnerChangeExtension: () => {
      return this.auctionWinnerChangeExtension;
    },
    saveTimerSettings: (
      auctionDuration,
      auctionTimeout,
      auctionWinnerChangeExtension,
      auctionExtension,
      restrictDuration
    ) => {
      this.auctionDuration = parseInt(auctionDuration) || 1200;
      this.auctionTimeout = parseInt(auctionTimeout) || 120;
      this.auctionWinnerChangeExtension =
        parseInt(auctionWinnerChangeExtension) || 120;
      this.auctionExtension = parseInt(auctionExtension) || 120;
      this.restrictDuration = restrictDuration;
      localStorage.setItem("auctionDuration", this.auctionDuration);
      localStorage.setItem("auctionTimeout", this.auctionTimeout);

      localStorage.setItem(
        "auctionWinnerChangeExtension",
        this.auctionWinnerChangeExtension
      );
      localStorage.setItem("auctionExtension", this.auctionExtension);
      localStorage.setItem("restrictDuration", this.restrictDuration);
    },

    goToApp: () => {
      this.page = "app";
    },
    goToSettings: () => {
      this.page = "settings";
    },
    goToTimerSettings: () => {
      this.page = "timerSettings";
    },
    getTopAmount: () => {
      return this.topAmount;
    },
    getItems: () => {
      return this.items;
    },
    dropItem: incomingTransaction => {
      incomingTransaction;
      this.incomingTransactions = this.incomingTransactions.filter(
        item => item !== incomingTransaction
      );
      localStorage.setItem(
        "incomingTransactions",
        JSON.stringify(this.incomingTransactions)
      );
    },
    addMoneyToItem: (itemName, incomingTransaction) => {
      var topItem = "";
      if (this.items.length > 0) {
        topItem = this.items[0].name;
      }
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
      this.incomingTransactions = this.incomingTransactions.filter(
        item => item !== incomingTransaction
      );
      var currentAuctionExpiration =
        this.currentAuctionStart +
        this.currentAuctionDuration * 1000 -
        new Date().getTime();
      if (currentAuctionExpiration < this.auctionTimeout * 1000) {
        this.currentAuctionDuration =
          this.currentAuctionDuration + this.auctionExtension;
        if (topItem != this.items[0].name) {
          this.currentAuctionDuration =
            this.currentAuctionDuration + this.auctionWinnerChangeExtension;
        }

        if (this.restrictDuration === true) {
          var recalculatedCurrentAuctionExpiration =
            this.currentAuctionStart +
            this.currentAuctionDuration * 1000 -
            new Date().getTime();
          if (
            recalculatedCurrentAuctionExpiration >
            this.auctionDuration * 1000
          ) {
            this.currentAuctionDuration = this.auctionDuration;
            this.currentAuctionStart = new Date().getTime();
            localStorage.setItem(
              "currentAuctionStart",
              this.currentAuctionStart
            );
          }
        }
        localStorage.setItem(
          "currentAuctionDuration",
          this.currentAuctionDuration
        );
      }
      localStorage.setItem(
        "incomingTransactions",
        JSON.stringify(this.incomingTransactions)
      );
    },
    getincomingTransactions: () => {
      return this.incomingTransactions;
    },
    fullReset: () => {
      this.items = [];
      this.incomingTransactions = [];

      this.currentAuctionDuration = this.auctionDuration;
      localStorage.setItem("currentAuctionDuration", this.auctionDuration);

      this.currentAuctionStart = new Date().getTime();
      localStorage.setItem("currentAuctionStart", this.currentAuctionStart);

      localStorage.setItem("items", JSON.stringify(this.items));
      localStorage.setItem(
        "incomingTransactions",
        JSON.stringify(this.incomingTransactions)
      );
    },
    addIncomingTransatiions: item => {
      this.incomingTransactions.push(item);
      localStorage.setItem(
        "incomingTransactions",
        JSON.stringify(this.incomingTransactions)
      );
    },
    getStreamlabsKey: () => {
      return this.streamlabsKey;
    },
    setStreamlabsKey: streamlabsKey => {
      this.streamlabsKey = streamlabsKey;
      localStorage.setItem("streamlabsKey", streamlabsKey);
      this.eventListener.connect({ streamlabs: streamlabsKey });
    },
    getDonationalertsKey: () => {
      return this.donationalertsKey;
    },
    setDonationalertsKey: donationalertsKey => {
      this.donationalertsKey = donationalertsKey;
      localStorage.setItem("donationalertsKey", donationalertsKey);
      this.eventListener.connect({ donationalerts: donationalertsKey });
    }
  };
};

export default {
  data: data,
  name: "App",
  components: {
    AuctionItem,
    IncomingTransaction,
    Settings,
    TimerSettings,
    Timer
  }
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
html,
body {
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
.auction-app__header-text,
.timer {
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
