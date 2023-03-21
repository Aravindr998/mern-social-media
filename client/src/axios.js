import axios from "axios"
import { baseURL } from "./constants/constant"

const instance = axios.create({
  baseURL,
})

export default instance
