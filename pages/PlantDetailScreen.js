import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  Image, 
  ScrollView,
  TouchableOpacity 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Loader from '../components/Loader';

export default function PlantDetailScreen({ navigation, route }) {
  const { plant } = route.params; // Mengubah dari plantId ke plant object langsung
  const [plantDetail, setPlantDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = 'AMtIuuWIJr-qQhfY1j8vomJg1Oawjn6V1naEf4aSJAo';

  useEffect(() => {
    fetchPlantDetail();
  }, []);

  const fetchPlantDetail = async () => {
    try {
      const response = await fetch(
        `https://trefle.io/api/v1/plants/${plant.id}?token=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch plant details');
      }
      const result = await response.json();
      setPlantDetail(result.data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (!plantDetail) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No plant details available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant Details</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        contentContainerStyle={styles.contentContainer}
      >
        {plant.image_url && (
          <Image 
            source={{ uri: plant.image_url || "https://via.placeholder.com/250" }} 
            style={styles.image} 
          />
        )}
        
        <Text style={styles.name}>
          {plant.common_name || 'Unknown Common Name'}
        </Text>
        
        <Text style={styles.scientificName}>
          {plant.scientific_name || 'Unknown Scientific Name'}
        </Text>
        
        <View style={styles.detailsContainer}>
          <DetailRow 
            label="Year" 
            value={plantDetail.year || 'N/A'} 
          />
          
          <DetailRow 
            label="Bibliography" 
            value={plantDetail.bibliography || 'No bibliography available'} 
          />
          
          <DetailRow 
            label="Author" 
            value={plantDetail.author || 'Unknown'} 
          />
          
          <DetailRow 
            label="Status" 
            value={plantDetail.status || 'N/A'} 
          />
          
          <DetailRow 
            label="Rank" 
            value={plantDetail.rank || 'N/A'} 
          />
        </View>
      </ScrollView>
    </View>
  );
}

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#f0f4f0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
    resizeMode: 'cover',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#2ecc71',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  scientificName: {
    fontSize: 16,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  detailText: {
    fontSize: 16,
    color: '#7f8c8d',
    flex: 1,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 50,
  },
});