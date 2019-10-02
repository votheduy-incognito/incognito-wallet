import { notifications, buildNotification, createNotificationChannel } from './firebase';

const log = (...args) => console.log('BalanceNotification', args);

class BalanceNotification {
  constructor({ id } = {}) {
    this.channelId = 'balance_notification_channel';
    this.notificationId = id;
    this._createChannel();
  }
  
  _createChannel() {
    createNotificationChannel(this.channelId, 'Balance Notification', 'Notify to user about their node balance');
  }

  _buildNotification() {
    return buildNotification({
      id: this.notificationId,
      title: 'Incognito wallet',
      body: 'Open your wallet to check your balance',
      androidChannelId: this.channelId
    });
  }

  _listen() {
    notifications().onNotification((notification: Notification) => {
      log(`Receive new balance notification for "${this.notificationId}"`, notification);

      if (typeof this.callback === 'function') {
        this.callback(notification);
      }
    });


    // notifications().onNotificationDisplayed((notification: Notification) => {
    //   // Process your notification as required
    //   // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    //   log('XXXX onNotificationDisplayed');
    // });

    // notifications().onNotificationOpened((notificationOpen) => {
    //   // // Get the action triggered by the notification being opened
    //   // const action = notificationOpen.action;
    //   // // Get information about the notification that was opened
    //   // const notification = notificationOpen.notification;

    //   log('XXXX onNotificationOpened');
    // });

    // const notificationOpen = await notifications().getInitialNotification();
    // if (notificationOpen) {
    //   // App was opened by a notification
    //   // Get the action triggered by the notification being opened
    //   const action = notificationOpen.action;
    //   // Get information about the notification that was opened
    //   const notification: Notification = notificationOpen.notification;
    //   log('XXXX notificationOpen APP CLOSED');
    // }
  }

  onNotification(callback) {
    this.callback = callback;
  }

  stopSchedule() {
    return notifications().cancelNotification(this.notificationId);
  }
  
  async restartSchedule() {
    try {
      await this.stopSchedule();
      const schedules = await notifications().getScheduledNotifications();
      log('schedules', schedules);
    } finally {
      this.startSchedule();
      log(`Schedule "${this.notificationId}" was restarted!`);
    }
  }

  startSchedule() {
    const repeatInterval = 'hours';
    const date = new Date();
    const noti = this._buildNotification();

    // date.setSeconds(date.getSeconds() + 10);

    log(`Start BalanceNotification schedule in every ${repeatInterval}`);

    notifications().scheduleNotification(noti, {
      fireDate: date.getTime(),
      repeatInterval,
      exact: true,
    });

    this._listen();

    return this;
  }
}

export default BalanceNotification;