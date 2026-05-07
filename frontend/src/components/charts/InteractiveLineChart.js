import React, { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import theme from '../../constants/theme';
import ChartTooltip from './ChartTooltip';

function buildLinePath(points) {
  if (!points.length) {
    return '';
  }

  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

export default function InteractiveLineChart({
  data,
  height = 220,
  color = theme.colors.purple,
  fill = null,
  valueFormatter = (value) => String(value),
}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [chartWidth, setChartWidth] = useState(300);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const chartHeight = height - 30;
  const paddingX = 20;
  const paddingTop = 16;
  const maxValue = useMemo(() => Math.max(...data.map((item) => item.value), 1), [data]);
  const minValue = useMemo(() => Math.min(...data.map((item) => item.value), 0), [data]);
  const range = Math.max(maxValue - minValue, 1);

  const points = data.map((item, index) => {
    const x = paddingX + (index * (chartWidth - paddingX * 2)) / Math.max(data.length - 1, 1);
    const normalized = (item.value - minValue) / range;
    const y = paddingTop + (chartHeight - normalized * (chartHeight - paddingTop));
    return { ...item, x, y };
  });

  const linePath = buildLinePath(points);
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight + 8} L ${points[0].x} ${chartHeight + 8} Z`
    : '';
  const activePoint = activeIndex !== null ? points[activeIndex] : null;

  const setActive = (index) => {
    setActiveIndex(index);
    Animated.timing(tooltipOpacity, {
      toValue: index === null ? 0 : 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const x = event.nativeEvent.locationX;
          const nearestIndex = points.reduce(
            (closest, point, index) =>
              Math.abs(point.x - x) < Math.abs(points[closest].x - x) ? index : closest,
            0
          );
          setActive(nearestIndex);
        },
        onPanResponderMove: (event) => {
          const x = event.nativeEvent.locationX;
          const nearestIndex = points.reduce(
            (closest, point, index) =>
              Math.abs(point.x - x) < Math.abs(points[closest].x - x) ? index : closest,
            0
          );
          if (nearestIndex !== activeIndex) {
            setActive(nearestIndex);
          }
        },
        onPanResponderRelease: () => {},
        onPanResponderTerminate: () => {},
      }),
    [activeIndex, points]
  );

  const tooltipLeft = activePoint
    ? Math.max(8, Math.min(chartWidth - 108, activePoint.x - 54))
    : 8;

  return (
    <Pressable style={[styles.container, { height: height + 58 }]} onPress={() => setActive(null)}>
      {activeIndex !== null && activePoint && (
        <Animated.View style={[styles.tooltipWrap, { left: tooltipLeft, opacity: tooltipOpacity }]}>
          <ChartTooltip
            title={data[activeIndex]?.title || data[activeIndex]?.name}
            label={data[activeIndex]?.label}
            subtitle={data[activeIndex]?.subtitle}
            value={valueFormatter(data[activeIndex]?.value)}
            accentColor={color}
          />
        </Animated.View>
      )}
      <View style={styles.chartFrame} onLayout={(event) => setChartWidth(Math.max(240, event.nativeEvent.layout.width - 16))}>
        <View style={styles.touchSurface} {...panResponder.panHandlers}>
        <Svg width={chartWidth} height={height} viewBox={`0 0 ${chartWidth} ${height}`}>
          <Line x1={paddingX} y1={chartHeight + 8} x2={chartWidth - paddingX} y2={chartHeight + 8} stroke="#E5E7EB" strokeWidth={1} />
          {!!fill && <Path d={areaPath} fill={fill} />}
          <Path d={linePath} stroke={color} strokeWidth={3} fill="none" />
          {activePoint && <Line x1={activePoint.x} y1={paddingTop} x2={activePoint.x} y2={chartHeight + 8} stroke={color} strokeOpacity={0.18} strokeWidth={2} />}
          {points.map((point) => (
            <Circle key={point.label} cx={point.x} cy={point.y} r={activePoint?.label === point.label ? 6 : 4.5} fill={color} />
          ))}
        </Svg>
        </View>

        <View style={[styles.pointsOverlay, { width: chartWidth }]}>
          {points.map((point, index) => (
            <Pressable
              key={point.label}
              style={[
                styles.touchPoint,
                {
                  left: point.x,
                  top: point.y + 16,
                },
              ]}
              onPress={() => setActive(activeIndex === index ? null : index)}
              onPressIn={() => setActive(index)}
              hitSlop={12}
            />
          ))}
        </View>

        <View style={styles.labelsRow}>
          {data.map((item) => (
            <Text key={item.label} style={styles.xLabel}>
              {item.label}
            </Text>
          ))}
        </View>
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
    width: 108,
    zIndex: 2,
  },
  chartFrame: {
    paddingTop: 44,
    alignItems: 'center',
  },
  touchSurface: {
    paddingHorizontal: 8,
  },
  pointsOverlay: {
    position: 'absolute',
    top: 44,
    bottom: 0,
    alignSelf: 'center',
  },
  touchPoint: {
    position: 'absolute',
    width: 26,
    height: 26,
    marginLeft: -13,
    marginTop: -13,
    borderRadius: 13,
    backgroundColor: 'transparent',
  },
  labelsRow: {
    marginTop: -10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xLabel: {
    color: theme.colors.textSecondary,
    ...theme.typography.caption,
  },
});
