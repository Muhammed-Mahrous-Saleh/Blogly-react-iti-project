import { toast } from "react-toastify";

export const notify = (msg, msgType) => toast(msg, { type: msgType });
