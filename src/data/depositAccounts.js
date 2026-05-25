export const STORE_CONTACTS = ['010-3889-3947', '010-5153-3833'];

export const STORE_DEPOSIT_ACCOUNT = {
  bankName: '국민은행',
  accountNumber: '43760201488414',
  holder: '신영록',
};

export const getDepositAccountForItems = () => STORE_DEPOSIT_ACCOUNT;

export const formatStoreContacts = () => STORE_CONTACTS.join(' / ');
