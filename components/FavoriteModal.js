// /components/FavoriteModal.js

import React from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';

export default function FavoriteModal({ visible, onClose, onConfirm }) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.text}>Add this plant to favorites?</Text>
          <View style={styles.buttons}>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={onClose} color="#FF6347" />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Confirm" onPress={onConfirm} color="#32CD32" />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5, // Memberikan efek bayangan pada Android
    shadowColor: '#000', // Efek bayangan untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
});
