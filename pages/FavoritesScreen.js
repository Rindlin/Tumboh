import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Loader from '../components/Loader';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const storedFavorites = await AsyncStorage.getItem('favorites');
      const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      setFavorites(parsedFavorites);
      setSearchResults(parsedFavorites);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch favorite plants');
    } finally {
      setLoading(false);
    }
  };

  const filteredFavorites = useMemo(() => {
    if (query) {
      return favorites.filter((plant) =>
        (plant.common_name?.toLowerCase() || '').includes(query.toLowerCase())
      );
    } else {
      return favorites;
    }
  }, [favorites, query]);

  useEffect(() => {
    setSearchResults(filteredFavorites);
  }, [filteredFavorites]);

  const handleToggleFavorite = async (plant) => {
    try {
      const updatedFavorites = favorites.filter((fav) => fav.id !== plant.id);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite plants');
    }
  };

  if (loading) return <Loader />;
  if (!loading && favorites.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Icon name="heart-outline" size={100} color="#b0bec5" />
          <Text style={styles.emptyMessage}>No favorite plants yet</Text>
          <Text style={styles.emptySubMessage}>Start exploring and add some plants!</Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>Explore Plants</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.plantItem}>
      <Image
        source={{ uri: item.image_url || "https://via.placeholder.com/150" }}
        style={styles.plantImage}
        resizeMode="cover"
      />
      <View style={styles.plantInfoContainer}>
        <Text style={styles.plantName} numberOfLines={1}>
          {item.common_name || "Unknown Plant"}
        </Text>
        <Text style={styles.plantScientific} numberOfLines={1}>
          {item.scientific_name || "Unknown Scientific Name"}
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleToggleFavorite(item)}
            style={styles.removeButton}
          >
            <Icon name="heart-dislike" size={18} color="#fff" />
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('PlantDetail', { plant: item })}
            style={styles.detailButton}
          >
            <Icon name="information-circle" size={18} color="#fff" />
            <Text style={styles.buttonText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.favoriteCount}>{favorites.length} Plants</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search favorite plants..."
          placeholderTextColor="#95a5a6"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      
      <FlatList
        data={searchResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#f0f4f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
  },
  favoriteCount: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchIcon: {
    position: 'absolute',
    left: 30,
    zIndex: 1,
  },
  searchBar: {
    flex: 1,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingLeft: 50,
    fontSize: 16,
    color: '#2c3e50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyMessage: {
    fontSize: 22,
    color: '#2c3e50',
    marginTop: 20,
    fontWeight: '600',
  },
  emptySubMessage: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 3,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  plantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plantImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  plantInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  plantScientific: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 10,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
});