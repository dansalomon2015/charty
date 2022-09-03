import React, { ReactNode } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Svg, { G, Circle } from "react-native-svg";
import { rem, Colors, entireScreenWidth as SW, FontSize } from "@utils";
import { Text, TextBold } from "@components";

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STROKE_WIDTH = 15 * rem;
const INTERVAL = 4 * rem;
const PIE_WIDTH = 180;
const LABEL_SIZE = 14;

interface Props {
    data: Array<{ amount: number; color: string }>;
    content?: ReactNode;
}

export const PieChart: React.FC<Props> = ({ data, content }) => {
    const getExpenses = (): number => {
        let s = 0;
        data.forEach((e) => {
            s += e.amount;
        });
        return s;
    };

    const getItemOffset = (amount: number): number => {
        const percentage = (amount / getExpenses()) * 100;
        return CIRCUMFERENCE * (1 - percentage / 100) + INTERVAL;
    };

    const getRotation = (i: number): number => {
        let total = 0;

        for (let index = 0; index < i; index++) {
            total += data[index].amount;
        }

        return (total / getExpenses()) * 360;
    };

    const getLabel = (amount: number): string => {
        if (!amount) return "";

        return Math.ceil((amount * 100) / getExpenses()) + "%";
    };

    const getAngle = (amount: number, offset: number = 10): number => {
        const percentage = (amount / getExpenses()) * 100;
        //Longueur of an arc
        let radius = PIE_WIDTH / 2;
        let arc = (2 * Math.PI * radius * percentage) / 100 + INTERVAL;
        return (arc * 360) / (2 * Math.PI * radius);
    };

    const tangent = (angle: number): number => {
        return Math.tan((angle * Math.PI) / 180);
    };

    const getLabelPosition = (i: number): ViewStyle | undefined => {
        let current_expenses = 0;
        for (let index = 0; index <= i; index++) {
            current_expenses += data[index].amount;
        }

        let full_angle = getAngle(current_expenses);
        let arc_angle = getAngle(data[i].amount);

        let alpha = full_angle - (arc_angle * 4) / 7;

        console.log("-------------------------------------------------------");
        console.log("Angle - ", i, full_angle, arc_angle, alpha);

        if (alpha < 45) {
            let y = (PIE_WIDTH / 2) * Math.abs(tangent(alpha));
            return { bottom: PIE_WIDTH / 2 - y - LABEL_SIZE / 2, right: alpha < 30 ? -25 : -10 };
        }

        if (alpha < 90) {
            let x = (PIE_WIDTH / 2) * Math.abs(tangent(90 - alpha));
            console.log("x ", x, tangent(alpha));
            return { bottom: alpha < 65 ? -12 : -20, right: PIE_WIDTH / 2 - x - LABEL_SIZE / 2 };
        }

        if (alpha < 135) {
            let x = (PIE_WIDTH / 2) * Math.abs(tangent(alpha - 90));
            console.log("x ", x, tangent(alpha - 90));
            return { bottom: alpha < 120 ? -20 : -10, left: PIE_WIDTH / 2 - x - LABEL_SIZE / 2 };
        }

        if (alpha < 180) {
            let y = (PIE_WIDTH / 2) * Math.abs(tangent(180 - alpha));
            return { bottom: PIE_WIDTH / 2 - y - LABEL_SIZE / 2, left: alpha < 155 ? -10 : -30 };
        }

        if (alpha < 225) {
            let y = (PIE_WIDTH / 2) * Math.abs(tangent(alpha - 180));
            return { top: PIE_WIDTH / 2 - y - LABEL_SIZE / 2, left: alpha < 205 ? -30 : -20 };
        }

        if (alpha < 270) {
            let x = (PIE_WIDTH / 2) * Math.abs(tangent(270 - alpha));
            return { top: alpha < 248 ? -10 : -20, left: PIE_WIDTH / 2 - x - LABEL_SIZE / 2 };
        }

        if (alpha < 315) {
            let x = (PIE_WIDTH / 2) * Math.abs(tangent(alpha - 270));
            return { top: alpha < 295 ? -20 : -10, right: PIE_WIDTH / 2 - x - LABEL_SIZE / 2 };
        }

        if (alpha <= 360) {
            let y = (PIE_WIDTH / 2) * Math.abs(tangent(360 - alpha));
            return { top: PIE_WIDTH / 2 - y - LABEL_SIZE / 2, right: alpha < 330 ? (alpha < 316 ? 0 : -10) : -25 };
        }
    };

    return (
        <View style={styles.container}>
            {data.map((arc, i) => {
                if (arc.amount)
                    return (
                        <View style={[styles.graphWrapper, { zIndex: 10 * i }]} key={i}>
                            <Arc color={arc.color} rotation={getRotation(i)} offset={getItemOffset(arc.amount)} />
                        </View>
                    );
            })}
            {data.map((arc, i) => {
                if (arc.amount)
                    return (
                        <View style={[{ position: "absolute" }, getLabelPosition(i)]} key={i}>
                            <TextBold fontSize={FontSize.caption_2} color={Colors.primary_900} lineHeight={LABEL_SIZE}>
                                {getLabel(arc.amount)}
                            </TextBold>
                        </View>
                    );
            })}
            {!content && (
                <View>
                    <Text textAlign="center" color={Colors.primary_700} fontSize={FontSize.caption_4} mb={-8}>
                        Total
                    </Text>
                    <Text textAlign="center" color={Colors.primary_900} fontSize={FontSize.caption_2}>
                        {getExpenses()} USD
                    </Text>
                </View>
            )}
            {content}
        </View>
    );
};

interface IProps {
    color: string;
    rotation: number;
    offset: number;
}

const Arc: React.FC<IProps> = ({ color, rotation, offset }) => {
    return (
        <Svg height={180} width={180} viewBox="0 0 180 180" style={styles.shadow}>
            <G rotation={0} originX="90" originY="90">
                <Circle
                    cx="50%"
                    cy="50%"
                    r={RADIUS}
                    stroke={color}
                    fill="transparent"
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={offset}
                    rotation={rotation}
                    originX="90"
                    originY="90"
                />
            </G>
        </Svg>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        height: PIE_WIDTH,
        width: PIE_WIDTH,
        marginLeft: (SW - PIE_WIDTH - STROKE_WIDTH * 2) / 2,
    },
    graphWrapper: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: 0,
        top: 0,
    },
    shadow: {
        // shadowColor: "#000",
        // shadowOffset: {
        //   width: 0,
        //   height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
    },
});
