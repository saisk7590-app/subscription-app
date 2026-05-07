import React, { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import theme from '../../constants/theme';
import ChartTooltip from './ChartTooltip';

export default function InteractiveBarChart({ data, height = 220, barColor = theme.colors.primary, valueFormatter = (value) => String(value) }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const maxValue = useMemo(() => Math.max(...data.map((item) => item.value), 1), [data]);
  const [chartWidth, setChartWidth] = useState(0);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  const setActive = (index) => {
    setActiveIndex(index);
    Animated.timing(tooltipOpacity, {
      toValue: index === null ? 0 : 1,
      duration: 140,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          if (!chartWidth) {
            return;
          }
          const segmentWidth = chartWidth / data.length;
          const index = Math.max(0, Math.min(data.length - 1, Math.floor(event.nativeEvent.locationX / segmentWidth)));
          setActive(index);
        },
        onPanResponderMove: (event) => {
          if (!chartWidth) {
            return;
          }
          const segmentWidth = chartWidth / data.length;
          const index = Math.max(0, Math.min(data.length - 1, Math.floor(event.nativeEvent.locationX / segmentWidth)));
          setActive(index);
        },
        onPanResponderRelease: () => {},
        onPanResponderTerminate: () => {},
      }),
    [chartWidth, data.length]
  );

  const tooltipLeft = activeIndex !== null && chartWidth
    ? Math.max(8, Math.min(chartWidth - 92, (chartWidth / data.length) * activeIndex + chartWidth / data.length / 2 - 46))
    : 8;

  return (
    <Pressable style={[styles.container, { height: height + 52 }]} onPress={() => setActive(null)}>
      {activeIndex !== null && (
        <Animated.View style={[styles.tooltipWrap, { left: tooltipLeft, opacity: tooltipOpacity }]}>
          <ChartTooltip
            title={data[activeIndex]?.label}
            value={valueFormatter(data[activeIndex]?.value)}
            accentColor={barColor}
          />
        </Animated.View>
      )}
      <View
        style={[styles.chartArea, { height }]}
        onLayout={(event) => setChartWidth(event.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        {data.map((item, index) => {
          const barHeight = Math.max((item.value / maxValue) * (height - 20), 6);
          const active = activeIndex === index;
          const faded = activeIndex !== null && !active;

          return (
            <View key={item.label} style={styles.barGroup}>
              <Pressable onPress={() => setActive(active ? null : index)} hitSlop={10} style={styles.pressableBarWrap}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: item.color || barColor,
                      opacity: faded ? 0.32 : 1,
                      shadowColor: item.color || barColor,
                    },
                    active && styles.activeBar,
                  ]}
                />
              </Pressable>
              <Text style={styles.xLabel}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
  tooltipWrap: {
    position: 'absolute',
    top: 0,
    width: 92,
    zIndex: 2,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 44,
    paddingHorizontal: 8,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
  },
  pressableBarWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 36,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  activeBar: {
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    transform: [{ scaleX: 1.04 }, { scaleY: 1.03 }],
  },
  xLabel: {
    marginTop: 10,
    color: theme.colors.textSecondary,
    ...theme.typography.caption,
  },
});
