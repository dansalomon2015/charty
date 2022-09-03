import { Dimensions } from "react-native";

export const entireScreenWidth = Dimensions.get("window").width;
export const entireScreenHeight = Dimensions.get("window").height;

export const rem = entireScreenWidth / 360 < 1.5 ? entireScreenWidth / 360 : 1.5;
export const ren = entireScreenHeight / 640 < 1.5 ? entireScreenHeight / 640 : 1.5;

export const IPHONE12_H = 844;
export const IPHONE12_Max = 926;
export const IPHONE12_Mini = 780;
