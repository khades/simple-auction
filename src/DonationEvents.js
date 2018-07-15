/*
    Simple Donation Events
    by sutrunch for khades with ❤️
    v.1.0
*/

export default class DonationEvents {
  constructor() {
    if (typeof io !== 'function')
      throw new Error('Socket.IO should exist my boy!');

    this.streamlabs = false;
    this.donationalerts = false;
    this._listeners = [];
    return this;
  }

  connect(services) {
    if (typeof services !== 'object')
      throw new Error('Services should be specified!');

    if (typeof services.streamlabs === 'string') {
      if (typeof this.streamlabs === 'object') {
        this.streamlabs.disconnect(true);
        this.streamlabs = false;
      }

      const streamlabs = io(`https://sockets.streamlabs.com?token=${services.streamlabs}`, {
        reconnection: true,
        reconnectionAttempts: Infinity
      });

      streamlabs.on('event', (eventData) => {
        if (!eventData.for || eventData.for === 'streamlabs' && eventData.type === 'donation') {
          this._emitDonation('streamlabs', eventData.message[0]._id, eventData.message[0].amount, eventData.message[0].name, eventData.message[0].message);
        }
      });

      this.streamlabs = streamlabs;
    }

    if (typeof services.donationalerts === 'string') {
      if (typeof this.donationalerts === 'object') {
        this.donationalerts.disconnect(true);
        this.donationalerts = false;
      }

      const da = io('wss://socket.donationalerts.ru', {
        reconnection: true,
        reconnectionAttempts: Infinity
      });

      da.emit('add-user', {
        token: services.donationalerts,
        type: 'minor'
      });

      da.on('donation', (eventData) => {
        eventData = JSON.parse(eventData);
        this._emitDonation('donationalerts', eventData.id, eventData.amount, eventData.username, eventData.message);
      });

      this.donationalerts = da;
    }
  }

  addDonationListener(callback) {
    return this._listeners.push(callback);
  }

  _emitDonation(...donation) {
    for (let listener of this._listeners) {
      listener(...donation);
    }
  }
}
