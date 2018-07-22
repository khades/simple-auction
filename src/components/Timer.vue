<template>
  <div class="timer">
      {{ timer }}
  </div>
</template>

<script>
export default {
  name: "Timer",
  props: ["getCurrentAuctionDuration", "getCurrentAuctionStart"],
  data() {
    return {
      timer: "00:00"
    };
  },
  mounted() {
    this.interval = setInterval(
      function() {
        this.timer = this.getTimer();
      }.bind(this),
      1000
    );
  },
  methods: {
    getTimer: function() {
      var secondsLeft = Math.floor(
        (this.getCurrentAuctionStart() +
          this.getCurrentAuctionDuration() * 1000 -
          new Date().getTime()) /
          1000
      );

      if (secondsLeft < 0 || secondsLeft == NaN) {
        return "00:00";
      }
      var hours = Math.floor(secondsLeft / 3600);
      var minutes = Math.floor(secondsLeft / 60 - hours * 60);
      var seconds = Math.floor(secondsLeft - minutes * 60 - hours * 3600);
      var text = "";
      if (hours > 0) {
        text = `${hours}:`;
      }
      if (minutes > 9) {
        text = text + minutes + ":";
      } else {
        text = text + "0" + minutes + ":";
      }
      if (seconds > 9) {
        text = text + seconds;
      } else {
        text = text + "0" + seconds;
      }

      return text;
    }
  }
};
</script>
