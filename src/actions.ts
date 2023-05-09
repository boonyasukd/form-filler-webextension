import axios from 'redaxios';
import { fillGuestInfo, getTabId } from './utils';

function reset(app: AppState) {
  app.mrz1 = '';
  app.mrz2 = '';
  app.guestInfo = {};
}

async function fillForm(app: AppState) {
  try {
    app.loading = true;

    console.log('sending script to page context...');
    await chrome.scripting.executeScript({
      func: fillGuestInfo,
      args: [app.guestInfo as GuestInfo],
      target: { tabId: (await getTabId()) },
    });
    console.log('execution within page context done!');

    app.mrz1 = '';
    app.mrz2 = '';
    app.guestInfo = {};
    app.loading = false;
  } catch (e) {
    app.loading = false;
  }
}

async function readIdCard(app: AppState): Promise<void> {
  app.loading = true;

  const resp = await axios.get<GuestInfo>('http://localhost:8080/thai-id/info');

  app.guestInfo = resp.data;
  app.loading = false;
}

async function generatePdf(app: AppState): Promise<void> {
  app.loading = true;

  const resp = await axios.post<string>('http://localhost:8080/registration/create', app.selectedText);

  app.fileURL = resp.data;
  app.selectedText = '';
  app.loading = false;
}

function openPdfInNewTab(app: AppState) {
  window.open(app.fileURL, '_blank');
  app.fileURL = '';
}

export { reset, fillForm, readIdCard, generatePdf, openPdfInNewTab };
