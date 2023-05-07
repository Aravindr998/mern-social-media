import { createSlice } from "@reduxjs/toolkit"

const initialState = null

const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    addOffer: (state, action) => {
      return action.payload
    },
  },
})

export default offerSlice.reducer

export const { addOffer } = offerSlice.actions
