<template>
  <div class="incoming-transaction">
    <div class="incoming-transaction__header"> 
      <div class="incoming-transaction__name"> @{{ incomingTransaction.user }} </div>
    <div class="incoming-transaction__amount"> {{ incomingTransaction.amount }}р </div>
    </div>
    <div class="incoming-transaction__body"> {{ incomingTransaction.body }} </div>
    <div class="incoming-transaction__button" v-for="(item,index) in getItems()"  :key="index">
      <button @click="addMoneyToItem(item.name,incomingTransaction)" type=button>Add to {{ item.name }}</button>
    </div>
    <input v-model="customItem" placeholder="Другой вариант">
      <button @click="addMoneyToItem(customItem,incomingTransaction)" type=button>Другой вариант</button>

  </div>
</template>

<script>
export default {
  name: 'IncomingTransaction',
  props: ['incomingTransaction', 'addMoneyToItem', 'getItems']
}
</script>
<style scoped>
.incoming-transaction {
width: 100%;
margin-bottom: 1px;
padding: 1rem;
text-align: left;
border: 1px solid grey;
margin-bottom: 1rem;
 
}
.incoming-transaction input {
    height: 2rem;
    width: 100%;
    font-size: 1.1rem;
    margin-top: 1rem;
    margin-bottom: 0.3rem;
    padding: 0.3rem;
}
.incoming-transaction  button {
     height: 2rem;
     width: 100%;
     font-size: 1.1rem;
}

.incoming-transaction__button + .incoming-transaction__button {
    margin-top: 0.3rem;
}

.incoming-transaction__header {
    width:100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
}

.incoming-transaction__body + div {
    margin-top: 0.5rem;
}

.incoming-transaction__name {
    font-weight: bolder;
    color: #aaaaaa;
}

.incoming-transaction__amount {
    font-size: 1.3rem;
    font-weight: bolder;
}
</style>