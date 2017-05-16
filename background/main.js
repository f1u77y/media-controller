'use strict';

/* global chrome */
/* global define */

define([
    './tab-chooser',
    './controller-proxy',
], (chooser, ControllerProxy) => {
    const proxy = new ControllerProxy('ws://localhost:4000/');

    proxy.onCommand((command, argument) => {
        chooser.sendMessage({ command, argument });
    });
    chrome.runtime.onMessage.addListener((message, sender) => {
        if (sender.tab.id !== chooser.currentTabId) {
            return;
        }
        if (typeof message !== 'object') {
            return;
        }
        proxy.sendCommand(message);
    });
    chrome.pageAction.onClicked.addListener((tab) => {
        if (tab.id !== chooser.currentTabId) {
            chooser.changeTab(tab.id);
        }
    });
});