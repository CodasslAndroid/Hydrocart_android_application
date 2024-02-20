import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  data: null,
  error: null,
  authDetails: null,
  otp: null,
  mobileNumber: null,
  type: null,
  fullName: null,
  userData: null,
  companyDetail: null,
  profileData: null,
  base64: null,
};

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    authToken(state, action) {
      state.authDetails = action.payload;
    },
    verifyUserData(state, action) {
      state.otp = action.payload.otp;
      state.mobileNumber = action.payload.mobileNumber;
      state.type = action.payload.type;
      state.fullName = action.payload.fullName;
    },
    verifiedUserData(state, action) {
      state.userData = action.payload;
    },
    companyDetailData(state, action) {
      state.companyDetail = action.payload;
    },
    profileDetailData(state, action) {
      state.profileData = action.payload;
    },
    imageToBase64(state, action) {
      state.base64 = action.payload;
    },
  },
});
export const {
  authToken,
  verifyUserData,
  verifiedUserData,
  companyDetailData,
  profileDetailData,
  imageToBase64,
} = authSlice.actions;

export default authSlice.reducer;
