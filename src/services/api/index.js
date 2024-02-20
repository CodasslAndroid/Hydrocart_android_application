import axios from 'axios';
import {API} from '../../constants';
import {API_KEY} from '../../constants/keys';
import requests, {createAxiosInstance} from './axiosConfig';

export function login(data) {
  return requests.post(API.authUrls.login, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function signUp(data) {
  return requests.post(API.authUrls.signUp, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}
export function getSmsList() {
  return requests.get(API.authUrls.smsList, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function sendSmscall(data) {
  return requests.post(API.authUrls.sendSms, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function sendSms(url) {
  return axios.get(url);
}

export function login_verify(data) {
  return requests.post(API.authUrls.login_otp, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function signUpCheck(data) {
  return requests.post(API.authUrls.signUpCheck, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function passwordResetApi(data) {
  return axios.post(
    API.baseUrls[API.currentEnv] + API.authUrls.generateOtp,
    data,
    {
      headers: {
        'api-key': API_KEY,
        'Content-type': 'multipart/form-data',
      },
    },
  );
}

export function otpVerifyApi(data) {
  return axios.post(
    API.baseUrls[API.currentEnv] + API.authUrls.optVerify,
    data,
    {
      headers: {
        'api-key': API_KEY,
        'Content-type': 'multipart/form-data',
      },
    },
  );
}

export function setPassswordApi(data) {
  return axios.post(
    API.baseUrls[API.currentEnv] + API.authUrls.resetPassword,
    data,
    {
      headers: {
        'api-key': API_KEY,
        'Content-type': 'multipart/form-data',
      },
    },
  );
}

export function productMenu() {
  return requests.get(API.authUrls.menu, {
    Authorization: API.Authorization,
    // 'Content-type': 'multipart/form-data',
  });
}

export function BannerImage() {
  return requests.get(API.authUrls.bannerSlider, {
    Authorization: API.Authorization,
    // 'Content-type': 'multipart/form-data',
  });
}

export function getProducts(data) {
  return requests.post(API.authUrls.products_group, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function productDetails(data) {
  return requests.post(API.authUrls.products_group_detail, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function addWhislist(data) {
  return requests.post(API.authUrls.addWhislist, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function delWhislist(data) {
  return requests.post(API.authUrls.delWishlist, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function addToCart(data) {
  return requests.post(API.authUrls.addToCart, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function delCart(data) {
  return requests.post(API.authUrls.delCart, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getWislist(data) {
  return requests.post(API.authUrls.getWishlist, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function clearWislist(data) {
  return requests.post(API.authUrls.clearWishlist, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getCartList(data) {
  return requests.post(API.authUrls.getCart, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function clearCart(data) {
  return requests.post(API.authUrls.clearCart, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getAddressList(data) {
  return requests.post(API.authUrls.addressList, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getStateList(data) {
  return requests.post(API.authUrls.state, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getCityList(data) {
  return requests.post(API.authUrls.city, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getTypeList() {
  return requests.get(API.authUrls.getAddressTypeList, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function addAddressApi(data) {
  return requests.post(API.authUrls.addAddress, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function delAddressApi(data) {
  return requests.post(API.authUrls.delAddress, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function editAddress(data) {
  return requests.post(API.authUrls.editAddress, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getSellerNo() {
  return requests.get(API.authUrls.seller, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function setDefaultAddress(data) {
  return requests.post(API.authUrls.setDefaultAddress, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getDefaultAddress(data) {
  return requests.post(API.authUrls.getDefaultAddress, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getPaymentListApi(data) {
  return requests.get(API.authUrls.getPaymentList, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function OrderConfirmApi(data) {
  return requests.post(API.authUrls.orderConfirm, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getProfile(data) {
  return requests.post(API.authUrls.getProfile, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function setProfile(data) {
  return requests.post(API.authUrls.setProfile, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function billdeskJwtEncode(data) {
  return requests.post(API.authUrls.jwtEncode, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function orderConfirmPaymentApi(data) {
  return requests.post(API.authUrls.orderConfirmPayment, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getOrderList(data) {
  return requests.post(API.authUrls.getOrderList, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function orderDetailApi(data) {
  return requests.post(API.authUrls.getOrderDetail, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getCompanyData() {
  return requests.get(API.authUrls.companyData, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getSuggestionList(data) {
  return requests.post(API.authUrls.suggestionList, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function policyPageApi() {
  return requests.get(API.authUrls.pages, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function billdeskApi(data) {
  return requests.post(API.authUrls.billdesk, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function billDeskResponseApi(data) {
  return requests.post(API.authUrls.billdeskResponse, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getPincodeAddress(data) {
  return requests.post(API.authUrls.pincodeApi, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getCartTotalAmount(data) {
  return requests.post(API.authUrls.getCartTotal, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getOrderStatus(data) {
  return requests.post(API.authUrls.orderStatus, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function getOrderYear(data) {
  return requests.post(API.authUrls.orderYear, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function callCancelApi(data) {
  return requests.post(API.authUrls.orderCancel, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}

export function deleteAccountApi(data) {
  return requests.post(API.authUrls.deleteAccount, data, {
    Authorization: API.Authorization,
    'Content-type': 'multipart/form-data',
  });
}
