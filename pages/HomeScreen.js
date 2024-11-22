import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Alert 
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavoriteModal from "../components/FavoriteModal";
import Icon from 'react-native-vector-icons/Ionicons';
import { LogOut } from 'lucide-react-native';

const TREFLE_API_KEY = "AMtIuuWIJr-qQhfY1j8vomJg1Oawjn6V1naEf4aSJAo";
const TREFLE_API_URL = "https://trefle.io/api/v1/plants";

const HomeScreen = ({ navigation }) => {
  const [plants, setPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchPlants();
    loadFavorites();
  }, []);

  const handleSignOut = async () => {
    try {
      // Hapus data user dari AsyncStorage
      await AsyncStorage.removeItem('user');
      
      // Reset navigasi ke Login screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const fetchPlants = async () => {
    try {
      const response = await fetch(`${TREFLE_API_URL}?token=${TREFLE_API_KEY}`);
      const data = await response.json();
      setPlants(data.data || []);
      setFilteredPlants(data.data || []);
    } catch (error) {
      console.error("Error fetching plants:", error);
      Alert.alert("Error", "Failed to fetch plants");
    }
  };


  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredPlants(plants);
    } else {
      const filtered = plants.filter((plant) =>
        plant.common_name?.toLowerCase().includes(query.toLowerCase()) ||
        plant.scientific_name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPlants(filtered);
    }
  };

  const handleToggleFavorite = async (plant) => {
    setSelectedPlant(plant);
    setShowFavoriteModal(true);
  };

  const confirmToggleFavorite = async () => {
    try {
      const isFavorite = favorites.some((fav) => fav.id === selectedPlant.id);
      const updatedFavorites = isFavorite
        ? favorites.filter((fav) => fav.id !== selectedPlant.id)
        : [...favorites, selectedPlant];

      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorite plants');
    } finally {
      setShowFavoriteModal(false);
    }
  };

  const renderPlantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.plantItem}
      onPress={() => navigation.navigate("PlantDetail", { plant: item })}
    >
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
        <TouchableOpacity 
          onPress={() => handleToggleFavorite(item)}
          style={styles.favoriteButton}
        >
          <Icon 
            name="heart" 
            size={22} 
            color={favorites.some(fav => fav.id === item.id) ? '#2ecc71' : '#bdc3c7'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Tumboh - Our Home</Text>
        <TouchableOpacity onPress={handleSignOut}>
          {/* Ganti Icon heart dengan LogOut */}
          <LogOut size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search plants by name..."
          placeholderTextColor="#95a5a6"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      
      <FlatList
        data={filteredPlants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPlantItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      
      {showFavoriteModal && (
        <FavoriteModal
          plant={selectedPlant}
          onClose={() => setShowFavoriteModal(false)}
          onConfirm={confirmToggleFavorite}
        />
      )}
    </View>
  );
};

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
  favoriteButton: {
    alignSelf: 'flex-start',
  },
});

export default HomeScreen;