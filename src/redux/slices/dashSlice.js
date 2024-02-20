import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isBottomSheetOpen: false,
  productDetialsData: null,
  menuCateogryList: null,
  categorySelect: null,
  screenType: null,
  addressDetail: null,
  billingAddress: null,
  deliveryAddress: null,
  stateImage: null,
  refresh: null,
  paymentClick: false,
  orderUniqueId: null,
  cartToAddress: null,
  cartNumber: 0,
};

const dashSlice = createSlice({
  initialState,
  name: 'dash',
  reducers: {
    bottomSheetControl(state, action) {
      state.isBottomSheetOpen = action.payload;
    },
    productSlugDetials(state, action) {
      state.productDetialsData = action.payload;
    },
    categoryListed(state, action) {
      state.menuCateogryList = action.payload;
    },
    selectedCategory(state, action) {
      state.categorySelect = action.payload;
    },
    selectScreenType(state, action) {
      state.screenType = action.payload;
    },
    selectAddressType(state, action) {
      state.addressDetail = action.payload;
    },
    cartBillingAddress(state, action) {
      state.billingAddress = action.payload;
    },
    cartDeliveryAddress(state, action) {
      state.deliveryAddress = action.payload;
    },
    uploadPic(state, action) {
      state.stateImage = action.payload;
      state.refresh = Math.random();
    },
    paymentEvent(state, action) {
      state.paymentClick = action.payload;
    },
    orderIdFunc(state, action) {
      state.orderUniqueId = action.payload;
    },
    fromCartToAddress(state, action) {
      state.cartToAddress = action.payload;
    },
    updateCartNumber(state, action) {
      state.cartNumber = action.payload;
    },
  },
});
export const {
  bottomSheetControl,
  productSlugDetials,
  categoryListed,
  selectedCategory,
  selectScreenType,
  selectAddressType,
  cartBillingAddress,
  cartDeliveryAddress,
  uploadPic,
  paymentEvent,
  orderIdFunc,
  fromCartToAddress,
  updateCartNumber,
} = dashSlice.actions;

export default dashSlice.reducer;
