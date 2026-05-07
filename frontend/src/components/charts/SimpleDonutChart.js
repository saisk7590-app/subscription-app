import React, { useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import theme from '../../constants/theme';
import ChartTooltip from './ChartTooltip';

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function createArcPath(cx, cy, outerRadius, innerRadius, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, outerRadius, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
  const startInner = polarToCartesian(cx, cy, innerRadius, endAngle);
  const endInner = polarToCartesian(cx, cy, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ');
}

export default function SimpleDonutChart({ data, size = 160, strokeWidth = 24, valueFormatter = (value) => String(value) }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;
  const outerRadius = size / 2;
  const innerRadius = outerRadius - strokeWidth;
  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
  let startAngle = 0;
  let activeMidAngle = 0;

  const setActive = (index) => {
    setActiveIndex(index);
    Animated.timing(tooltipOpacity, {
      toValue: index === null ? 0 : 1,
      duration: 140,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable style={styles.container} onPress={() => setActive(null)}>
      {activeIndex !== null && (
        <Animated.View
          style={[
            styles.tooltipWrap,
            {
              opacity: tooltipOpacity,
              transform: [
                {
                  translateX: Math.max(-42, Math.min(42, Math.cos(((activeMidAngle - 90) * Math.PI) / 180) * 26)),
                },
              ],
            },
          ]}
        >
          <ChartTooltip
            title={data[activeIndex]?.label}
            subtitle={`${Math.round((data[activeIndex]?.value / total) * 100)}%`}
            value={valueFormatter(data[activeIndex]?.value)}
            accentColor={data[activeIndex]?.color}
          />
        </Animated.View>
      )}
      <View style={{ paddingTop: 28, alignItems: 'center' }}>
        <Svg width={size} height={size}>
          {data.map((item) => {
            const sweepAngle = total ? (item.value / total) * 360 : 0;
            const endAngle = startAngle + sweepAngle;
            const currentIndex = data.findIndex((entry) => entry.label === item.label);
            const isActive = currentIndex === activeIndex;
            const isInactive = activeIndex !== null && !isActive;
            const midAngle = startAngle + sweepAngle / 2;
            const popout = isActive ? 8 : 0;
            const centerShift = polarToCartesian(0, 0, popout, midAngle);
            const path = createArcPath(
              outerRadius + centerShift.x,
              outerRadius + centerShift.y,
              outerRadius - 2,
              innerRadius + 2,
              startAngle + 1.5,
              endAngle - 1.5
            );
            if (isActive) {
              activeMidAngle = midAngle;
            }
            startAngle = endAngle;

            return (
              <Path
                key={item.label}
                d={path}
                fill={item.color}
                opacity={isInactive ? 0.32 : 1}
                onPress={() => setActive(isActive ? null : currentIndex)}
                onPressIn={() => setActive(currentIndex)}
                {...(Platform.OS === 'web'
                  ? {
                      onMouseEnter: () => setActive(currentIndex),
                      onMouseLeave: () => setActive(null),
                    }
                  : {})}
              />
            );
          })}
        </Svg>
      </View>
      <View style={styles.legend}>
        {data.map((item, index) => (
          <Pressable key={item.label} style={styles.legendRow} onPress={() => setActive(activeIndex === index ? null : index)}>
            <View style={styles.legendLabelWrap}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
            </View>
            <Text style={styles.legendValue}>{valueFormatter(item.value)}</Text>
          </Pressable>
        ))}
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
    alignSelf: 'center',
    minWidth: 104,
    zIndex: 2,
  },
  legend: {
    gap: 8,
    marginTop: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    color: theme.colors.textSecondary,
    ...theme.typography.body,
  },
  legendValue: {
    color: theme.colors.textPrimary,
    ...theme.typography.bodyMedium,
  },
});
