const formatDate = (input) => `${input.day}/${input.month}/${input.year}`;
const formatCountry = (countryAlpha3) => i18nIsoCountries.alpha3ToAlpha2(countryAlpha3);
const capitalizeFirstLetter = (string) => string.charAt(0) + string.slice(1).toLowerCase();
const genXpath = (expr) => `document.evaluate('${expr}', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue`;

new Vue({
  el: '#app',
  data: {
    loading: false,
    invalid: false,
    currentTab: 'thaiId',
    mrz: null,
    passport: null,
    thaiId: null,
  },
  watch: {
    mrz: function (newVal, oldVal) {
      if (newVal) this.parseMrz();
    }
  },
  methods: {
    goToPassport: function () {
      this.reset();
      this.currentTab = 'passport';
    },
    goToThaiId: function () {
      this.reset();
      this.currentTab = 'thaiId';
    },
    fetchData: async function () {
      try {
        this.loading = true;
        const res = await fetch('http://localhost:8080/card');
        this.loading = false;
        if (res.ok) {
          this.thaiId = await res.json();
          this.thaiId["DOB"] = formatDate(this.thaiId["DOB"]);
          this.thaiId["Issue"] = formatDate(this.thaiId["Issue"]);
          this.thaiId["Expiry"] = formatDate(this.thaiId["Expiry"]);
          console.log(this.thaiId);
        } else {
          throw new Error('Network response was not ok.');
        }
      } catch (err) {
        this.invalid = true;
        this.loading = false;
        console.log(err);
      }
    },
    parseMrz: function () {
      console.log('attempting to parse input...');
      try {
        const parsed = newtondevMrzParser.parse(this.mrz);
        console.log(parsed);
        this.passport = {
          "Passport": parsed.documentNumber,
          "First Name": parsed.names.names.map(capitalizeFirstLetter).join(' '),
          "Last Name": capitalizeFirstLetter(parsed.names.lastName),
          "DOB": formatDate(parsed.dob),
          "Nationality": formatCountry(parsed.nationality.abbr),
          "Expiry": formatDate(parsed.expiry),
          "Sex": parsed.sex.abbr
        };
      } catch (error) {
        this.invalid = true;
        console.log('error while performing action...');
        console.log(error);
      }
    },
    generateScript: function (extensionTab) {
      let script;

      if (extensionTab == 'passport') {
        script = `
document.getElementsByName("guest_first_name")[0].value = '${this.passport["First Name"]}';
document.getElementsByName("guest_last_name")[0].value = '${this.passport["Last Name"]}';
document.getElementsByName("guest_email")[0].value = 'no@gmail.com';
document.getElementsByName("guest_birthday")[0].value = '${this.passport["DOB"]}';
document.getElementsByName("guest_document_type")[0].value = 'passport';
document.getElementsByName("guest_document_number")[0].value = '${this.passport["Passport"]}';
document.getElementsByName("guest_country")[0].value = '${this.passport["Nationality"]}';
document.getElementsByName("guest_document_issuing_country")[0].value = '${this.passport["Nationality"]}';
document.getElementsByName("guest_document_expiration_date")[0].value = '${this.passport["Expiry"]}';
${genXpath('//label[contains(.,"Sex")]/..//input')}.value = '${this.passport["Sex"]}';`;
      } else {
        script = `
document.getElementsByName("guest_first_name")[0].value = '${this.thaiId["First Name"]}';
document.getElementsByName("guest_last_name")[0].value = '${this.thaiId["Last Name"]}';
document.getElementsByName("guest_email")[0].value = 'no@gmail.com';
document.getElementsByName("guest_birthday")[0].value = '${this.thaiId["DOB"]}';
document.getElementsByName("guest_document_type")[0].value = 'dni';
document.getElementsByName("guest_document_number")[0].value = '${this.thaiId["ID"]}';
document.getElementsByName("guest_country")[0].value = 'TH';
document.getElementsByName("guest_document_issuing_country")[0].value = 'TH';
document.getElementsByName("guest_document_issue_date")[0].value = '${this.thaiId["Issue"]}';
document.getElementsByName("guest_document_expiration_date")[0].value = '${this.thaiId["Expiry"]}';
document.getElementsByName("guest_address1")[0].value = '${this.thaiId["Address"]}';
${genXpath('//label[contains(.,"Sex")]/..//input')}.value = '${this.thaiId["Sex"]}';`;
      }
    
      return script;
    },
    fillForm: function () {
      const script = this.generateScript(this.currentTab);
      console.log(script);
      chrome.tabs.executeScript({ code: script });
    },
    reset: function () {
      this.invalid = false;
      this.loading = false;

      this.mrz = null;
      this.passport = null;
      this.thaiId = null;
    },
  },
});