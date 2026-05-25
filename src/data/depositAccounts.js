export const STORE_CONTACTS = ['010-3889-3947', '010-5153-3833'];

export const DEPOSIT_ACCOUNTS = {
  officialGoods: {
    label: '공식굿즈',
    bankName: '국민은행',
    accountNumber: '94320200717319',
    holder: '이이학',
  },
  thornBloomGoods: {
    label: '키링, 스티커, 티셔츠',
    bankName: '카카오뱅크',
    accountNumber: '3333189851301',
    holder: '이승현',
  },
};

const isOfficialGoodsItem = (item) => {
  const itemName = `${item?.name || item?.itemName || ''}`.toLowerCase();
  const creator = `${item?.creator || ''}`.toLowerCase();
  const teamName = `${item?.teamName || ''}`.toLowerCase();

  return item?.id === 1
    || item?.itemId === 1
    || itemName.includes('echo bag')
    || itemName.includes('reversible')
    || creator.includes('official')
    || teamName.includes('official');
};

export const getDepositAccountForItems = (items = []) => {
  const hasOfficialGoods = items.some(isOfficialGoodsItem);
  return hasOfficialGoods ? DEPOSIT_ACCOUNTS.officialGoods : DEPOSIT_ACCOUNTS.thornBloomGoods;
};

export const formatStoreContacts = () => STORE_CONTACTS.join(' / ');
