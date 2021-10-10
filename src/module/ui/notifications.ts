// SPDX-FileCopyrightText: 2021 Johannes Loher
//
// SPDX-License-Identifier: MIT

import logger from '../logger';

function getNotificationFunction(type: 'info' | 'warn' | 'error') {
  return (
    message: string,
    { permanent = false, log = false }: { permanent?: boolean; log?: boolean } = {},
  ): void => {
    if (ui.notifications) {
      ui.notifications[type](message, { permanent });
      if (log) {
        logger[type](message);
      }
    } else {
      logger[type](message);
    }
  };
}

const notifications = {
  info: getNotificationFunction('info'),
  warn: getNotificationFunction('warn'),
  error: getNotificationFunction('error'),
  notify: (
    message: string,
    type: 'info' | 'warning' | 'error' = 'info',
    { permanent = false, log = false }: { permanent?: boolean; log?: boolean } = {},
  ): void => {
    if (ui.notifications) {
      ui.notifications.notify(message, type, { permanent });
      if (log) {
        logger.getLoggingFunction(type)(message);
      }
    } else {
      logger.getLoggingFunction(type)(message);
    }
  },
};

export default notifications;
