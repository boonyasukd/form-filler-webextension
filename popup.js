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
        mrz: function(newVal, oldVal) {
            if (newVal) this.parseMrz();
        }
    },
    methods: {
        goToPassport: function() {
            this.reset();
            this.currentTab = 'passport';
        },
        goToThaiId: function() {
            this.reset();
            this.currentTab = 'thaiId';
        },
        fetchData: async function() {
            try {
                this.loading = true;
                const res = await fetch('http://localhost:8080/card');
                this.loading = false;
                if (res.ok) {
                    this.thaiId = await res.json();
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
        fillForm: function() {
            let script;

            if (this.currentTab == 'passport') {
                script = `
document.getElementById("first_name_primary").value = '${this.passport["First Name"]}';
document.getElementById("last_name_primary").value = '${this.passport["Last Name"]}';
document.getElementById("guest_label_birthday_primary").value = '${this.passport["DOB"]}';
document.getElementById("guest_document_type").value = 'passport';
document.getElementById("guest_document_number_primary").value = '${this.passport["Passport"]}';
document.getElementById("guest_country").value = '${this.passport["Nationality"]}';
document.getElementById("guest_document_issuing_country").value = '${this.passport["Nationality"]}';
document.getElementById("document_expiration_date_primary").value = '${this.passport["Expiry"]}';
${genXpath('//label[.="Sex"]/../input')}.value = '${this.passport["Sex"]}';`;
            } else {
                script = `
document.getElementById("first_name_primary").value = '${this.thaiId["First Name"]}';
document.getElementById("last_name_primary").value = '${this.thaiId["Last Name"]}';
document.getElementById("guest_label_birthday_primary").value = '${this.thaiId["DOB"]}';
document.getElementById("guest_document_type").value = 'dni';
document.getElementById("guest_document_number_primary").value = '${this.thaiId["ID"]}';
document.getElementById("guest_country").value = 'TH';
document.getElementById("guest_document_issuing_country").value = 'TH';
document.getElementById("guest_document_issue_date_primary").value = '${this.thaiId["Issue"]}';
document.getElementById("document_expiration_date_primary").value = '${this.thaiId["Expiry"]}';
document.getElementById("guest_address1_primary").value = '${this.thaiId["Address"]}';
${genXpath('//label[.="Sex"]/../input')}.value = '${this.thaiId["Sex"]}';`;
            }

            console.log(script);
            chrome.tabs.executeScript({ code: script });
        },
        reset: function() {
            this.invalid = false;
            this.loading = false;

            this.mrz = null;
            this.passport = null;
            this.thaiId = null;
        },
    },
});