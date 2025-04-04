import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {requireImage} from '../../utils/JSON/Images';
import api from '../../Apiconfig/ApiconfigWithInterceptor';

import {API_ENDPOINTS} from '../../Apiconfig/Apiconfig';
import {navigate} from '../../utils/services/NavigationService';
import {appStorage} from '../../utils/services/StorageHelper';

const initialData = [
  {key: 'poultry', label: 'Poultry', image: requireImage.poultry},
  {key: 'aqua', label: 'Aqua', image: requireImage.aqua},
  {key: 'livestock', label: 'Livestock', image: requireImage.livestock},
  {key: 'agriculture', label: 'Agriculture', image: requireImage.agriculture},
];

const Card = ({image, label, item}) => {
  const scale = useSharedValue(1);
  const borderRadius = useSharedValue(20);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: withSpring(scale.value)}],
      borderRadius: withSpring(borderRadius.value),
    };
  });

  const OnpressOutClick = async () => {
    try {
      scale.value = 1;
      borderRadius.value = 10;
      console.log('Card clicked:', item);
      await appStorage.setSelectedCategory(item);
      navigate('Drawer', {});
    } catch (error) {
      console.log('Error in OnpressOutClick:', error);
    }
  };

  return (
    <TouchableOpacity
      onPressIn={() => {
        scale.value = 1.1;
        borderRadius.value = 15;
      }}
      onPressOut={OnpressOutClick}
      style={styles.card}
      activeOpacity={1}>
      <Animated.View style={[styles.iconContainer, animatedStyle]}>
        <Image source={image} style={styles.image} />
      </Animated.View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const CategorySelection = () => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const userDataString = await appStorage.getUserData();
      const commonDetails = await appStorage.getCommonDetails();

      console.log('Inside getDashboardData', userDataString);

      if (!userDataString) {
        console.error('No user data found in Found');
        return;
      }

      const userData = userDataString;
      const commonDetailsData = commonDetails;
      console.log('Common Details:', commonDetailsData);
      console.log('User Data:', userData);

      if (!userData.companY_ID || !commonDetailsData.naturE_ID) {
        console.error('Company ID and natureId is missing from user data');
        return;
      }

      const response = await api.get(API_ENDPOINTS.Dashboard_NOB, {
        params: {
          Company_Id: userData.companY_ID,
          nature_id: commonDetailsData.naturE_ID,
        },
      });

      const nobData = response.data.data.nob;
      const filteredNobData = nobData.filter(item => item.selected);
      console.log(
        'Dashboard Data111:-----',
        response.data.data,
        filteredNobData,
      );

      // Map filteredNobData to the structure of initialData
      const updatedData = filteredNobData.map(item => {
        const key = item.text.toLowerCase(); // Assuming 'text' in filteredNobData matches 'label' in initialData
        return {
          key: key,
          label: item.text,
          image: requireImage[key],
          value: item.value,
          selected: item.selected,
        };
      });

      setData(updatedData);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const renderItem = ({item}) => (
    <Card image={item.image} label={item.label} item={item} />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      {!loading && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.key}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  card: {
    width: '80%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 20,
    alignSelf: 'center',
  },
  iconContainer: {
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategorySelection;
