import React, { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import theme from '../../constants/theme';
import ChartTooltip from './ChartTooltip';

export default function InteractiveHorizontalBarChart({
  data,
  barColor = theme.colors.cyan,
  valueFormatter = (value) => String(value),
}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [containerHeight, setContainerHeight] = useState(220);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const maxValue = useMemo(() => Math.max(...data.map((item) => item.value), 1), [data]);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const rowLayouts = useRef({});

  const setActive = (index) => {
    setActiveIndex(index);
    Animated.timing(tooltipOpacity, {
      toValue: index === null ? 0 : 1,
      duration: 140,
      useNativeDriver: true,
    }).start();
  };

  const activeRowLayout = activeIndex !== null ? rowLayouts.current[activeIndex] : null;
  const tooltipTop = activeRowLayout
    ? Math.max(
        0,
        Math.min(
          containerHeight - tooltipHeight,
          activeRowLayout.y + activeRowLayout.height / 2 - tooltipHeight / 2
        )
      )
    : 0;

  return (
    <Pressable style={styles.container} onPress={() => setActive(null)} onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height)}>
      {activeIndex !== null && (
        <Animated.View
          style={[styles.tooltipWrap, { top: tooltipTop, opacity: tooltipOpacity }]}
          onLayout={(event) => setTooltipHeight(event.nativeEvent.layout.height)}
        >
          <ChartTooltip
            title={data[activeIndex]?.label}
            value={valueFormatter(data[activeIndex]?.value)}
            accentColor={barColor}
          />
        </Animated.View>
      )}
      <View style={styles.rows}>
        {data.map((item, index) => {
          const widthPercent = `${Math.max((item.value / maxValue) * 100, 10)}%`;
          const active = activeIndex === index;
          const faded = activeIndex !== null && !active;

          return (
            <View
              key={item.label}
              style={styles.row}
              onLayout={(event) => {
                rowLayouts.current[index] = event.nativeEvent.layout;
              }}
            >
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Pressable style={styles.track} hitSlop={10} onPress={() => setActive(active ? null : index)}>
                <View
                  style={[
                    styles.fill,
                    { width: widthPercent, backgroundColor: item.color || barColor, opacity: faded ? 0.28 : 1, shadowColor: item.color || barColor },
                    active && styles.fillActive,
                  ]}
                />
              </Pressable>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 220,
    justifyContent: 'flex-end',
  },
  tooltipWrap: {
    position: 'absolute',
    right: 0,
    zIndex: 2,
  },
  rows: {
    gap: 18,
    paddingTop: 40,
  },
  row: {
    gap: 8,
  },
  rowLabel: {
    color: theme.colors.textSecondary,
    ...theme.typography.captionStrong,
  },
  track: {
    height: 14,
    borderRadius: 8,
    backgroundColor: '#ECFEFF',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  fillActive: {
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
});
