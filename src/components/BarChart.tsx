import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Alert,
    StyleSheet,
    ViewProps,
    Easing,
    Animated,
    TouchableOpacity,
    ViewStyle,
    TextStyle,
} from "react-native";
import { ren, Colors, rem, FontSize, entireScreenWidth } from "@utils";
import { Text, TextBold, TextMedium } from "@components";
import LinearGradient from "react-native-linear-gradient";

const Y_AXIS_UNIT = 25 * ren;
const Y_AXIS_LINE_HEIGHT = 16 * rem;
const X_AXIS_INTERVAL = 25 * rem;
const BAR_CHART_WIDTH = 27 * rem;
const Y_AXIS_REAL_UNIT = Y_AXIS_UNIT - Y_AXIS_LINE_HEIGHT;
const GRAPH_WIDTH = entireScreenWidth - 32 * rem;

interface Props extends ViewProps {
    labels: string[];
    values: number[];
    budget?: number;
    scale?: number;
}

export const BarChart: React.FC<Props> = ({ labels, values, budget, scale = 1 }) => {
    const [selected, setSelected] = useState<number>();

    const getMax = (): number => {
        return Math.max(...values);
    };

    const getScale = (): number => {
        let value = getMax() / scale;
        switch (true) {
            case value < 0:
                return 1;
            case value < 100:
                return 20;
            case value < 10000:
                return 5000;
            case value < 40000:
                return 10000;
            case value < 100000:
                return 20000;
            case value < 300000:
                return 50000;
            case value < 600000:
                return 100000;
            default:
                return 200000;
        }
    };

    const getTopAxis = (): number => {
        return Math.ceil(getMax() / scale / getScale()) * getScale();
    };

    const getLevels = (): number => {
        return getTopAxis() / getScale() + 1;
    };

    const select = (index: number) => {
        setSelected(index);
    };

    const getBarValue = (amount: number): number => {
        return (amount / (getScale() * scale)) * Y_AXIS_UNIT;
    };

    useEffect(() => {
        if (!(labels.length == values.length)) Alert.alert("Data sizes does not match");
    }, [labels, values]);

    return (
        <View>
            <View style={[styles.chart]}>
                {Array.from(Array(getLevels()).keys())
                    .reverse()
                    .map((l, i) => {
                        return <YAxis value={l * getScale()} key={i} />;
                    })}

                {Array.from(Array(values.length).keys()).map((_, index) => {
                    return (
                        <Bar
                            value={getBarValue(values[index])}
                            index={index}
                            label={labels[index]}
                            key={index}
                            onPress={() => select(index)}
                            selected={index == selected}
                        />
                    );
                })}
                {!!budget && (
                    <View style={[styles.budget, { bottom: getBarValue(budget) }]}>
                        <YAxis hideLabel value={budget} lineStyle={{ backgroundColor: Colors.primary_900 }} />
                    </View>
                )}
            </View>
        </View>
    );
};

// ---- YAXIS COmponent -------- Start ---------------------------------- //
interface yProps {
    value: number;
    lineStyle?: ViewStyle;
    labelStyle?: TextStyle;
    hideLabel?: boolean;
}

const YAxis: React.FC<yProps> = ({ value, lineStyle, labelStyle, hideLabel }) => {
    const getLabel = () => {
        if (!value) return 0;
        if (value >= 1000) return value / 1000 + "k";
        if (value >= 100) return value / 10 + "k";
        return value;
    };

    return (
        <View style={styles.y_axis}>
            <View style={styles.y_label_container}>
                {!hideLabel && (
                    <TextBold
                        fontSize={FontSize.caption_1}
                        numberOfLines={1}
                        lineHeight={Y_AXIS_LINE_HEIGHT}
                        color={Colors.black_38}
                        letterSpacing={0.4 * rem}
                        style={labelStyle}
                    >
                        {getLabel()}
                    </TextBold>
                )}
            </View>
            <View style={[styles.y_axis_line, lineStyle]}></View>
        </View>
    );
};
// ---- YAXIS COmponent -------- End ---------------------------------- //

// ---- Bar COmponent -------- start ---------------------------------- //

interface BarProps {
    value: number;
    index: number;
    label: string;
    selected?: boolean;
    onPress: () => void;
}

const Bar: React.FC<BarProps> = ({ value, index, label, selected, onPress }) => {
    const scaleBar = useRef(new Animated.Value(1)).current;
    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

    useEffect(() => {
        scaleBar.setValue(1);
        Animated.timing(scaleBar, {
            toValue: value * 2,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    }, []);

    const getLeft = () => {
        return (index + 1) * X_AXIS_INTERVAL + index * BAR_CHART_WIDTH;
    };

    return (
        <View style={[styles.bar_chart, { left: getLeft() }, selected ? styles.selected_bar : null]}>
            <View style={{ height: value, overflow: "hidden" }}>
                <View style={[{ bottom: -value, height: value }, styles.bar_container]}>
                    <AnimatedTouchable onPress={onPress} style={[styles.bar, { transform: [{ scaleY: scaleBar }] }]}>
                        <LinearGradient
                            colors={[Colors.bar_chart_gradient_1, Colors.bar_chart_gradient_2]}
                            style={{ height: "100%" }}
                            locations={[0.1, 0.5]}
                        ></LinearGradient>
                    </AnimatedTouchable>
                </View>
            </View>
            {selected ? (
                <TextMedium
                    textAlign="center"
                    fontSize={FontSize.caption_1}
                    lineHeight={16 * rem}
                    color={Colors.primary_900}
                    letterSpacing={0.1 * rem}
                >
                    {label}
                </TextMedium>
            ) : (
                <Text
                    textAlign="center"
                    fontSize={FontSize.caption_2}
                    lineHeight={16 * rem}
                    color={Colors.black_38}
                    letterSpacing={0.4 * rem}
                >
                    {label}
                </Text>
            )}
        </View>
    );
};

// ---- YAXIS COmponent -------- end ---------------------------------- //

const styles = StyleSheet.create({
    chart: {
        width: GRAPH_WIDTH,
        alignItems: "center",
        paddingEnd: 15,
    },
    y_axis: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: Y_AXIS_REAL_UNIT,
    },
    y_axis_line: {
        height: 1 * ren,
        backgroundColor: Colors.primary_050,
        flex: 1,
    },
    bar: {
        // backgroundColor : Colors.secondary_900,
        height: 1,
        borderRadius: 2,
        zIndex: 100,
    },
    bar_chart: {
        position: "absolute",
        width: BAR_CHART_WIDTH,
        bottom: -9,
    },
    bar_container: {
        position: "absolute",
        left: 0,
        width: BAR_CHART_WIDTH,
    },
    selected_bar: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    budget: {
        position: "absolute",
        left: 0,
        width: GRAPH_WIDTH,
    },
    y_label_container: {
        width: 30 * rem,
        height: Y_AXIS_LINE_HEIGHT,
    },
});
