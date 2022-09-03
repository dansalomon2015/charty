import styled from "styled-components/native";
import { Colors, FontFamily, FontSize, rem, ren } from "@utils";

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
    fontWeight?: number;
}

export const Text = styled.Text<Props>`
    font-family: ${FontFamily.Regular};
    color: ${(props) => props.color || "#000"};
    margin-right: ${(props) => props.mr || 0}px;
    margin-left: ${(props) => props.ml || 0}px;
    margin-top: ${(props) => props.mt || 0}px;
    margin-bottom: ${(props) => props.mb || 0}px;
    line-height: ${(props) => props.lineHeight || 24}px;
    text-align: ${(props) => props.textAlign || "left"};
    letter-spacing: ${(props) => props.letterSpacing || 0.15}px;
    color: ${(props) => props.color || Colors.white};
    font-size: ${(props) => props.fontSize || FontSize.body_1}px;
`;
