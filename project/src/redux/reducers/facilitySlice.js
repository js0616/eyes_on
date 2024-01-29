import { createSlice } from "@reduxjs/toolkit";

const facilitySlice = createSlice({
  name: 'facility',
  initialState: {
    floorRange: [],
    floorList: {},
    facilityList: [],
    abnormalList: [],
    currentFloor: '1F'
  },
  reducers: {
    setFloorRange: (state, action) => {
      state.floorRange = action.payload;
    },
    setFloorList: (state, action) => {
      state.floorList = action.payload;
    },
    setFacilityList: (state, action) => {
      state.facilityList = action.payload;
    },
    filteredAbnormalList: (state, action) => {
      state.abnormalList = state.facilityList.filter(fac => (action.payload).includes(fac.fac_situation));
    },
    setCurrentFloor: (state, action) => {
      state.currentFloor = action.payload;
    },
    setAbnormalList: (state, action) => {
      if ((state.abnormalList.filter(fac => fac.fac_num === action.payload.fac_num)).length === 0) {
        state.abnormalList.push(action.payload);
      }
    },
    setRVideoSituation: (state, action) => {
      state.facilityList[0].fac_situation = action.payload;
      state.abnormalList = state.abnormalList.filter(fac => fac.fac_num !== 1)
    },
  },
});

export default facilitySlice.reducer;
export const facilityReducer = facilitySlice.actions;