import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useCallback, useEffect, useState } from "react";

import { HomePage } from "../../pages/homepage";
import { MapsPage } from "../../pages/maps";
import { FavoritesPage } from "../../pages/favorites";
import { ReservesPage } from "../../pages/reserves";
import { ProfilePage } from "../../pages/profile";

import {
  HomeIcon,
  MapsIcon,
  FavoritesIcon,
  ReservesIcon,
  ProfileIcon,
} from "./icons";

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();


const TABS = [
  { name: "Home", component: HomePage, Icon: HomeIcon },
  { name: "Maps", component: MapsPage, Icon: MapsIcon },
  { name: "Favorites", component: FavoritesPage, Icon: FavoritesIcon },
  { name: "Reserves", component: ReservesPage, Icon: ReservesIcon },
  { name: "Profile", component: ProfilePage, Icon: ProfileIcon },
] as const;

const TAB_COUNT = TABS.length;

const ACTIVE_COLOR = "#F2B705";
const INDICATOR_WIDTH = 28;
const INDICATOR_HEIGHT = 3;


function AnimatedTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const indicatorX = useSharedValue(0);
  const activeIndex = state.index;

  const tabWidth = barWidth > 0 ? barWidth / TAB_COUNT : 0;


  const getIndicatorX = useCallback(
    (index: number) => {
      if (tabWidth <= 0) return 0;
      return index * tabWidth + tabWidth / 2 - INDICATOR_WIDTH / 2;
    },
    [tabWidth],
  );


  useEffect(() => {
    if (tabWidth > 0) {
      indicatorX.value = withSpring(getIndicatorX(activeIndex), {
        damping: 20,
        stiffness: 220,
        mass: 0.7,
      });
    }
  }, [activeIndex, tabWidth]);


  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
      className="absolute left-0 right-0 bottom-0 bg-second flex-row items-center pt-3"
      style={{
        paddingBottom: insets.bottom > 0 ? insets.bottom + 20 : 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 24,
      }}
    >

      {barWidth > 0 && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: -1,
              left: 0,
              width: INDICATOR_WIDTH,
              height: INDICATOR_HEIGHT,
              borderRadius: INDICATOR_HEIGHT / 2,
              backgroundColor: ACTIVE_COLOR,

              shadowColor: ACTIVE_COLOR,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.7,
              shadowRadius: 8,
              elevation: 6,
            },
            indicatorAnimatedStyle,
          ]}
        />
      )}

      {/* Tabs */}
      {state.routes.map((route, index) => {
        const isFocused = activeIndex === index;

        function onPress() {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }

        return (
          <AnimatedTab
            key={route.key}
            index={index}
            isFocused={isFocused}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}


function AnimatedTab({
  index,
  isFocused,
  onPress,
}: {
  index: number;
  isFocused: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFocused) {
      scale.value = withSpring(1.2, {
        damping: 10,
        stiffness: 280,
        mass: 0.6,
      });
    } else {
      scale.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const { Icon } = TABS[index];

  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center justify-center py-2"
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={animatedIconStyle}>
        <Icon focused={isFocused} />
      </Animated.View>
    </Pressable>
  );
}

export const BottomNavigation = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {TABS.map(({ name, component }) => (
        <Tab.Screen key={name} name={name} component={component} />
      ))}
    </Tab.Navigator>
  );
};
