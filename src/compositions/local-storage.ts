import { watch } from 'vue';
import { parseMrz } from '../utils';

const key = 'myData';

function useLocalStorage(app: AppState) {
  const prev = JSON.parse(localStorage.getItem(key)!) as AppState | null;
  if (prev) {
    console.log(`prev is: ${JSON.stringify(prev, null, 2)}`);
    console.log(`prev mrz1 is ${prev.mrz1}`);
    console.log(`prev mrz2 is ${prev.mrz2}`);
    if (prev.guestInfo) app.guestInfo = prev.guestInfo;
    if (prev.activeTab) app.activeTab = prev.activeTab;  
    if (prev.mrz1) app.mrz1 = prev.mrz1;
    if (prev.mrz2) app.mrz2 = prev.mrz2;
  } else {
    console.log('no prev localStorage obj found.');
  }

  watch(() => [app.mrz1, app.mrz2], () => {
    console.log('MRZ line(s) has/have changed...');
    localStorage.setItem(key, JSON.stringify(app));

    try {
      const result = parseMrz([app.mrz1, app.mrz2]);
      app.guestInfo = result;
    } catch (e) {
      console.log('MRZ parsing failed...');
      app.guestInfo = {};
    }
  });

  watch(() => app.activeTab, () => {
    console.log('app tab has changed...');
    localStorage.setItem(key, JSON.stringify(app));
  });

  watch(() => app.guestInfo, () => {
    console.log('GuestInfo has changed...');
    localStorage.setItem(key, JSON.stringify(app));
  });
}

export { useLocalStorage };
