import styled from "styled-components/native";
import { Colors, FontFamily, rem, ren } from "@utils";

enum TextAlign {
    LEFT = "left",
    RIGHT = "right",
    CENTER = "center",
}

interface Props {
    color?: string;
    fontSize?: number;
    mr?: number;
    ml?: number;
    mt?: number;
    mb?: number;
    lineHeight?: number;
    textAlign?: `${TextAlign}`;
    letterSpacing?: number;
}

export const TextBold = styled.Text<Props>`
    font-family: ${FontFamily.Bold};
    color: ${(props) => props.color || Colors.white};
    font-size: ${(props) => props.fontSize || 14 * rem}px;
    margin-right: ${(props) => props.mr || 0}px;
    margin-left: ${(props) => props.ml || 0}px;
    margin-top: ${(props) => props.mt || 0}px;
    margin-bottom: ${(props) => props.mb || 0}px;
    line-height: ${(props) => props.lineHeight || 24 * ren}px;
    text-align: ${(props) => props.textAlign || "left"};
    letter-spacing: ${(props) => props.letterSpacing || 0.15 * ren}px;
`;
