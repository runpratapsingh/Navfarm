import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {COLORS, FONTFAMILY} from '../theme/theme';
import {useTab} from '../hooks/TabContext';
import DashboardScreen from '../screens/DrawerScreens/DashBoard/Dashboard';
import DataEntryScreen from '../screens/DrawerScreens/DataEntryScreen/DataEntry';
import BatchCreation from '../screens/DrawerScreens/DailyDataEntryScreen/DailyDataEntry';
import HomeScreen from '../screens/DrawerScreens/Home/HomeScreen';

const screenMap = {
  Dashboard: DashboardScreen,
  DataEntry: DataEntryScreen,
  'Daily Data Entry': BatchCreation,
  Categories: HomeScreen,
};

const TabItem = React.memo(({tab, isActive, onPress}) => {
  const scale = useSharedValue(isActive ? 1.1 : 1);
  const opacity = useSharedValue(isActive ? 1 : 0.7);

  useEffect(() => {
    scale.value = withTiming(isActive ? 1.1 : 1, {duration: 200});
    opacity.value = withTiming(isActive ? 1 : 0.7, {duration: 200});
  }, [isActive, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={tab.name}>
      <Animated.View style={animatedStyle}>
        <View style={styles.icons}>
          <Icon
            name={tab.icon}
            size={20}
            color={isActive ? COLORS.SecondaryColor : '#000'}
          />
        </View>
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {tab.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
});

const BottomNavigation = ({route}) => {
  const {activeTab: routeActiveTab} = route.params || {};
  const {activeTab, setActiveTab} = useTab();
  const insets = useSafeAreaInsets();
  const {width} = Dimensions.get('window');
  const tabWidth = width / 4;

  const translateX = useSharedValue(0);

  const tabs = [
    {name: 'Dashboard', icon: 'tachometer-alt'},
    {name: 'DataEntry', icon: 'keyboard'},
    {name: 'Daily Data Entry', icon: 'object-group'},
    {name: 'Categories', icon: 'layer-group'},
  ];

  useEffect(() => {
    if (routeActiveTab && routeActiveTab !== activeTab) {
      setActiveTab(routeActiveTab);
    }
  }, [routeActiveTab]); // Only re-run the effect if routeActiveTab changes

  const handleTabPress = useCallback(
    (tabName, index) => {
      if (tabName !== activeTab) {
        setActiveTab(tabName);
        translateX.value = withTiming(index * tabWidth, {duration: 300});
      }
    },
    [activeTab, setActiveTab, translateX, tabWidth],
  );

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.name === activeTab);
    if (index !== -1) {
      translateX.value = withTiming(index * tabWidth, {duration: 300});
    }
  }, [activeTab, translateX, tabWidth]);

  const animatedUnderlineStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
    width: tabWidth,
  }));

  const renderContent = () => {
    const ActiveScreen = screenMap[activeTab];
    return ActiveScreen ? (
      <ActiveScreen />
    ) : (
      <View style={styles.content}>
        <Text style={styles.contentText}>Loading...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#2E313F'}}>
      <View style={styles.container}>
        <StatusBar
          backgroundColor={COLORS.primaryColor}
          barStyle="light-content"
        />
        {renderContent()}
        <View style={[styles.bottomNavigation]}>
          {tabs.map((tab, index) => (
            <TabItem
              key={tab.name}
              tab={tab}
              isActive={activeTab === tab.name}
              onPress={() => handleTabPress(tab.name, index)}
            />
          ))}
          <Animated.View style={[styles.underline, animatedUnderlineStyle]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryColor,
  },
  contentText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  bottomNavigation: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primaryColor,
  },
  tabText: {
    fontSize: 11,
    color: '#333',
    marginTop: 4,
    fontFamily: FONTFAMILY.regular,
  },
  activeTabText: {
    color: COLORS.SecondaryColor,
    fontWeight: '500',
  },
  underline: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: COLORS.SecondaryColor,
  },
  icons: {
    alignItems: 'center',
  },
});

export default BottomNavigation;
