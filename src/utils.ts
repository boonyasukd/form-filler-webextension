import { alpha3ToAlpha2 }  from 'i18n-iso-countries';
import { parse } from 'mrz';
import type { InjectionKey } from 'vue';

const appStateKey = Symbol() as InjectionKey<AppState>;

function fillGuestInfo(info: GuestInfo) {
  function $x(path: string, val: string) {
    const xpath = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    const nodes: WritableNode[] = [];
  
    let node;
    while(node = xpath.iterateNext()) {
      nodes.push(node as WritableNode);
    }

    const elem = nodes[0];
    elem.value = val;
  }
  
  function $n(name: string, val: string) {
    const elem = (document.getElementsByName(name) as NodeListOf<WritableNode>)[0];
    elem.value = val;
  }

  function $e(name: string, type: string) {
    (document.getElementsByName(name) as NodeListOf<WritableNode>)[0].dispatchEvent(new Event(type));
  }

  $n('guest_document_type', info.docType);
  $e('guest_document_type', 'change');

  $n('guest_first_name', info.firstName);
  $n('guest_last_name', info.lastName);
  $n('guest_email', 'no@gmail.com');
  $n('guest_birthday', info.dob);

  $n('label_birthday', info.dob);
  $e('label_birthday', 'input');

  $n('guest_document_number', info.docNum);
  $e('guest_document_number', 'input');

  $n('guest_document_expiration_date', info.expiry);

  $n('guest_gender', info.sex);
  $x('//label[contains(.,"Sex")]/..//input', info.sex);

  $n('guest_country', info.alpha2);
  $n('guest_thai_nationality', info.alpha2);
  $n('guest_document_issuing_country', info.alpha2);

  if (info.docType !== 'passport') {
    $n('guest_document_issue_date', info.issue);
    $n('guest_address1', info.address);
  }
}

function reformatDate(dateStr: string) {
  const [year, month, date] = dateStr.match(/.{1,2}/g)!;
  const fullYear = parseInt(year) <= 50 ? `20${year}` : `19${year}`;
  return `${date}/${month}/${fullYear}`;
}

const capitalize = (name: string) => name
  .toLowerCase()
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.substring(1))
  .join(' ');

function parseMrz(input: string[]): GuestInfo {
  const result = parse(input);
  if (!result.valid) {
    throw Error('MRZ is invalid');
  } else {
    const mrz = result.fields as Mrz;

    return {
      docType: 'passport',
      docNum: mrz.documentNumber,
      firstName: capitalize(mrz.firstName),
      lastName: capitalize(mrz.lastName),
      dob: reformatDate(mrz.birthDate),
      alpha2: alpha3ToAlpha2(mrz.nationality),
      issue: '',
      expiry: reformatDate(mrz.expirationDate),
      sex: (mrz.sex === 'female') ? 'F': 'M',
      address: '',
    };
  }
}

async function getTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id!;
}

export { appStateKey, fillGuestInfo, parseMrz, getTabId };
