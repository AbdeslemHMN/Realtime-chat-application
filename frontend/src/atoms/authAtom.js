import { atom } from "recoil";

const authScreenAtom = atom({
    key: "authScreenAtom",
    default: localStorage.getItem('authScreen') || 'login',
    });

export default authScreenAtom;