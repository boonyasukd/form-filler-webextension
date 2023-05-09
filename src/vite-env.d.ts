/// <reference types="vite/client" />

declare type WritableNode = HTMLInputElement | HTMLSelectElement;

declare type Sex = 'M' | 'F';

declare type GuestInfo = {
  docType: 'dni' | 'passport';
  docNum: string;

  firstName: string;
  lastName: string;
  dob: string;
  alpha2: string;
  issue: string;
  expiry: string;
  sex: Sex;
  address: string;
};

declare type Mrz = {
  documentCode: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  documentNumberCheckDigit: string;
  nationality: string;
  sex: string;
  expirationDate: string;
  expirationDateCheckDigit: string;
  personalNumber: string;
  personalNumberCheckDigit: string;
  birthDate: string;
  birthDateCheckDigit: string;
  issuingState: string;
  compositeCheckDigit: string;
};

declare type AppState = {
  guestInfo: Partial<GuestInfo>;
  loading: boolean;
  selectedText: string;
  mrz1: string;
  mrz2: string;
  activeTab: number;
  fileURL: string;
};
